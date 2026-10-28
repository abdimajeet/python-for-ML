# day73_exam_stats.py
# Exam statistics with NumPy. Each "# %%" starts a notebook cell in VS Code.

# %% Setup: fake but realistic scores
import numpy as np

rng = np.random.default_rng(2026)
subjects = np.array(["Maths", "Physics", "English", "History", "CS"])
students = np.array([f"S{i:02d}" for i in range(1, 31)])

ability = rng.normal(65, 12, size=(30, 1))            # each student's general level
subject_bias = np.array([0, -3, 4, 2, 5])             # some exams are easier
noise = rng.normal(0, 8, size=(30, 5))
scores = np.clip(np.round(ability + subject_bias + noise), 0, 100).astype(int)
scores[:, 1] = np.clip(np.round(0.6 * scores[:, 0] + 0.4 * scores[:, 1]), 0, 100)  # physics follows maths

print("shape:", scores.shape, "dtype:", scores.dtype)
print(scores[:5])

# %% Per-subject statistics (axis=0 means "down the rows")
print(f"{'subject':<9}{'mean':>7}{'median':>8}{'std':>7}{'min':>5}{'max':>5}{'pass%':>7}")
for name, col in zip(subjects, scores.T):
    print(f"{name:<9}{col.mean():>7.1f}{np.median(col):>8.1f}{col.std():>7.1f}"
          f"{col.min():>5}{col.max():>5}{(col >= 50).mean():>7.0%}")

# %% Per-student averages and ranking (axis=1 means "across the columns")
averages = scores.mean(axis=1)
order = np.argsort(averages)[::-1]            # indexes from best to worst
print("Top 5 students:")
for rank, i in enumerate(order[:5], start=1):
    print(f"  {rank}. {students[i]}  average {averages[i]:.1f}  scores {scores[i]}")

# %% Best student in each subject
best = scores.argmax(axis=0)
for subject, i in zip(subjects, best):
    print(f"  {subject:<8} {students[i]} with {scores[i, list(subjects).index(subject)]}")

# %% Boolean masks: who needs help?
failing = scores < 50
needs_help = failing.sum(axis=1) >= 2
print(f"{needs_help.sum()} students failed two or more subjects:", students[needs_help])

# %% Standardise to z-scores: how unusual is each score within its subject?
z = (scores - scores.mean(axis=0)) / scores.std(axis=0)
i, j = np.unravel_index(np.abs(z).argmax(), z.shape)
print(f"Most unusual score: {students[i]} in {subjects[j]}: {scores[i, j]} (z = {z[i, j]:+.2f})")

# %% Which subjects go together? (correlation matrix)
corr = np.corrcoef(scores.T)
print("        " + "".join(f"{s[:7]:>8}" for s in subjects))
for name, row in zip(subjects, corr):
    print(f"{name:<8}" + "".join(f"{v:>8.2f}" for v in row))
