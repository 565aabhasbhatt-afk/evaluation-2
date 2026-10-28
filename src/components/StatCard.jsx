import React from "react";

function StatCard({ label, value, icon }) {
  return (
    <div className="card stat-card">
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
      <span className="stat-icon">{icon}</span>
    </div>
  );
}

export default StatCard;
