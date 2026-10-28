"""Command-line interface: wine-ml train | predict."""

import argparse
import logging
import sys

import pandas as pd

from wine_ml.config import load_config
from wine_ml.predict import load_model, predict
from wine_ml.train import train


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="wine-ml", description="Train and use a wine classifier.")
    parser.add_argument("--config", default="config.toml", help="path to the TOML config file")
    parser.add_argument("-v", "--verbose", action="store_true", help="show progress messages")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("train", help="train a model and save it with its metrics")
    p_predict = sub.add_parser("predict", help="predict the cultivar for rows in a CSV file")
    p_predict.add_argument("csv", help="CSV file with the 13 measurement columns")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO if args.verbose else logging.WARNING,
                        format="%(levelname)s %(name)s: %(message)s")
    try:
        cfg = load_config(args.config)
        if args.command == "train":
            metrics = train(cfg)
            print(f"Trained {cfg.model.kind}: test accuracy {metrics['test_accuracy']:.1%}, "
                  f"cross-validated {metrics['cv_accuracy']:.1%}. Saved to {cfg.output_dir}/")
        else:
            rows = pd.read_csv(args.csv)
            results = predict(load_model(cfg.output_dir), rows)
            print(results.to_string(index=False))
    except (FileNotFoundError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
