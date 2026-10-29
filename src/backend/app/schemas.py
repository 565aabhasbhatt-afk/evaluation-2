#data validation (pydantic will be used) main flow between fast api and frontend

from typing import Literal

from pydantic import BaseModel, Field, model_validator


class GoalInput(BaseModel):
    goal_difficulty: Literal["Easy", "Medium", "Hard"]

    expected_days_to_complete: int = Field(
        ge=3,
        le=76
    )

    completed_milestones: int = Field(
        ge=0,
        le=15
    )

    total_milestones: int = Field(
        ge=3,
        le=15
    )

    study_hours_per_day: float = Field(
        ge=0.2,
        le=4.6
    )

    study_sessions_per_week: int = Field(
        ge=1,
        le=7
    )

    goal_category: Literal[
        "Programming",
        "Machine Learning",
        "Web Development",
        "DSA",
        "Database",
        "Other",
    ]

    @model_validator(mode="after")
    def validate_milestones(self):
        if self.completed_milestones > self.total_milestones:
            raise ValueError(
                "Completed milestones cannot exceed total milestones."
            )

        return self


class PredictionResponse(BaseModel):
    completion_probability: float
    completion_likelihood: Literal["low", "medium", "high"]
    progress_percentage: float
    prediction: int
    note: str
