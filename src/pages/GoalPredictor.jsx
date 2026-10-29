import React, { useState } from "react";
import { predictGoalCompletion } from "../services/predictorApi";
import { Sparkles, AlertCircle, CheckCircle2, XCircle, Loader2, TrendingUp } from "lucide-react";
import "./GoalPredictor.css";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

const CATEGORY_OPTIONS = [
  "Machine Learning",
  "Programming",
  "Web Development",
  "DSA",
  "Database",
  "Other",
];

const DEFAULT_FORM = {
  goal_difficulty: "Medium",
  expected_days_to_complete: 30,
  completed_milestones: 0,
  total_milestones: 10,
  study_hours_per_day: 2,
  study_sessions_per_week: 5,
  goal_category: "Machine Learning",
};

function GoalPredictor() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [touched, setTouched] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-calculated milestone progress
  const completedMilestones = Number(formData.completed_milestones) || 0;
  const totalMilestones = Number(formData.total_milestones) || 0;
  const progressPercent =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Validation function
  const validate = (values) => {
    const errors = {};
    const days = Number(values.expected_days_to_complete);
    const total = Number(values.total_milestones);
    const completed = Number(values.completed_milestones);
    const hours = Number(values.study_hours_per_day);
    const sessions = Number(values.study_sessions_per_week);

    if (values.expected_days_to_complete === "" || isNaN(days) || days < 3 || days > 76) {
      errors.expected_days_to_complete = "Expected days must be an integer between 3 and 76.";
    }

    if (values.total_milestones === "" || isNaN(total) || total < 3 || total > 15) {
      errors.total_milestones = "Total milestones must be an integer between 3 and 15.";
    }

    if (values.completed_milestones === "" || isNaN(completed) || completed < 0 || completed > 15) {
      errors.completed_milestones = "Completed milestones must be an integer between 0 and 15.";
    } else if (!isNaN(total) && completed > total) {
      errors.completed_milestones = "Completed milestones cannot exceed total milestones.";
    }

    if (values.study_hours_per_day === "" || isNaN(hours) || hours < 0.2 || hours > 4.6) {
      errors.study_hours_per_day = "Study hours per day must be between 0.2 and 4.6.";
    }

    if (values.study_sessions_per_week === "" || isNaN(sessions) || sessions < 1 || sessions > 7) {
      errors.study_sessions_per_week = "Sessions per week must be an integer between 1 and 7.";
    }

    return errors;
  };

  const errors = validate(formData);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields touched
    setTouched({
      expected_days_to_complete: true,
      completed_milestones: true,
      total_milestones: true,
      study_hours_per_day: true,
      study_sessions_per_week: true,
      goal_difficulty: true,
      goal_category: true,
    });

    const currentErrors = validate(formData);
    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      goal_difficulty: formData.goal_difficulty,
      expected_days_to_complete: parseInt(formData.expected_days_to_complete, 10),
      completed_milestones: parseInt(formData.completed_milestones, 10),
      total_milestones: parseInt(formData.total_milestones, 10),
      study_hours_per_day: parseFloat(formData.study_hours_per_day),
      study_sessions_per_week: parseInt(formData.study_sessions_per_week, 10),
      goal_category: formData.goal_category,
    };

    try {
      const result = await predictGoalCompletion(payload);
      setPrediction(result);
    } catch (err) {
      setError(
        err.message || "Could not reach prediction service. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Interpretation generator
  const getInterpretation = (pred) => {
    if (!pred) return "";

    const likelihood = (pred.completion_likelihood || "").toLowerCase();
    const isCompleted = pred.prediction === 1;

    if (likelihood === "high" || (isCompleted && pred.completion_probability >= 70)) {
      return "Strong completion outlook! Your planned study pace and milestone targets align well for successful goal completion on schedule.";
    }

    if (likelihood === "medium" || pred.completion_probability >= 40) {
      return "Moderate completion outlook. Keeping a consistent weekly study rhythm and completing your upcoming milestones on time will be critical to reaching your goal.";
    }

    return "Challenging completion outlook. Consider extending your completion timeframe, breaking milestones into smaller parts, or dedicating more daily study time.";
  };

  return (
    <div className="goal-predictor-container">
      {/* Page Header */}
      <div className="page-head">
        <h1>Goal Completion Predictor</h1>
        <p className="muted">
          Estimate the likelihood of completing your learning goal based on your study plan and
          milestones.
        </p>
      </div>

      {/* Main Grid: Form on Left, Results on Right */}
      <div className="predictor-grid">
        {/* Left Card: Goal Details Form */}
        <div className="card">
          <div className="predictor-card-header">
            <h2>Goal Details</h2>
            <p>Enter your learning target parameters and study schedule.</p>
          </div>

          <form className="predictor-form" onSubmit={handleSubmit} noValidate>
            <div className="predictor-form-grid">
              {/* Goal Category */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="goal_category">
                  Goal Category
                </label>
                <select
                  id="goal_category"
                  name="goal_category"
                  className="predictor-select"
                  value={formData.goal_category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal Difficulty */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="goal_difficulty">
                  Goal Difficulty
                </label>
                <select
                  id="goal_difficulty"
                  name="goal_difficulty"
                  className="predictor-select"
                  value={formData.goal_difficulty}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Days */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="expected_days_to_complete">
                  <span>Expected Days</span>
                  <span className="predictor-range-hint">3–76 days</span>
                </label>
                <input
                  id="expected_days_to_complete"
                  name="expected_days_to_complete"
                  type="number"
                  min="3"
                  max="76"
                  step="1"
                  className={`predictor-input ${
                    touched.expected_days_to_complete && errors.expected_days_to_complete
                      ? "has-error"
                      : ""
                  }`}
                  value={formData.expected_days_to_complete}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.expected_days_to_complete && errors.expected_days_to_complete && (
                  <p className="predictor-field-error">{errors.expected_days_to_complete}</p>
                )}
              </div>

              {/* Total Milestones */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="total_milestones">
                  <span>Total Milestones</span>
                  <span className="predictor-range-hint">3–15</span>
                </label>
                <input
                  id="total_milestones"
                  name="total_milestones"
                  type="number"
                  min="3"
                  max="15"
                  step="1"
                  className={`predictor-input ${
                    touched.total_milestones && errors.total_milestones ? "has-error" : ""
                  }`}
                  value={formData.total_milestones}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.total_milestones && errors.total_milestones && (
                  <p className="predictor-field-error">{errors.total_milestones}</p>
                )}
              </div>

              {/* Completed Milestones */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="completed_milestones">
                  <span>Completed Milestones</span>
                  <span className="predictor-range-hint">0–{formData.total_milestones || 15}</span>
                </label>
                <input
                  id="completed_milestones"
                  name="completed_milestones"
                  type="number"
                  min="0"
                  max={formData.total_milestones || 15}
                  step="1"
                  className={`predictor-input ${
                    touched.completed_milestones && errors.completed_milestones ? "has-error" : ""
                  }`}
                  value={formData.completed_milestones}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.completed_milestones && errors.completed_milestones && (
                  <p className="predictor-field-error">{errors.completed_milestones}</p>
                )}
              </div>

              {/* Study Hours Per Day */}
              <div className="predictor-field">
                <label className="predictor-label" htmlFor="study_hours_per_day">
                  <span>Study Hours / Day</span>
                  <span className="predictor-range-hint">0.2–4.6 hrs</span>
                </label>
                <input
                  id="study_hours_per_day"
                  name="study_hours_per_day"
                  type="number"
                  min="0.2"
                  max="4.6"
                  step="0.1"
                  className={`predictor-input ${
                    touched.study_hours_per_day && errors.study_hours_per_day ? "has-error" : ""
                  }`}
                  value={formData.study_hours_per_day}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.study_hours_per_day && errors.study_hours_per_day && (
                  <p className="predictor-field-error">{errors.study_hours_per_day}</p>
                )}
              </div>

              {/* Study Sessions Per Week */}
              <div className="predictor-field predictor-field-full">
                <label className="predictor-label" htmlFor="study_sessions_per_week">
                  <span>Study Sessions / Week</span>
                  <span className="predictor-range-hint">1–7 sessions</span>
                </label>
                <input
                  id="study_sessions_per_week"
                  name="study_sessions_per_week"
                  type="number"
                  min="1"
                  max="7"
                  step="1"
                  className={`predictor-input ${
                    touched.study_sessions_per_week && errors.study_sessions_per_week
                      ? "has-error"
                      : ""
                  }`}
                  value={formData.study_sessions_per_week}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.study_sessions_per_week && errors.study_sessions_per_week && (
                  <p className="predictor-field-error">{errors.study_sessions_per_week}</p>
                )}
              </div>
            </div>

            {/* Live Milestone Progress Display */}
            <div className="milestone-preview">
              <div className="milestone-preview-top">
                <span className="milestone-preview-title">Milestone Progress</span>
                <span className="milestone-preview-percent">
                  {Math.min(Math.max(progressPercent, 0), 100)}%
                </span>
              </div>
              <div className="milestone-progress-bar">
                <div
                  className="milestone-progress-fill"
                  style={{
                    width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
                  }}
                />
              </div>
              <p className="milestone-preview-caption">
                {formData.completed_milestones || 0} of {formData.total_milestones || 0} milestones
                completed (automatically calculated)
              </p>
            </div>

            {/* Submit Button */}
            <button type="submit" className="predictor-submit-btn" disabled={loading || !isValid}>
              {loading ? (
                <>
                  <Loader2 size={16} className="predictor-loading-spinner" />
                  <span>Predicting Goal Completion...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Predict Goal Completion</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Card: Prediction Results */}
        <div className="card">
          <div className="predictor-card-header">
            <h2>Prediction Results</h2>
            <p>AI forecast based on your plan metrics and historical trends.</p>
          </div>

          {/* API Error Alert if present */}
          {error && (
            <div className="predictor-error-alert" role="alert">
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4>Prediction Failed</h4>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="predictor-loading-state">
              <Loader2 size={36} className="predictor-loading-spinner" />
              <p>Analyzing study plan parameters...</p>
            </div>
          )}

          {/* Empty State (Before first prediction) */}
          {!loading && !prediction && !error && (
            <div className="predictor-empty-state">
              <div className="predictor-empty-icon">
                <TrendingUp size={24} />
              </div>
              <h3>No prediction yet</h3>
              <p>
                Configure your goal details and study plan on the left, then click{" "}
                <strong>Predict Goal Completion</strong> to compute your estimated outcome.
              </p>
            </div>
          )}

          {/* Successful Prediction Display */}
          {!loading && prediction && (
            <div className="result-content">
              {/* Primary Metric: Completion Probability & Likelihood */}
              <div className="result-primary-metric">
                <div>
                  <p className="result-metric-label">Completion Probability</p>
                  <p className="result-metric-value">{prediction.completion_probability}%</p>
                </div>
                <div className="result-badge-col">
                  <span className="result-metric-label">Likelihood</span>
                  <span
                    className={`likelihood-badge likelihood-${(
                      prediction.completion_likelihood || "medium"
                    ).toLowerCase()}`}
                  >
                    {(prediction.completion_likelihood || "MEDIUM").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="result-stats-row">
                <div className="result-stat-box">
                  <p className="result-stat-label">Predicted Class</p>
                  <div className="result-stat-val">
                    {prediction.prediction === 1 ? (
                      <span className="result-class-tag result-class-success">
                        <CheckCircle2 size={16} /> Goal Completed
                      </span>
                    ) : (
                      <span className="result-class-tag result-class-warning">
                        <XCircle size={16} /> Goal Not Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="result-stat-box">
                  <p className="result-stat-label">Milestone Progress</p>
                  <div className="result-stat-val">
                    <span>{prediction.progress_percentage}%</span>
                  </div>
                </div>
              </div>

              {/* Friendly Interpretation */}
              <div className="result-interpretation">
                <p>{getInterpretation(prediction)}</p>
              </div>

              {/* Model Explanatory Note */}
              {prediction.note && (
                <div className="result-note-box">
                  <p>{prediction.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalPredictor;
