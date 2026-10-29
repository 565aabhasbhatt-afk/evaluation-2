import React, { useState } from "react";
import SkillCard from "../components/SkillCard";

function Skills() {
  // Toggle form visibility
  const [showForm, setShowForm] = useState(false);

  // Form input states
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [progress, setProgress] = useState(0);
  const [targetDate, setTargetDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Learning");

  // Track if we are editing an existing skill (ID or null)
  const [editId, setEditId] = useState(null);

  // Filter and sort state
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Progress");

  // Initial skills list
  const [skills, setSkills] = useState([
    {
      id: 1,
      name: "Python",
      category: "Programming",
      difficulty: "Beginner",
      progress: 80,
      targetDate: "2026-09-01",
      description: "Learning Python programming",
      status: "Learning",
    },
    {
      id: 2,
      name: "Machine Learning",
      category: "AI",
      difficulty: "Intermediate",
      progress: 65,
      targetDate: "2026-10-01",
      description: "Learning machine learning concepts",
      status: "Learning",
    },
    {
      id: 3,
      name: "SQL",
      category: "Database",
      difficulty: "Beginner",
      progress: 50,
      targetDate: "2026-09-15",
      description: "Learning SQL and databases",
      status: "Learning",
    },
    {
      id: 4,
      name: "React",
      category: "Web Development",
      difficulty: "Beginner",
      progress: 40,
      targetDate: "2026-10-15",
      description: "Learning React basics",
      status: "Paused",
    },
  ]);

  // Clear form fields and close form
  function clearForm() {
    setSkillName("");
    setCategory("");
    setDifficulty("Beginner");
    setProgress(0);
    setTargetDate("");
    setDescription("");
    setStatus("Learning");
    setEditId(null);
    setShowForm(false);
  }

  // Handle Add or Edit submission
  function submit(event) {
    event.preventDefault();

    if (editId === null) {
      // Add new skill with unique ID
      const newSkill = {
        id: Date.now(),
        name: skillName,
        category,
        difficulty,
        progress: Number(progress),
        targetDate,
        description,
        status,
      };
      setSkills([...skills, newSkill]);
    } else {
      // Update existing skill
      const updated = skills.map((skill) => {
        if (skill.id === editId) {
          return {
            ...skill,
            name: skillName,
            category,
            difficulty,
            progress: Number(progress),
            targetDate,
            description,
            status,
          };
        }
        return skill;
      });
      setSkills(updated);
    }

    clearForm();
  }

  // Populate form with existing skill data for editing
  function editSkill(skill) {
    setSkillName(skill.name);
    setCategory(skill.category);
    setDifficulty(skill.difficulty);
    setProgress(skill.progress);
    setTargetDate(skill.targetDate);
    setDescription(skill.description);
    setStatus(skill.status);
    setEditId(skill.id);
    setShowForm(true);
  }

  // Delete skill by ID
  function deleteSkill(id) {
    const updated = skills.filter((skill) => skill.id !== id);
    setSkills(updated);
  }

  // Filter skills by selected status and sort them
  const visibleSkills = skills
    .filter((skill) => {
      if (filter === "All") return true;
      return skill.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === "Progress") {
        return b.progress - a.progress;
      }
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div>
      {/* Page Heading */}
      <div className="page-head row-between">
        <div>
          <h1>My Skills</h1>
          <p className="muted">
            Everything you're learning, with live progress.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            clearForm();
            setShowForm(!showForm);
          }}
        >
          + Add Skill
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <form className="card mt" onSubmit={submit}>
          <h2>{editId === null ? "Add a new skill" : "Edit skill"}</h2>

          <div className="form-grid mt">
            <label className="field">
              Skill name
              <input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </label>

            <label className="field">
              Category
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>

            <label className="field">
              Difficulty
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <label className="field">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Learning</option>
                <option>Paused</option>
                <option>Completed</option>
              </select>
            </label>

            <label className="field">
              Progress (%)
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </label>

            <label className="field">
              Target date
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </label>

            <label className="field">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
              />
            </label>
          </div>

          <div className="card-actions">
            <button className="btn btn-primary" type="submit">
              {editId === null ? "Add Skill" : "Save Skill"}
            </button>
            <button
              className="btn btn-light"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="toolbar mt">
        {["All", "Learning", "Paused", "Completed"].map((statusOption) => (
          <button
            key={statusOption}
            className={
              filter === statusOption ? "btn btn-primary" : "btn btn-light"
            }
            onClick={() => setFilter(statusOption)}
          >
            {statusOption}
          </button>
        ))}

        <span className="muted small">Sort by:</span>

        <select
          className="btn"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option>Progress</option>
          <option>Name</option>
        </select>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-3">
        {visibleSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onEdit={editSkill}
            onDelete={deleteSkill}
          />
        ))}
      </div>
    </div>
  );
}

export default Skills;