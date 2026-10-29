import React, {
  useState,
} from "react";

import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Edit3,
  Pause,
  Play,
  Trash2,
} from "lucide-react";

import ProgressBar
  from "./ProgressBar";


export default function SkillCard({
  skill,
  onEdit,
  onDelete,
  onToggleTask,
  onTogglePause,
}) {

  const [showTasks, setShowTasks] =
    useState(false);


  const tasks =
    skill.tasks || [];


  const completedTasks =
    tasks.filter(
      (task) =>
        task.completed
    ).length;


  const incompleteTasks =
    tasks.filter(
      (task) =>
        !task.completed
    );


  const visibleTasks =
    showTasks
      ? tasks
      : [
          ...incompleteTasks,
          ...tasks.filter(
            (task) =>
              task.completed
          ),
        ].slice(0, 5);


  const nextTask =
    incompleteTasks[0];


  return (

    <div className="card skill-card">


      {/* HEADER */}

      <div className="skill-card-header">

        <div className="skill-title-section">

          <div className="skill-title-row">

            <h2>
              {skill.name}
            </h2>

            <span
              className={`badge badge-${skill.status
                .toLowerCase()
                .replace(
                  " ",
                  "-"
                )}`}
            >
              {skill.status}
            </span>

          </div>


          <div className="skill-meta">

            <span>
              {skill.category}
            </span>

            <span>•</span>

            <span>
              {skill.difficulty}
            </span>


            {skill.targetDate && (
              <>
                <span>•</span>

                <span>
                  <Calendar
                    size={14}
                  />

                  {skill.targetDate}
                </span>
              </>
            )}

          </div>

        </div>


        {/* EDIT + DELETE */}

        <div className="skill-card-actions">

          <button
            className="icon-btn"
            onClick={() =>
              onEdit(skill)
            }
            title="Edit"
          >
            <Edit3 size={17} />
          </button>


          <button
            className="icon-btn danger"
            onClick={() =>
              onDelete(skill.id)
            }
            title="Delete"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>


      {/* DESCRIPTION */}

      {skill.description && (

        <p className="skill-description">
          {skill.description}
        </p>

      )}


      {/* PROGRESS */}

      <div className="skill-progress-section">

        <div className="progress-header">

          <span>
            Progress
          </span>

          <strong>
            {skill.progress}%
          </strong>

        </div>


        <ProgressBar
          value={
            skill.progress
          }
        />

      </div>


      {/* TASK SUMMARY */}

      <div className="task-summary">

        <div>

          <strong>
            {completedTasks}
            /
            {tasks.length}
          </strong>

          <span>
            {" "}
            tasks completed
          </span>

        </div>


        {nextTask && (

          <div className="next-task">

            Next:{" "}

            <strong>
              {nextTask.title}
            </strong>

          </div>

        )}

      </div>


      {/* CHECKLIST */}

      <div className="task-section">

        <div className="task-section-header">

          <span>
            Learning Checklist
          </span>


          <button
            className="task-toggle"
            onClick={() =>
              setShowTasks(
                !showTasks
              )
            }
          >

            {showTasks ? (
              <>
                Hide
                <ChevronUp
                  size={15}
                />
              </>
            ) : (
              <>
                View Tasks
                <ChevronDown
                  size={15}
                />
              </>
            )}

          </button>

        </div>


        <div className="task-list">

          {visibleTasks.map(
            (task) => (

              <label
                key={task.id}
                className={`task-item ${
                  task.completed
                    ? "completed"
                    : ""
                }`}
              >

                <input
                  type="checkbox"
                  checked={
                    task.completed
                  }
                  onChange={() =>
                    onToggleTask(
                      skill.id,
                      task.id
                    )
                  }
                />


                <span>
                  {task.title}
                </span>


                {task.completed && (
                  <Check
                    size={16}
                  />
                )}

              </label>

            )
          )}

        </div>


        {!showTasks &&
          tasks.length > 5 && (

            <button
              className="show-more-tasks"
              onClick={() =>
                setShowTasks(true)
              }
            >
              +
              {" "}
              {tasks.length - 5}
              {" "}
              more tasks
            </button>

          )}

      </div>


      {/* PAUSE / RESUME */}

      <div className="skill-bottom-actions">

        <button
          className="btn btn-light"
          onClick={() =>
            onTogglePause(
              skill.id
            )
          }
        >

          {skill.paused ? (
            <>
              <Play size={16} />
              Resume
            </>
          ) : (
            <>
              <Pause size={16} />
              Pause
            </>
          )}

        </button>

      </div>

    </div>

  );

}