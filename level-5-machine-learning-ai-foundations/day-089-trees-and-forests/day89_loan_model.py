# day89_loan_model.py
# Readable decision tree vs accurate random forest, with explanations.

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text

rng = np.random.default_rng(89)


def make_applicants(n: int = 3000) -> pd.DataFrame:
    df = pd.DataFrame({
        "income": rng.lognormal(10.6, 0.5, n).round(-2),            # yearly
        "credit_score": rng.normal(660, 70, n).clip(300, 850).round(),
        "years_employed": rng.exponential(5, n).round(1),
        "existing_debt": rng.lognormal(8.5, 1.0, n).round(-2),
        "past_default": rng.random(n) < 0.08,
        "purpose": rng.choice(["home", "car", "education", "business", "holiday"], n),
    })
    df["loan_amount"] = (df["income"] * rng.uniform(0.1, 1.2, n)).round(-2)
    burden = (df["loan_amount"] + df["existing_debt"]) / df["income"]
    score = (0.02 * (df["credit_score"] - 620) - 2.5 * (burden - 0.8) + 0.08 * df["years_employed"]
             - 2.5 * df["past_default"] + df["purpose"].map({"home": 0.4, "car": 0.2, "education": 0.3,
                                                             "business": -0.3, "holiday": -0.6}))
    df["approved"] = (score + rng.normal(0, 0.6, n) > 0).astype(int)
    return df


def to_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.drop(columns="approved").copy()
    X["debt_to_income"] = ((X["loan_amount"] + X["existing_debt"]) / X["income"]).round(3)
    X["past_default"] = X["past_default"].astype(int)
    return pd.get_dummies(X, columns=["purpose"], dtype=int)


def main() -> None:
    df = make_applicants()
    X, y = to_features(df), df["approved"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=89, stratify=y)
    print(f"{len(df)} applications, {y.mean():.0%} approved")

    print("\nA tree you can read (max_depth=3):")
    small = DecisionTreeClassifier(max_depth=3, random_state=89).fit(X_train, y_train)
    print(export_text(small, feature_names=list(X.columns), decimals=2))

    models = {
        "tree, depth 3": small,
        "tree, unlimited": DecisionTreeClassifier(random_state=89).fit(X_train, y_train),
        "random forest": RandomForestClassifier(n_estimators=300, min_samples_leaf=2,
                                                n_jobs=-1, random_state=89).fit(X_train, y_train),
    }
    print(f"{'model':<17}{'train':>7}{'test':>7}")
    for name, m in models.items():
        print(f"{name:<17}{m.score(X_train, y_train):>7.3f}{m.score(X_test, y_test):>7.3f}")

    forest = models["random forest"]
    built_in = pd.Series(forest.feature_importances_, index=X.columns)
    perm = permutation_importance(forest, X_test, y_test, n_repeats=10, random_state=89, n_jobs=-1)
    shuffled = pd.Series(perm.importances_mean, index=X.columns)
    table = pd.DataFrame({"impurity": built_in, "permutation": shuffled}).sort_values("permutation", ascending=False)
    print("\nFeature importance (permutation = accuracy lost when the column is shuffled):")
    print(table.round(3).head(8).to_string())

    applicant = X_test.iloc[[0]]
    chance = forest.predict_proba(applicant)[0, 1]
    print("\nOne applicant:")
    print(applicant.T.rename(columns={applicant.index[0]: "value"}).head(6).to_string())
    print(f"Forest's approval probability: {chance:.0%}")
    print("Path through the small tree:")
    tree = small.tree_
    node = 0
    while tree.children_left[node] != -1:
        feature = X.columns[tree.feature[node]]
        value = applicant.iloc[0][feature]
        goes_left = value <= tree.threshold[node]
        print(f"  {feature} = {value:g} {'<=' if goes_left else '>'} {tree.threshold[node]:.2f}")
        node = tree.children_left[node] if goes_left else tree.children_right[node]
    counts = tree.value[node][0]
    print(f"  -> leaf says {'approve' if counts.argmax() == 1 else 'reject'}")


if __name__ == "__main__":
    main()
