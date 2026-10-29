import React, { useState } from "react";
import {
  Check,
  Trash2,
  Flame,
  Calendar,
  Tag,
  FileText,
  Sparkles,
  Pencil,
  MoreHorizontal,
  Pause,
  Play,
  Archive,
  X,
} from "lucide-react";

function HabitCard({
  habit,
  onToggle,
  onDelete,
  onUpdateNotes,
  onEdit,
  onPause,
  onArchive,
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(habit.notes || "");
  const [showActions, setShowActions] = useState(false);

  const isPaused = Boolean(habit.paused);
  const isArchived = Boolean(habit.archived);
  const isScheduled = habit.isScheduled !== false;

  const handleSaveNotes = (event) => {
    event.preventDefault();

    onUpdateNotes?.(habit.id, noteText);
    setShowNotes(false);
  };

  const handleToggle = () => {
    if (isPaused || isArchived || !isScheduled) return;

    onToggle?.(habit.id, habit.selectedDate);
  };

  return (
    <article
      className={`habit-enhanced-card ${habit.done ? "habit-is-done" : ""
        } ${isPaused ? "habit-is-paused" : ""} ${isArchived ? "habit-is-archived" : ""
        }`}
    >
      <div className="habit-card-main">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPaused || isArchived || !isScheduled}
          className={`habit-check-button ${habit.done ? "checked" : ""
            }`}
          aria-label={
            habit.done
              ? `Mark ${habit.name} incomplete`
              : `Complete ${habit.name}`
          }
          title={
            isPaused
              ? "Resume this habit to complete it"
              : !isScheduled
                ? "This habit is not scheduled for this day"
                : habit.done
                  ? "Mark incomplete"
                  : "Mark complete"
          }
        >
          {habit.done && <Check size={16} strokeWidth={3} />}
        </button>

        <div className="habit-card-emoji" aria-hidden="true">
          {habit.emoji || "✨"}
        </div>

        <div className="habit-card-content">
          <div className="habit-card-title-row">
            <h3
              className={
                habit.done ? "habit-title-completed" : ""
              }
            >
              {habit.name}
            </h3>

            {habit.done && (
              <span className="habit-status-pill done">
                <Sparkles size={12} />
                Done
              </span>
            )}

            {isPaused && (
              <span className="habit-status-pill paused">
                Paused
              </span>
            )}

            {isArchived && (
              <span className="habit-status-pill archived">
                Archived
              </span>
            )}
          </div>

          {habit.description && (
            <p className="habit-card-description">
              {habit.description}
            </p>
          )}

          <div className="habit-card-metadata">
            <span>
              <Calendar size={13} />
              {habit.frequency || "Daily"}
            </span>

            <span className="habit-metadata-separator">·</span>

            <span className="habit-category">
              <Tag size={13} />
              {habit.category || "Other"}
            </span>

            <span className="habit-metadata-separator">·</span>

            <span className="habit-streak">
              <Flame size={14} />
              {habit.streak || 0} day
              {(habit.streak || 0) === 1 ? "" : "s"} streak
            </span>

            {Number(habit.target) > 1 && (
              <>
                <span className="habit-metadata-separator">·</span>
                <span>Target: {habit.target}</span>
              </>
            )}
          </div>

          {!isScheduled && !isPaused && !isArchived && (
            <p className="habit-not-scheduled">
              Not scheduled for this day
            </p>
          )}

          {isPaused && (
            <p className="habit-not-scheduled">
              This habit is paused.
            </p>
          )}
        </div>

        <div className="habit-card-actions">
          <button
            type="button"
            className={`habit-icon-button ${habit.notes ? "has-notes" : ""
              }`}
            onClick={() => {
              setNoteText(habit.notes || "");
              setShowNotes(!showNotes);
            }}
            title="Notes"
            aria-label="Open habit notes"
          >
            <FileText size={17} />
          </button>

          <div className="habit-action-menu-wrapper">
            <button
              type="button"
              className="habit-icon-button"
              onClick={() => setShowActions(!showActions)}
              aria-label="More habit actions"
              aria-expanded={showActions}
              title="More actions"
            >
              <MoreHorizontal size={19} />
            </button>

            {showActions && (
              <>
                <button
                  type="button"
                  className="habit-menu-dismiss"
                  aria-label="Close actions menu"
                  onClick={() => setShowActions(false)}
                />

                <div className="habit-action-menu">
                  {!isArchived && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowActions(false);
                        onEdit?.(habit);
                      }}
                    >
                      <Pencil size={15} />
                      Edit habit
                    </button>
                  )}

                  {!isArchived && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowActions(false);
                        onPause?.(habit.id);
                      }}
                    >
                      {isPaused ? (
                        <Play size={15} />
                      ) : (
                        <Pause size={15} />
                      )}
                      {isPaused ? "Resume habit" : "Pause habit"}
                    </button>
                  )}

                  {!isArchived && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowActions(false);
                        onArchive?.(habit.id);
                      }}
                    >
                      <Archive size={15} />
                      Archive habit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      className="habit-delete-action"
                      onClick={() => {
                        setShowActions(false);
                        onDelete(habit.id);
                      }}
                    >
                      <Trash2 size={15} />
                      Delete habit
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showNotes && (
        <div className="habit-notes-panel">
          <div className="habit-notes-heading">
            <strong>
              <FileText size={15} />
              Habit notes
            </strong>

            <button
              type="button"
              className="habit-notes-close"
              onClick={() => setShowNotes(false)}
              aria-label="Close notes"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveNotes}>
            <textarea
              value={noteText}
              onChange={(event) =>
                setNoteText(event.target.value)
              }
              placeholder="Add a reflection or note..."
              rows={3}
              maxLength={1000}
            />

            <div className="habit-notes-footer">
              <span>{noteText.length}/1000</span>

              <button
                type="submit"
                className="btn btn-primary"
              >
                Save notes
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}

export default HabitCard;