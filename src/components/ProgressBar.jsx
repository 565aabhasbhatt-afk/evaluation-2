import React from "react";

function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: value + "%" }}></div>
    </div>
  );
}

export default ProgressBar;
