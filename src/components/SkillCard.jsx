import React from "react";
import ProgressBar from "./ProgressBar";

function SkillCard({ skill, onEdit, onDelete }) {
  return (
    <div className="card skill-card">
      <div className="row-between">
        <h3>{skill.name}</h3>
        <span className={"badge badge-" + skill.status.toLowerCase()}>{skill.status}</span>
      </div>

      <p className="muted">
        {skill.category} · {skill.difficulty}
      </p>

      {skill.description && <p className="small">{skill.description}</p>}

      <ProgressBar value={skill.progress} />
      <p className="small">{skill.progress}% complete</p>

      {skill.targetDate && <p className="muted small">Target: {skill.targetDate}</p>}

      <div className="card-actions">
        <button className="btn btn-light" onClick={() => onEdit(skill)}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(skill.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default SkillCard;
