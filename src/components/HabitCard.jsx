import React from "react";

function HabitCard({ habit, onToggle, onDelete }) {
  return (
    <div className={habit.done ? "card habit-card habit-done" : "card habit-card"}>
      <label className="habit-main">
        <input type="checkbox" checked={habit.done} onChange={() => onToggle(habit.id)} />
        <span>
          <span className="habit-name">{habit.name}</span>
          <span className="muted small block">
            {habit.frequency} · {habit.category} · 🔥 {habit.streak} day streak
          </span>
        </span>
      </label>

      {onDelete && (
        <button className="btn btn-danger" onClick={() => onDelete(habit.id)}>
          Delete
        </button>
      )}
    </div>
  );
}

export default HabitCard;
