
from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)


# --------------------------------------------------
# 1. Define project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

# Correct dataset filename
DATA_PATH = BASE_DIR / "data" / "goal_completion.csv"

MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "goal_completion_pipeline.joblib"


# --------------------------------------------------
# 2. Load the dataset
# --------------------------------------------------

if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at: {DATA_PATH}\n"
        "Make sure goal_completion.csv is inside src/backend/data."
    )

df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Dataset shape:", df.shape)

print("\nFirst five rows:")
print(df.head())


# --------------------------------------------------
# 3. Validate dataset columns
# --------------------------------------------------

FEATURES = [
    "goal_difficulty",
    "expected_days_to_complete",
    "completed_milestones",
    "total_milestones",
    "study_hours_per_day",
    "study_sessions_per_week",
    "goal_category",
]

TARGET = "goal_completed"

required_columns = FEATURES + [TARGET]

missing_columns = set(required_columns) - set(df.columns)

if missing_columns:
    raise ValueError(
        f"Missing required columns: {sorted(missing_columns)}"
    )

if df[required_columns].isnull().any().any():
    raise ValueError("Dataset contains missing values.")

if not set(df[TARGET].unique()).issubset({0, 1}):
    raise ValueError(
        "goal_completed must contain only 0 and 1."
    )

if not df["goal_difficulty"].isin(
    ["Easy", "Medium", "Hard"]
).all():
    raise ValueError("Unexpected goal_difficulty values.")

if not df["goal_category"].isin(
    [
        "Programming",
        "Machine Learning",
        "Web Development",
        "DSA",
        "Database",
        "Other",
    ]
).all():
    raise ValueError("Unexpected goal_category values.")

if (df["expected_days_to_complete"] < 1).any():
    raise ValueError("Expected days must be at least 1.")

if (df["completed_milestones"] < 0).any():
    raise ValueError("Completed milestones cannot be negative.")

if (df["total_milestones"] < 1).any():
    raise ValueError("Total milestones must be at least 1.")

if (
    df["completed_milestones"] > df["total_milestones"]
).any():
    raise ValueError(
        "Completed milestones cannot exceed total milestones."
    )

if (df["study_hours_per_day"] <= 0).any():
    raise ValueError("Study hours must be positive.")

if not df["study_sessions_per_week"].between(1, 7).all():
    raise ValueError(
        "Study sessions per week must be between 1 and 7."
    )

print("\nDataset validation passed!")


# --------------------------------------------------
# 4. Separate features and target
# --------------------------------------------------

X = df[FEATURES]
y = df[TARGET].astype(int)

print("\nFeature columns:")
print(FEATURES)

print("\nTarget distribution:")
print(y.value_counts().sort_index())


# --------------------------------------------------
# 5. Identify categorical and numerical features
# --------------------------------------------------

categorical_features = [
    "goal_difficulty",
    "goal_category",
]

numerical_features = [
    "expected_days_to_complete",
    "completed_milestones",
    "total_milestones",
    "study_hours_per_day",
    "study_sessions_per_week",
]


# --------------------------------------------------
# 6. Create preprocessing pipeline
# --------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features,
        ),
        (
            "numerical",
            StandardScaler(),
            numerical_features,
        ),
    ]
)


# --------------------------------------------------
# 7. Create ML pipeline
# --------------------------------------------------

model_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            LogisticRegression(
                max_iter=2000,
                random_state=42,
            ),
        ),
    ]
)


# --------------------------------------------------
# 8. Split the dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 9. Train the model
# --------------------------------------------------

model_pipeline.fit(X_train, y_train)

print("\nModel training completed!")


# --------------------------------------------------
# 10. Evaluate the model
# --------------------------------------------------

y_pred = model_pipeline.predict(X_test)

classifier = model_pipeline.named_steps["classifier"]
positive_index = list(classifier.classes_).index(1)

y_prob = model_pipeline.predict_proba(X_test)[:, positive_index]

print("\nAccuracy:", round(accuracy_score(y_test, y_pred), 4))

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        labels=[0, 1],
        target_names=[
            "Goal Not Completed",
            "Goal Completed",
        ],
        zero_division=0,
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred, labels=[0, 1]))

if y_test.nunique() == 2:
    print(
        "\nROC-AUC:",
        round(roc_auc_score(y_test, y_prob), 4),
    )


# --------------------------------------------------
# 11. Save the trained model
# --------------------------------------------------

MODEL_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(model_pipeline, MODEL_PATH)

print("\nModel saved successfully!")
print("Saved location:", MODEL_PATH)


# --------------------------------------------------
# 12. Test a sample prediction
# --------------------------------------------------

sample_goal = pd.DataFrame(
    [
        {
            "goal_difficulty": "Medium",
            "expected_days_to_complete": 30,
            "completed_milestones": 4,
            "total_milestones": 10,
            "study_hours_per_day": 2.5,
            "study_sessions_per_week": 5,
            "goal_category": "Machine Learning",
        }
    ],
    columns=FEATURES,
)

prediction = int(model_pipeline.predict(sample_goal)[0])

sample_probabilities = model_pipeline.predict_proba(sample_goal)[0]
probability = float(sample_probabilities[positive_index])

print("\nSample Goal Prediction")
print("----------------------")
print(
    "Prediction:",
    "Goal Completed" if prediction == 1 else "Goal Not Completed",
)
print("Predicted class:", prediction)
print(f"Completion probability: {probability * 100:.2f}%")

