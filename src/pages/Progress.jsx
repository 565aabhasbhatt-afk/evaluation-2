import React, { useState, useEffect } from "react";

// =============================================================================
// Helper Functions & Constants
// =============================================================================

function formatDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const getTodayDate = () => formatDate();
const getRelativeDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
};

// Convert YYYY-MM-DD into readable format: "Oct 26, 2026"
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-");
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

// Initial empty form state helper
const getInitialFormData = () => ({
  subject: "",
  customSubject: "",
  learned: "",
  confidence: 0,
  difficult: "",
  nextStep: "",
  date: getTodayDate(),
});

const STORAGE_KEY = "skillsphere_reflections";

// Sample starter reflections
const sampleReflections = [
  { id: 1, subject: "React", customSubject: "", learned: "Implemented controlled form inputs using React state (useState) and dynamic onChange handlers to handle user input synchronously.", confidence: 4, difficult: "Understanding how to prevent event bubbling and managing simultaneous inline validation errors on form submission.", nextStep: "Practice writing custom reusable form validation hooks and test with edge cases.", date: getTodayDate() },
  { id: 2, subject: "AI/ML", customSubject: "", learned: "Studied gradient descent optimization and cost function minimization in supervised linear regression models.", confidence: 3, difficult: "Selecting the optimal learning rate (alpha) to avoid either slow convergence or divergent oscillations.", nextStep: "Code gradient descent from scratch in Python using NumPy and plot cost reduction curves.", date: getRelativeDate(1) },
  { id: 3, subject: "SQL/DBMS", customSubject: "", learned: "Practiced multi-table INNER and LEFT JOINs along with aggregate GROUP BY and HAVING clauses for complex queries.", confidence: 5, difficult: "Resolving ambiguous column naming and optimizing nested subquery execution time on large schemas.", nextStep: "Solve 5 Medium SQL problems on LeetCode focused on window functions and indexing.", date: getRelativeDate(3) },
];

// Quick suggestions for next step field
const NEXT_STEP_SUGGESTIONS = [
  "Solve 5 practice problems on this topic",
  "Revise documentation & concept notes",
  "Build a mini project feature to test this",
  "Debug with console logs & inspect edge cases",
  "Explain the core concept to a peer or rubber duck",
];

// Confidence ratings (1 to 5) with labels and emojis
const CONFIDENCE_LEVELS = [
  { level: 1, label: "Not confident", hint: "Need complete revision", emoji: "🔴" },
  { level: 2, label: "Slightly confident", hint: "Basic grasp, struggling with syntax", emoji: "🟠" },
  { level: 3, label: "Moderately confident", hint: "Understand concept, need more practice", emoji: "🟡" },
  { level: 4, label: "Confident", hint: "Can implement independently", emoji: "🟢" },
  { level: 5, label: "Very confident", hint: "Mastered! Can explain and teach it", emoji: "🌟" },
];

// Reusable inline form error badge
function FormError({ error, touched }) {
  if (!error || !touched) return null;
  return <div className="error-message" role="alert"><span>⚠️</span> {error}</div>;
}

export default function Progress() {
  // ---------------------------------------------------------------------------
  // 1. Component State
  // ---------------------------------------------------------------------------
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Reflections list loaded from localStorage (fallback to sample data)
  const [reflections, setReflections] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load reflections from localStorage:", e);
    }
    return sampleReflections;
  });

  const [filterSubject, setFilterSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------------------------------------------------------------------
  // 2. Side Effects
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
    } catch (e) {
      console.error("Failed to save reflections to localStorage:", e);
    }
  }, [reflections]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ---------------------------------------------------------------------------
  // 3. Form Validation Logic (Main Project Feature)
  // ---------------------------------------------------------------------------
  function validateForm(values) {
    const newErrors = {};

    // 1. Subject dropdown validation
    if (!values.subject || values.subject.trim() === "") {
      newErrors.subject = "Please select a subject or skill from the dropdown.";
    } else if (values.subject === "Other" && (!values.customSubject || values.customSubject.trim().length < 2)) {
      newErrors.customSubject = "Please specify your custom subject (minimum 2 characters).";
    }

    // 2. What learned validation (required & min 10 characters)
    if (!values.learned || values.learned.trim() === "") {
      newErrors.learned = "This field is required. Please describe what concept or skill you learned.";
    } else if (values.learned.trim().length < 10) {
      newErrors.learned = `Please elaborate on your learning (entered ${values.learned.trim().length}/10 min characters).`;
    }

    // 3. Confidence rating validation (must select 1 to 5)
    if (!values.confidence || values.confidence < 1 || values.confidence > 5) {
      newErrors.confidence = "Please select your confidence rating on the 1 to 5 scale.";
    }

    // 4. Difficulty validation (required & min 10 characters)
    if (!values.difficult || values.difficult.trim() === "") {
      newErrors.difficult = "This field is required. Describe what challenges or difficulties you encountered.";
    } else if (values.difficult.trim().length < 10) {
      newErrors.difficult = `Please describe the difficulty in more detail (entered ${values.difficult.trim().length}/10 min characters).`;
    }

    // 5. Next step validation (required & min 5 characters)
    if (!values.nextStep || values.nextStep.trim() === "") {
      newErrors.nextStep = "This field is required. Outline what you plan to practice or revise next.";
    } else if (values.nextStep.trim().length < 5) {
      newErrors.nextStep = `Please write a specific next step (entered ${values.nextStep.trim().length}/5 min characters).`;
    }

    // 6. Reflection date validation (required, valid, not in future)
    if (!values.date || values.date.trim() === "") {
      newErrors.date = "Please select a reflection date.";
    } else {
      const selectedDate = new Date(values.date + "T00:00:00");
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (isNaN(selectedDate.getTime())) {
        newErrors.date = "Please select a valid date.";
      } else if (selectedDate > today) {
        newErrors.date = "Reflection date cannot be in the future (reflections record completed learning).";
      }
    }

    return newErrors;
  }

  // ---------------------------------------------------------------------------
  // 4. Input Event Handlers
  // ---------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateForm(formData);
    if (fieldErrors[name]) setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleConfidenceClick = (rating) => {
    setFormData((prev) => ({ ...prev, confidence: rating }));
    if (errors.confidence) setErrors((prev) => ({ ...prev, confidence: "" }));
  };

  const handleApplySuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, nextStep: suggestion }));
    if (errors.nextStep) setErrors((prev) => ({ ...prev, nextStep: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({ subject: true, customSubject: true, learned: true, confidence: true, difficult: true, nextStep: true, date: true });
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const activeSubject = formData.subject === "Other" ? formData.customSubject.trim() : formData.subject;

      const newReflection = {
        id: Date.now(),
        subject: activeSubject,
        customSubject: formData.customSubject,
        learned: formData.learned.trim(),
        confidence: Number(formData.confidence),
        difficult: formData.difficult.trim(),
        nextStep: formData.nextStep.trim(),
        date: formData.date,
      };

      setReflections((prev) => [newReflection, ...prev]);
      setSuccessMessage({
        title: "Reflection Saved Successfully!",
        subject: activeSubject,
        confidence: formData.confidence,
        date: formatDisplayDate(formData.date),
      });

      setFormData(getInitialFormData());
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }, 500);
  };

  const handleResetForm = () => {
    if (formData.learned || formData.difficult || formData.nextStep || formData.subject) {
      if (!window.confirm("Are you sure you want to clear your current reflection inputs?")) return;
    }
    setFormData(getInitialFormData());
    setErrors({});
    setTouched({});
    setSuccessMessage(null);
  };

  const handleDeleteReflection = (id) => {
    if (window.confirm("Do you want to delete this learning reflection?")) {
      setReflections((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // ---------------------------------------------------------------------------
  // 5. Analytics Calculations & Filtering
  // ---------------------------------------------------------------------------
  const totalReflections = reflections.length;
  const avgConfidence = totalReflections > 0
    ? (reflections.reduce((sum, r) => sum + (r.confidence || 0), 0) / totalReflections).toFixed(1)
    : "0.0";

  const subjectCounts = {};
  reflections.forEach((r) => {
    const s = r.subject || "General";
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
  });

  let topSubject = "None", maxCount = 0;
  for (const s in subjectCounts) {
    if (subjectCounts[s] > maxCount) {
      maxCount = subjectCounts[s];
      topSubject = s;
    }
  }

  const metrics = [
    { label: "Total Reflections", value: totalReflections, icon: "📝" },
    { label: "Avg. Confidence", value: `${avgConfidence} / 5`, icon: "⭐" },
    { label: "Top Subject", value: topSubject, icon: "🎯", isTop: true },
    { label: "Active Next Steps", value: totalReflections, icon: "🚀" },
  ];

  const filteredReflections = reflections.filter((item) => {
    const matchesSubject = filterSubject === "All" || item.subject.toLowerCase() === filterSubject.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    return matchesSubject && (
      query === "" ||
      item.subject.toLowerCase().includes(query) ||
      item.learned.toLowerCase().includes(query) ||
      item.difficult.toLowerCase().includes(query) ||
      item.nextStep.toLowerCase().includes(query)
    );
  });

  const selectedConfidenceMeta = CONFIDENCE_LEVELS.find((c) => c.level === formData.confidence);

  // ---------------------------------------------------------------------------
  // 6. JSX Markup
  // ---------------------------------------------------------------------------
  return (
    <div className="reflection-page">
      {/* Page Heading */}
      <div className="page-head">
        <h1>Learning Reflection</h1>
        <p className="muted">Reflect on your learning, understand your challenges, and plan your next step.</p>
      </div>

      {/* Overview Analytics Bar */}
      <div className="metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="metric-icon-box">{m.icon}</div>
            <div className="metric-content">
              <h4>{m.label}</h4>
              <p style={m.isTop ? { fontSize: "18px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" } : {}}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="success-banner" role="alert">
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <div>
              <strong style={{ fontSize: "15px" }}>{successMessage.title}</strong>
              <div style={{ fontSize: "13px", marginTop: "3px" }}>
                Recorded for <strong>{successMessage.subject}</strong> on {successMessage.date} with a confidence rating of <strong>{successMessage.confidence}/5</strong>.
              </div>
            </div>
          </div>
          <button type="button" onClick={() => setSuccessMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "inherit", padding: "0 4px" }} title="Dismiss notification">✕</button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="reflection-workspace">
        {/* Left Column: Reflection Form */}
        <div className="form-card">
          <div className="form-header-bar">
            <div className="form-header-title">
              <span style={{ fontSize: "22px" }}>✍️</span>
              <div>
                <h2>Log Today's Reflection</h2>
                <span className="form-hint">All fields are validated using React state management</span>
              </div>
            </div>
            <button type="button" onClick={handleResetForm} className="btn btn-light" style={{ fontSize: "12px", padding: "5px 10px" }} title="Clear all fields">
              Reset Form
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Subject Dropdown */}
            <div className="form-group">
              <label htmlFor="subject-select" className="form-label">
                1. Subject or skill <span className="required-star">*</span>
              </label>
              <select id="subject-select" name="subject" value={formData.subject} onChange={handleChange} onBlur={handleBlur} className={`input-control ${errors.subject && touched.subject ? "input-error-border" : ""}`} aria-invalid={errors.subject ? "true" : "false"}>
                <option value="">-- Select a subject or skill --</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
                <option value="SQL/DBMS">SQL / DBMS</option>
                <option value="AI/ML">AI / ML (Artificial Intelligence & Machine Learning)</option>
                <option value="Other">Other (Custom Subject)</option>
              </select>
              <FormError error={errors.subject} touched={touched.subject} />

              {formData.subject === "Other" && (
                <div style={{ marginTop: "10px" }}>
                  <label htmlFor="custom-subject-input" className="form-label" style={{ fontSize: "13px" }}>
                    Specify Subject / Skill Name <span className="required-star">*</span>
                  </label>
                  <input id="custom-subject-input" type="text" name="customSubject" value={formData.customSubject} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., Data Structures, Node.js, Docker, Computer Networks" className={`input-control ${errors.customSubject && touched.customSubject ? "input-error-border" : ""}`} />
                  <FormError error={errors.customSubject} touched={touched.customSubject} />
                </div>
              )}
            </div>

            {/* Field 6: Reflection Date */}
            <div className="form-group">
              <label htmlFor="date-input" className="form-label">
                6. Reflection date <span className="required-star">*</span>
              </label>
              <input id="date-input" type="date" name="date" value={formData.date} max={getTodayDate()} onChange={handleChange} onBlur={handleBlur} className={`input-control ${errors.date && touched.date ? "input-error-border" : ""}`} aria-invalid={errors.date ? "true" : "false"} />
              <span className="form-hint">Defaulted to today ({formatDisplayDate(getTodayDate())}). Future dates are disabled.</span>
              <FormError error={errors.date} touched={touched.date} />
            </div>

            {/* Field 3: Confidence Scale (1 to 5) */}
            <div className="form-group">
              <label className="form-label">
                3. How confident do you feel? <span className="required-star">*</span>
              </label>
              <div className="confidence-scale-container">
                <div style={{ fontSize: "12px", color: "var(--muted-text)", display: "flex", justifyContent: "space-between" }}>
                  <span>Scale: 1 = Not confident</span>
                  <span>5 = Very confident</span>
                </div>
                <div className="confidence-buttons-row">
                  {CONFIDENCE_LEVELS.map((item) => (
                    <button key={item.level} type="button" onClick={() => handleConfidenceClick(item.level)} className={`confidence-btn ${formData.confidence === item.level ? "active" : ""}`} title={`${item.level} - ${item.label}: ${item.hint}`} aria-pressed={formData.confidence === item.level}>
                      <span className="confidence-btn-emoji">{item.emoji}</span>
                      <span className="confidence-btn-num">{item.level}</span>
                    </button>
                  ))}
                </div>
                {selectedConfidenceMeta ? (
                  <div className="confidence-status-badge">
                    <span>{selectedConfidenceMeta.emoji}</span>
                    <span>Rated <strong>{selectedConfidenceMeta.level}/5</strong> &mdash; {selectedConfidenceMeta.label} ({selectedConfidenceMeta.hint})</span>
                  </div>
                ) : (
                  <span className="form-hint" style={{ marginTop: "8px" }}>Select a rating from 1 (Not confident) to 5 (Very confident).</span>
                )}
              </div>
              <FormError error={errors.confidence} touched={true} />
            </div>

            {/* Field 2: What did you learn today? */}
            <div className="form-group">
              <label htmlFor="learned-textarea" className="form-label">
                2. What did you learn today? <span className="required-star">*</span>
              </label>
              <textarea id="learned-textarea" name="learned" rows={3} value={formData.learned} onChange={handleChange} onBlur={handleBlur} placeholder="Describe the key concept, algorithm, library, or topic you learned today (e.g., React controlled inputs, SQL window functions, Backpropagation in ML)..." className={`input-control ${errors.learned && touched.learned ? "input-error-border" : ""}`} aria-invalid={errors.learned ? "true" : "false"} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="form-hint">Describe the concept or problem solved (min. 10 characters).</span>
                <span style={{ fontSize: "11px", color: formData.learned.trim().length >= 10 ? "#16a34a" : "var(--muted-text)" }}>{formData.learned.trim().length} chars</span>
              </div>
              <FormError error={errors.learned} touched={touched.learned} />
            </div>

            {/* Field 4: What was difficult? */}
            <div className="form-group">
              <label htmlFor="difficult-textarea" className="form-label">
                4. What was difficult? <span className="required-star">*</span>
              </label>
              <textarea id="difficult-textarea" name="difficult" rows={3} value={formData.difficult} onChange={handleChange} onBlur={handleBlur} placeholder="Describe a challenging concept, syntax issue, debugging hurdle, or mental block you encountered..." className={`input-control ${errors.difficult && touched.difficult ? "input-error-border" : ""}`} aria-invalid={errors.difficult ? "true" : "false"} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="form-hint">Identify your learning bottleneck (min. 10 characters).</span>
                <span style={{ fontSize: "11px", color: formData.difficult.trim().length >= 10 ? "#16a34a" : "var(--muted-text)" }}>{formData.difficult.trim().length} chars</span>
              </div>
              <FormError error={errors.difficult} touched={touched.difficult} />
            </div>

            {/* Field 5: What is your next step? */}
            <div className="form-group">
              <label htmlFor="nextstep-input" className="form-label">
                5. What is your next step? <span className="required-star">*</span>
              </label>
              <input id="nextstep-input" type="text" name="nextStep" value={formData.nextStep} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., Practise 5 LeetCode problems, revise concept notes, or build a mini project component" className={`input-control ${errors.nextStep && touched.nextStep ? "input-error-border" : ""}`} aria-invalid={errors.nextStep ? "true" : "false"} />
              <span className="form-hint">Quick action suggestions (click to use):</span>
              <div className="suggestions-row">
                {NEXT_STEP_SUGGESTIONS.map((item, idx) => (
                  <button key={idx} type="button" onClick={() => handleApplySuggestion(item)} className="suggestion-chip">+ {item}</button>
                ))}
              </div>
              <FormError error={errors.nextStep} touched={touched.nextStep} />
            </div>

            {/* Form Action Buttons */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "24px" }}>
              <button type="submit" disabled={isSubmitting} className="btn-submit-primary">
                {isSubmitting ? <><span className="spinner"></span><span>Saving Reflection...</span></> : <><span style={{ fontSize: "16px" }}>💾</span><span>Save Reflection</span></>}
              </button>
              <button type="button" onClick={handleResetForm} disabled={isSubmitting} className="btn btn-light" style={{ padding: "10px 16px" }}>
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: History & Self-Assessment List */}
        <div className="history-card">
          <div className="row-between" style={{ marginBottom: "14px" }}>
            <div>
              <h2 style={{ fontSize: "19px", margin: 0 }}>Self-Assessment History</h2>
              <span className="small muted">{filteredReflections.length} of {reflections.length} reflections shown</span>
            </div>
            <span className="badge badge-completed">Saved locally</span>
          </div>

          <div className="history-controls">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "12px" }}>Filter by Subject:</label>
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="input-control" style={{ padding: "7px 10px", fontSize: "13px" }}>
                  <option value="All">All Subjects</option>
                  <option value="React">React</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="SQL/DBMS">SQL / DBMS</option>
                  <option value="AI/ML">AI / ML</option>
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "12px" }}>Search Notes:</label>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search keywords..." className="input-control" style={{ padding: "7px 10px", fontSize: "13px" }} />
              </div>
            </div>
          </div>

          <div style={{ maxHeight: "680px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredReflections.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--muted-text)", border: "1px dashed var(--line)", borderRadius: "10px" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔍</div>
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>No reflections found</h3>
                <p className="small">
                  {searchQuery || filterSubject !== "All"
                    ? "Try adjusting your search query or subject filter."
                    : "Fill out the form on the left to record your first reflection."}
                </p>
              </div>
            ) : (
              filteredReflections.map((item) => {
                const confMeta = CONFIDENCE_LEVELS.find((c) => c.level === item.confidence) || { label: "Moderate", emoji: "🟡" };
                return (
                  <div key={item.id} className="reflection-item">
                    <div className="reflection-item-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className="badge badge-learning" style={{ fontWeight: 600 }}>{item.subject}</span>
                        <span className="badge" style={{ background: "var(--surface)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span>{confMeta.emoji}</span>
                          <span>{item.confidence}/5 ({confMeta.label})</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="small muted" style={{ fontSize: "12px" }}>{formatDisplayDate(item.date)}</span>
                        <button type="button" onClick={() => handleDeleteReflection(item.id)} className="btn-delete-icon" title="Delete this reflection" aria-label="Delete reflection">🗑️</button>
                      </div>
                    </div>
                    <div className="reflection-box-section">
                      <span className="section-tag learned-tag">💡 Learned Concept</span>
                      <p style={{ margin: 0, lineHeight: "1.45" }}>{item.learned}</p>
                    </div>
                    <div className="reflection-box-section difficulty">
                      <span className="section-tag diff-tag">⚠️ Difficulty Encountered</span>
                      <p style={{ margin: 0, lineHeight: "1.45" }}>{item.difficult}</p>
                    </div>
                    <div className="reflection-box-section next-step">
                      <span className="section-tag next-tag">🎯 Next Action Step</span>
                      <p style={{ margin: 0, lineHeight: "1.45", fontWeight: 500 }}>{item.nextStep}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}