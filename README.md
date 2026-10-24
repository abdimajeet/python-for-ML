# python-for-ML

100 days of Python, from beginner to machine learning: daily lessons, exercises and projects, from fundamentals to NumPy, pandas, scikit-learn and PyTorch.

## How each day works

1. **Learn**: read the lesson in the day's `README.md`.
2. **Practise**: try the exercises before opening the solutions.
3. **Build**: write the project yourself, then compare with the code in the folder.
4. **Test**: work through the checklist at the bottom of the README.
5. **Publish**: commit your version to this repository.

Understanding matters more than speed. If a day takes two, that's fine.

## Interactive roadmap

Open [`roadmap/index.html`](roadmap/index.html) in a browser for the clickable version of the course, with progress tracking.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt  # only needed from Level 4 onwards
```

Levels 1 to 3 use only the standard library (plus `requests` and `pytest` in Level 3). Day 98 needs an Anthropic API key in the `ANTHROPIC_API_KEY` environment variable.

## The 100 days

### Level 1: Python Fundamentals

Write, run and debug small programs on your own.

| Day | Topic | Project |
|---|---|---|
| 1 | Hello, Python | [Personal intro card printer](level-1-python-fundamentals/day-001-hello-python/) |
| 2 | Variables and strings | [Mad Libs story generator](level-1-python-fundamentals/day-002-variables-and-strings/) |
| 3 | Numbers and arithmetic | [Tip and bill splitter](level-1-python-fundamentals/day-003-numbers-and-arithmetic/) |
| 4 | Type conversion | [Unit converter](level-1-python-fundamentals/day-004-type-conversion/) |
| 5 | Booleans and comparisons | [Eligibility checker](level-1-python-fundamentals/day-005-booleans-and-comparisons/) |
| 6 | Conditionals | [BMI calculator](level-1-python-fundamentals/day-006-conditionals/) |
| 7 | Logical operators | [Leap-year and grade checker](level-1-python-fundamentals/day-007-logical-operators/) |
| 8 | Putting it together | [Four-function calculator](level-1-python-fundamentals/day-008-putting-it-together/) |
| 9 | while loops | [Number-guessing game](level-1-python-fundamentals/day-009-while-loops/) |
| 10 | for loops and range() | [Multiplication table generator](level-1-python-fundamentals/day-010-for-loops-and-range/) |
| 11 | Reading error messages | [Bug hunt](level-1-python-fundamentals/day-011-reading-error-messages/) |
| 12 | Lists | [To-do list](level-1-python-fundamentals/day-012-lists/) |
| 13 | Slicing and list methods | [Grade-book statistics](level-1-python-fundamentals/day-013-slicing-and-list-methods/) |
| 14 | Tuples and unpacking | [Rock, paper, scissors](level-1-python-fundamentals/day-014-tuples-and-unpacking/) |
| 15 | String methods | [Password strength checker](level-1-python-fundamentals/day-015-string-methods/) |
| 16 | f-strings and formatting | [Shop receipt printer](level-1-python-fundamentals/day-016-f-strings-and-formatting/) |
| 17 | Dictionaries | [Contact book](level-1-python-fundamentals/day-017-dictionaries/) |
| 18 | Sets | [Text comparer](level-1-python-fundamentals/day-018-sets/) |
| 19 | Nested data | [Quiz app with score tracking](level-1-python-fundamentals/day-019-nested-data/) |
| 20 | Level 1 capstone | [Text adventure game](level-1-python-fundamentals/day-020-level-1-capstone/) (capstone) |

### Level 2: Core Python Programming

Write organised programs that solve practical problems with real data.

| Day | Topic | Project |
|---|---|---|
| 21 | Functions | [Refactor the calculator into functions](level-2-core-python-programming/day-021-functions/) |
| 22 | Parameters and return values | [Shipping cost calculator](level-2-core-python-programming/day-022-parameters-and-return-values/) |
| 23 | Scope | [Bank account simulator](level-2-core-python-programming/day-023-scope/) |
| 24 | *args and **kwargs | [Pizza order builder](level-2-core-python-programming/day-024-args-and-kwargs/) |
| 25 | Built-in functions | [Class report card generator](level-2-core-python-programming/day-025-built-in-functions/) |
| 26 | Standard library tour | [Dice roller and password generator](level-2-core-python-programming/day-026-standard-library-tour/) |
| 27 | List comprehensions | [Data filter toolkit](level-2-core-python-programming/day-027-list-comprehensions/) |
| 28 | Dict and set comprehensions | [Word frequency counter](level-2-core-python-programming/day-028-dict-and-set-comprehensions/) |
| 29 | Text files | [Daily journal app](level-2-core-python-programming/day-029-text-files/) |
| 30 | Files and folders | [Downloads folder organiser](level-2-core-python-programming/day-030-files-and-folders/) |
| 31 | Exception handling | [Crash-proof calculator](level-2-core-python-programming/day-031-exception-handling/) |
| 32 | JSON | [To-do list that remembers](level-2-core-python-programming/day-032-json/) |
| 33 | CSV | [Expense tracker](level-2-core-python-programming/day-033-csv/) |
| 34 | Modules and packages | [Expense tracker as a package](level-2-core-python-programming/day-034-modules-and-packages/) |
| 35 | Recursion | [Folder tree printer](level-2-core-python-programming/day-035-recursion/) |
| 36 | Problem solving | [Search and sort by hand](level-2-core-python-programming/day-036-problem-solving/) |
| 37 | Lambdas and sorting | [Game leaderboard ranker](level-2-core-python-programming/day-037-lambdas-and-sorting/) |
| 38 | Dates and times | [Birthday and event countdown](level-2-core-python-programming/day-038-dates-and-times/) |
| 39 | Virtual environments and pip | [QR code generator](level-2-core-python-programming/day-039-virtual-environments-and-pip/) |
| 40 | Level 2 capstone | [Personal finance command-line app](level-2-core-python-programming/day-040-level-2-capstone/) (capstone) |

### Level 3: Intermediate Python & Software Engineering

Build maintainable applications with professional practices.

| Day | Topic | Project |
|---|---|---|
| 41 | Classes and objects | [Pet simulator](level-3-intermediate-python-software-engineering/day-041-classes-and-objects/) |
| 42 | Constructors and methods | [Library book tracker](level-3-intermediate-python-software-engineering/day-042-constructors-and-methods/) |
| 43 | Special methods | [Fraction and vector classes](level-3-intermediate-python-software-engineering/day-043-special-methods/) |
| 44 | Inheritance | [Employee payroll system](level-3-intermediate-python-software-engineering/day-044-inheritance/) |
| 45 | Composition | [Shopping cart with products](level-3-intermediate-python-software-engineering/day-045-composition/) |
| 46 | Encapsulation | [Thermostat with safe limits](level-3-intermediate-python-software-engineering/day-046-encapsulation/) |
| 47 | Iterators | [Music playlist iterator](level-3-intermediate-python-software-engineering/day-047-iterators/) |
| 48 | Generators | [Streaming log-file reader](level-3-intermediate-python-software-engineering/day-048-generators/) |
| 49 | Decorators | [Timer and retry decorators](level-3-intermediate-python-software-engineering/day-049-decorators/) |
| 50 | Context managers | [Safe file writer and code timer](level-3-intermediate-python-software-engineering/day-050-context-managers/) |
| 51 | Type hints and docstrings | [Typed inventory system](level-3-intermediate-python-software-engineering/day-051-type-hints-and-docstrings/) |
| 52 | Testing with pytest | [Test suite for earlier projects](level-3-intermediate-python-software-engineering/day-052-testing-with-pytest/) |
| 53 | Test-driven development | [Password validator built test-first](level-3-intermediate-python-software-engineering/day-053-test-driven-development/) |
| 54 | Debugging and logging | [Add logging to the folder organiser](level-3-intermediate-python-software-engineering/day-054-debugging-and-logging/) |
| 55 | Git and GitHub workflows | [Notes app developed on feature branches](level-3-intermediate-python-software-engineering/day-055-git-and-github-workflows/) |
| 56 | REST APIs | [Weather CLI using a free public API](level-3-intermediate-python-software-engineering/day-056-rest-apis/) |
| 57 | Working with API data | [Currency converter](level-3-intermediate-python-software-engineering/day-057-working-with-api-data/) |
| 58 | SQL fundamentals | [Movie database explorer](level-3-intermediate-python-software-engineering/day-058-sql-fundamentals/) |
| 59 | Database-backed apps | [Habit tracker on SQLite](level-3-intermediate-python-software-engineering/day-059-database-backed-apps/) |
| 60 | Level 3 capstone | [Library management system](level-3-intermediate-python-software-engineering/day-060-level-3-capstone/) (capstone) |

### Level 4: Advanced Python & Data Science Foundations

Write fast, concurrent code and analyse real datasets.

| Day | Topic | Project |
|---|---|---|
| 61 | Advanced functions | [Memoised Fibonacci and speed comparison](level-4-advanced-python-data-science-foundations/day-061-advanced-functions/) |
| 62 | Advanced OOP design | [Pluggable payment processors](level-4-advanced-python-data-science-foundations/day-062-advanced-oop-design/) |
| 63 | Design patterns | [Notification system](level-4-advanced-python-data-science-foundations/day-063-design-patterns/) |
| 64 | Advanced iteration | [Log analysis pipeline](level-4-advanced-python-data-science-foundations/day-064-advanced-iteration/) |
| 65 | Regular expressions I | [Email and phone number extractor](level-4-advanced-python-data-science-foundations/day-065-regular-expressions-i/) |
| 66 | Regular expressions II | [Web server log parser](level-4-advanced-python-data-science-foundations/day-066-regular-expressions-ii/) |
| 67 | Threads | [Concurrent website status checker](level-4-advanced-python-data-science-foundations/day-067-threads/) |
| 68 | Processes | [Parallel prime finder](level-4-advanced-python-data-science-foundations/day-068-processes/) |
| 69 | asyncio basics | [Async timers and countdowns](level-4-advanced-python-data-science-foundations/day-069-asyncio-basics/) |
| 70 | Async networking | [Async API fetcher](level-4-advanced-python-data-science-foundations/day-070-async-networking/) |
| 71 | Performance | [Profile and speed up a slow script](level-4-advanced-python-data-science-foundations/day-071-performance/) |
| 72 | Larger datasets | [Summarise a million-row CSV](level-4-advanced-python-data-science-foundations/day-072-larger-datasets/) |
| 73 | Jupyter and NumPy arrays | [Exam score statistics](level-4-advanced-python-data-science-foundations/day-073-jupyter-and-numpy-arrays/) |
| 74 | NumPy vectorisation | [Image filters on pixel arrays](level-4-advanced-python-data-science-foundations/day-074-numpy-vectorisation/) |
| 75 | pandas DataFrames | [Explore a movies dataset](level-4-advanced-python-data-science-foundations/day-075-pandas-dataframes/) |
| 76 | pandas manipulation | [Sales performance report](level-4-advanced-python-data-science-foundations/day-076-pandas-manipulation/) |
| 77 | Data cleaning | [Clean a messy real-world dataset](level-4-advanced-python-data-science-foundations/day-077-data-cleaning/) |
| 78 | Data visualisation | [Visualise your expense data](level-4-advanced-python-data-science-foundations/day-078-data-visualisation/) |
| 79 | Exploratory data analysis | [Titanic passenger analysis](level-4-advanced-python-data-science-foundations/day-079-exploratory-data-analysis/) |
| 80 | Level 4 capstone | [Data analysis report in a notebook](level-4-advanced-python-data-science-foundations/day-080-level-4-capstone/) (capstone) |

### Level 5: Machine Learning & AI Foundations

Understand and build core ML models, then ship one.

| Day | Topic | Project |
|---|---|---|
| 81 | Linear algebra with NumPy | [Linear algebra toolkit](level-5-machine-learning-ai-foundations/day-081-linear-algebra-with-numpy/) |
| 82 | Statistics and probability | [A/B test simulator](level-5-machine-learning-ai-foundations/day-082-statistics-and-probability/) |
| 83 | Gradients and optimisation | [Gradient descent from scratch](level-5-machine-learning-ai-foundations/day-083-gradients-and-optimisation/) |
| 84 | Linear regression from scratch | [House price predictor](level-5-machine-learning-ai-foundations/day-084-linear-regression-from-scratch/) |
| 85 | scikit-learn workflow | [Regression with scikit-learn](level-5-machine-learning-ai-foundations/day-085-scikit-learn-workflow/) |
| 86 | Classification | [Titanic survival classifier](level-5-machine-learning-ai-foundations/day-086-classification/) |
| 87 | Model evaluation | [Classifier evaluation report](level-5-machine-learning-ai-foundations/day-087-model-evaluation/) |
| 88 | Feature engineering | [Housing pipeline](level-5-machine-learning-ai-foundations/day-088-feature-engineering/) |
| 89 | Trees and forests | [Loan approval model](level-5-machine-learning-ai-foundations/day-089-trees-and-forests/) |
| 90 | Clustering | [Customer segmentation](level-5-machine-learning-ai-foundations/day-090-clustering/) |
| 91 | Dimensionality reduction | [Handwritten digits in 2-D](level-5-machine-learning-ai-foundations/day-091-dimensionality-reduction/) |
| 92 | Overfitting and tuning | [Tune a model properly](level-5-machine-learning-ai-foundations/day-092-overfitting-and-tuning/) |
| 93 | Neural network from scratch | [Tiny network that learns XOR](level-5-machine-learning-ai-foundations/day-093-neural-network-from-scratch/) |
| 94 | PyTorch basics | [Linear regression in PyTorch](level-5-machine-learning-ai-foundations/day-094-pytorch-basics/) |
| 95 | Training neural networks | [MNIST digit classifier](level-5-machine-learning-ai-foundations/day-095-training-neural-networks/) |
| 96 | Text and NLP basics | [Movie review sentiment classifier](level-5-machine-learning-ai-foundations/day-096-text-and-nlp-basics/) |
| 97 | Serving a model | [Prediction API](level-5-machine-learning-ai-foundations/day-097-serving-a-model/) |
| 98 | Working with LLM APIs | [Small study-assistant chatbot](level-5-machine-learning-ai-foundations/day-098-working-with-llm-apis/) |
| 99 | ML project structure | [Refactor an ML project into a package](level-5-machine-learning-ai-foundations/day-099-ml-project-structure/) |
| 100 | Final capstone | [End-to-end ML application](level-5-machine-learning-ai-foundations/day-100-final-capstone/) (capstone) |
