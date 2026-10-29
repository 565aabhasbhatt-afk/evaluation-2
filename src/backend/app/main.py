# fast api code




from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import GoalInput, PredictionResponse


# --------------------------------------------------
# 1. Define paths
# --------------------------------------------------

BACKEND_DIR = Path(__file__).resolve().parents[1]

MODEL_PATH = (
    BACKEND_DIR
    / "models"
    / "goal_completion_pipeline.joblib"
)


# --------------------------------------------------
# 2. Load the trained ML model
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model not found at: {MODEL_PATH}. "
            "Run train_model.py before starting the API."
        )

    app.state.model = joblib.load(MODEL_PATH)

    yield


# --------------------------------------------------
# 3. Create the FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="SkillSphere Goal Completion Predictor",
    description="Predicts the likelihood of goal completion.",
    version="1.0.0",
    lifespan=lifespan,
)


# --------------------------------------------------
# 4. Configure CORS for React
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# 5. Home endpoint
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "SkillSphere Goal Completion Predictor API",
        "docs": "/docs",
    }


# --------------------------------------------------
# 6. Health-check endpoint
# --------------------------------------------------

@app.get("/health")
def health():
    model = getattr(app.state, "model", None)

    return {
        "status": "ok",
        "model_loaded": model is not None,
    }


# --------------------------------------------------
# 7. Prediction endpoint
# --------------------------------------------------

@app.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict_goal_completion(data: GoalInput):

    model = getattr(app.state, "model", None)

    if model is None:
        raise HTTPException(
            status_code=503,
            detail="The ML model is not loaded.",
        )

    # Calculate progress from completed milestones
    progress = round(
        data.completed_milestones
        / data.total_milestones
        * 100,
        2,
    )

    # Create input using the exact training feature names
    input_data = pd.DataFrame(
        [
            {
                "goal_difficulty": data.goal_difficulty,
                "expected_days_to_complete":
                    data.expected_days_to_complete,
                "completed_milestones":
                    data.completed_milestones,
                "total_milestones":
                    data.total_milestones,
                "study_hours_per_day":
                    data.study_hours_per_day,
                "study_sessions_per_week":
                    data.study_sessions_per_week,
                "goal_category": data.goal_category,
            }
        ]
    )

    try:
        # Predict the class
        prediction = int(model.predict(input_data)[0])

        # Find the probability belonging to class 1
        probabilities = model.predict_proba(input_data)[0]
        classes = list(model.classes_)
        positive_index = classes.index(1)

        probability = float(
            probabilities[positive_index]
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Prediction failed. Ensure the saved model "
                "was trained using the current dataset features."
            ),
        ) from exc

    # Convert probability to a percentage
    probability_percentage = round(
        probability * 100,
        2,
    )

    # Assign a likelihood label
    if probability >= 0.70:
        likelihood = "high"
    elif probability >= 0.40:
        likelihood = "medium"
    else:
        likelihood = "low"

    return PredictionResponse(
        completion_probability=probability_percentage,
        completion_likelihood=likelihood,
        progress_percentage=progress,
        prediction=prediction,
        note=(
            "This is a prototype estimate based on synthetic "
            "data. It has not been validated on real student outcomes."
        ),
    )
