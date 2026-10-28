import React, { useMemo, useState } from "react";
import { useApp } from "../AppContext";
import HabitCard from "../components/HabitCard";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import {
  toDateKey,
  fromDateKey,
  getScheduledDays,
  isHabitScheduled,
  getCurrentStreak,
  getTotalXP,
  getLevel,
  getXPIntoLevel,
} from "./habitUtils";
import "./Habits.css";

const DAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const CATEGORIES = [
  "Learning",
  "Health",
  "Fitness",
  "Personal",
  "Productivity",
  "Reading",
  "Other",
];

const dateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const dateFromKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const getMonday = (date) => {
  const result = new Date(date);
  const day = result.getDay();

  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);

  return result;
};

const getDays = (habit) => {
  if (Array.isArray(habit.days) && habit.days.length) {
    return habit.days;
  }

  if (habit.frequency === "Weekdays") {
    return [1, 2, 3, 4, 5];
  }

  if (habit.frequency === "Weekly") {
    return [1];
  }

  return [0, 1, 2, 3, 4, 5, 6];
};

const isScheduled = (habit, date) => {
  return getDays(habit).includes(date.getDay());
};

const isCompleted = (habit, key) => {
  if (Array.isArray(habit.completedDates)) {
    return habit.completedDates.includes(key);
  }

  return Boolean(habit.done && key === dateKey());
};

const getStreak = (habit) => {
  const dates = new Set(
    Array.isArray(habit.completedDates)
      ? habit.completedDates
      : habit.done
        ? [dateKey()]
        : []
  );

  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!dates.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  for (let i = 0; i < 370; i++) {
    if (isScheduled(habit, cursor)) {
      if (dates.has(dateKey(cursor))) {
        streak++;
      } else {
        break;
      }
    }

    cursor = addDays(cursor, -1);
  }

  return streak;
};

const createHabit = (form, id) => ({
  id,
  name: form.name.trim(),
  description: form.description.trim(),
  category: form.category,
  frequency: form.frequency,
  target: Math.max(1, Number(form.target) || 1),
  emoji: form.emoji || "✨",
  reminder: form.reminder || "",
  notes: form.notes || "",
  days:
    form.frequency === "Custom Days"
      ? form.days
      : form.frequency === "Weekdays"
        ? [1, 2, 3, 4, 5]
        : form.frequency === "Weekly"
          ? [1]
          : [0, 1, 2, 3, 4, 5, 6],
  completedDates: Array.isArray(form.completedDates)
    ? form.completedDates
    : form.done
      ? [dateKey()]
      : [],
  done: Boolean(form.done),
  paused: Boolean(form.paused),
  archived: Boolean(form.archived),
});

const emptyForm = () => ({
  name: "",
  description: "",
  category: "Learning",
  frequency: "Daily",
  target: 1,
  emoji: "✨",
  reminder: "",
  notes: "",
  days: [1, 2, 3, 4, 5],
});

function Habits() {
  const { data, setData } = useApp();

  const habits = Array.isArray(data?.habits) ? data.habits : [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [sortBy, setSortBy] = useState("default");
  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [toast, setToast] = useState("");

  const today = dateKey();
  const selectedDateObject = dateFromKey(selectedDate);

  const weekDates = useMemo(() => {
    const monday = getMonday(selectedDateObject);

    return Array.from({ length: 7 }, (_, index) =>
      addDays(monday, index)
    );
  }, [selectedDate]);

  const updateHabits = (updater) => {
    setData((current) => {
      const currentHabits = Array.isArray(current?.habits)
        ? current.habits
        : [];

      const updated =
        typeof updater === "function"
          ? updater(currentHabits)
          : updater;

      return {
        ...current,
        habits: updated,
      };
    });
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const activeHabits = habits.filter(
    (habit) => !habit.archived
  );

  const scheduledHabits = activeHabits.filter(
    (habit) =>
      !habit.paused &&
      isScheduled(habit, selectedDateObject)
  );

  const completedCount = scheduledHabits.filter(
    (habit) => isCompleted(habit, selectedDate)
  ).length;

  const completionRate = scheduledHabits.length
    ? Math.round(
        (completedCount / scheduledHabits.length) * 100
      )
    : 0;

  const weeklyStats = weekDates.map((date) => {
    const key = dateKey(date);

    const due = activeHabits.filter(
      (habit) => !habit.paused && isScheduled(habit, date)
    );

    const done = due.filter(
      (habit) => isCompleted(habit, key)
    ).length;

    return {
      key,
      date,
      due: due.length,
      done,
      percent: due.length
        ? Math.round((done / due.length) * 100)
        : 0,
    };
  });

  const totalWeeklyDue = weeklyStats.reduce(
    (sum, day) => sum + day.due,
    0
  );

  const totalWeeklyDone = weeklyStats.reduce(
    (sum, day) => sum + day.done,
    0
  );

  const weeklyRate = totalWeeklyDue
    ? Math.round((totalWeeklyDone / totalWeeklyDue) * 100)
    : 0;

  const totalXP = activeHabits.reduce(
    (sum, habit) =>
      sum +
      (Array.isArray(habit.completedDates)
        ? new Set(habit.completedDates).size * 10
        : habit.done
          ? 10
          : 0),
    0
  );

  const level = Math.floor(totalXP / 100) + 1;
  const xpInLevel = totalXP % 100;

  const visibleHabits = habits.filter((habit) => {
    if (filter === "Archived") {
      if (!habit.archived) return false;
    } else {
      if (habit.archived) return false;

      if (filter === "Paused" && !habit.paused) {
        return false;
      }

      if (
        filter === "Completed" &&
        (!isCompleted(habit, selectedDate) || habit.paused)
      ) {
        return false;
      }

      if (
        filter === "Pending" &&
        (isCompleted(habit, selectedDate) ||
          habit.paused ||
          !isScheduled(habit, selectedDateObject))
      ) {
        return false;
      }

      if (
        filter === "Due today" &&
        (!isScheduled(habit, selectedDateObject) ||
          habit.paused)
      ) {
        return false;
      }
    }

    if (
      categoryFilter !== "All categories" &&
      habit.category !== categoryFilter
    ) {
      return false;
    }

    const searchable = [
      habit.name,
      habit.category,
      habit.description,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(search.toLowerCase().trim());
  });

  if (sortBy === "name") {
    visibleHabits.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === "streak") {
    visibleHabits.sort(
      (a, b) => getStreak(b) - getStreak(a)
    );
  } else if (sortBy === "completion") {
    visibleHabits.sort(
      (a, b) =>
        Number(isCompleted(b, selectedDate)) -
        Number(isCompleted(a, selectedDate))
    );
  }

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEditForm = (habit) => {
    setEditingId(habit.id);

    setForm({
      ...emptyForm(),
      ...habit,
      days: getDays(habit),
    });

    setShowForm(true);
  };

  const saveHabit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      notify("Please enter a habit name.");
      return;
    }

    if (
      form.frequency === "Custom Days" &&
      form.days.length === 0
    ) {
      notify("Choose at least one weekday.");
      return;
    }

    if (editingId !== null) {
      updateHabits((items) =>
        items.map((habit) =>
          habit.id === editingId
            ? {
                ...createHabit(
                  {
                    ...form,
                    completedDates: habit.completedDates,
                    done: habit.done,
                    paused: habit.paused,
                    archived: habit.archived,
                  },
                  habit.id
                ),
                completedDates: habit.completedDates || [],
              }
            : habit
        )
      );

      notify("Habit updated successfully.");
    } else {
      const newId =
        Math.max(0, ...habits.map((habit) => Number(habit.id) || 0)) +
        1;

      updateHabits((items) => [
        ...items,
        createHabit(form, newId),
      ]);

      notify("Habit added successfully!");
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const toggleHabit = (id, key = selectedDate) => {
    const date = dateFromKey(key);
    const habit = habits.find((item) => item.id === id);

    if (
      !habit ||
      habit.paused ||
      habit.archived ||
      !isScheduled(habit, date)
    ) {
      return;
    }

    const wasCompleted = isCompleted(habit, key);

    updateHabits((items) =>
      items.map((item) => {
        if (item.id !== id) return item;

        const dates = new Set(
          Array.isArray(item.completedDates)
            ? item.completedDates
            : item.done
              ? [today]
              : []
        );

        if (dates.has(key)) {
          dates.delete(key);
        } else {
          dates.add(key);
        }

        return {
          ...item,
          completedDates: [...dates].sort(),
          done: dates.has(today),
        };
      })
    );

    if (!wasCompleted) {
      notify("Great job! Habit completed.");
    }
  };

  const deleteHabit = (id) => {
    const habit = habits.find((item) => item.id === id);

    if (
      !habit ||
      !window.confirm(
        `Delete "${habit.name}" and its completion history?`
      )
    ) {
      return;
    }

    updateHabits((items) =>
      items.filter((item) => item.id !== id)
    );

    notify("Habit deleted.");
  };

  const togglePaused = (id) => {
    updateHabits((items) =>
      items.map((habit) =>
        habit.id === id
          ? { ...habit, paused: !habit.paused }
          : habit
      )
    );
  };

  const archiveHabit = (id) => {
    updateHabits((items) =>
      items.map((habit) =>
        habit.id === id
          ? { ...habit, archived: true }
          : habit
      )
    );

    notify("Habit archived.");
  };

  const updateNotes = (id, notes) => {
    updateHabits((items) =>
      items.map((habit) =>
        habit.id === id ? { ...habit, notes } : habit
      )
    );
  };

  const toggleDay = (day) => {
    setForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }));
  };

  const achievements = [
    {
      title: "First Step",
      description: "Complete your first habit",
      icon: "🌱",
      unlocked: totalXP >= 10,
    },
    {
      title: "7-Day Warrior",
      description: "Reach a 7-day streak",
      icon: "🔥",
      unlocked: activeHabits.some(
        (habit) => getStreak(habit) >= 7
      ),
    },
    {
      title: "Consistency Champion",
      description: "Complete 30 habit check-ins",
      icon: "🏆",
      unlocked:
        activeHabits.reduce(
          (sum, habit) =>
            sum +
            (Array.isArray(habit.completedDates)
              ? new Set(habit.completedDates).size
              : habit.done
                ? 1
                : 0),
          0
        ) >= 30,
    },
  ];

  return (
    <div className="habits-page">
      <div className="page-head row-between habits-heading">
        <div>
          <h1>Daily Habits</h1>
          <p className="muted">
            Build consistency one day at a time.
          </p>
          <p className="habits-date-label">
            {dateFromKey(selectedDate).toLocaleDateString(
              undefined,
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddForm}
        >
          + Add Habit
        </button>
      </div>

      <div className="grid grid-3 habits-stats-grid">
        <StatCard
          label="Completed today"
          value={`${completedCount}/${scheduledHabits.length}`}
          icon="✅"
        />

        <StatCard
          label="Active habits"
          value={activeHabits.filter((habit) => !habit.paused).length}
          icon="📚"
        />

        <StatCard
          label="Completion"
          value={`${completionRate}%`}
          icon="📊"
        />
      </div>

      <section className="card mt habits-week-card">
        <div className="habits-section-heading">
          <div>
            <h2>This week</h2>
            <p className="muted small">
              Select a date to review your habits.
            </p>
          </div>
          <strong>{weeklyRate}% this week</strong>
        </div>

        <div className="habits-week-strip">
          {weekDates.map((date) => {
            const key = dateKey(date);
            const stats = weeklyStats.find(
              (item) => item.key === key
            );

            return (
              <button
                type="button"
                key={key}
                className={`habits-day ${
                  selectedDate === key ? "is-selected" : ""
                } ${key === today ? "is-today" : ""}`}
                onClick={() => setSelectedDate(key)}
                aria-pressed={selectedDate === key}
              >
                <span>
                  {DAYS.find(
                    (day) => day.value === date.getDay()
                  )?.label}
                </span>

                <strong>{date.getDate()}</strong>

                <i
                  className={
                    stats?.due && stats.done === stats.due
                      ? "is-complete"
                      : stats?.done
                        ? "is-partial"
                        : ""
                  }
                />
              </button>
            );
          })}
        </div>

        <ProgressBar value={weeklyRate} />

        <div className="habits-progress-caption">
          <span>
            {totalWeeklyDone} of {totalWeeklyDue} scheduled check-ins
          </span>
          <span>{weeklyRate}%</span>
        </div>
      </section>

      {showForm && (
        <div
          className="habits-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <form
            className="habits-modal"
            onSubmit={saveHabit}
          >
            <div className="habits-modal-head">
              <div>
                <h2>
                  {editingId !== null
                    ? "Edit habit"
                    : "Create a habit"}
                </h2>
                <p className="muted small">
                  Build a routine that works for you.
                </p>
              </div>

              <button
                type="button"
                className="habits-icon-button"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="habits-form-grid">
              <label className="field habits-field-full">
                Habit name
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Practice JavaScript"
                  maxLength={80}
                  required
                />
              </label>

              <label className="field">
                Emoji
                <input
                  value={form.emoji}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      emoji: event.target.value,
                    })
                  }
                  maxLength={4}
                />
              </label>

              <label className="field">
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                Frequency
                <select
                  value={form.frequency}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      frequency: event.target.value,
                      days:
                        event.target.value === "Weekdays"
                          ? [1, 2, 3, 4, 5]
                          : event.target.value === "Weekly"
                            ? [1]
                            : event.target.value === "Daily"
                              ? [0, 1, 2, 3, 4, 5, 6]
                              : form.days,
                    })
                  }
                >
                  <option>Daily</option>
                  <option>Weekdays</option>
                  <option>Weekly</option>
                  <option>Custom Days</option>
                </select>
              </label>

              <label className="field">
                Target
                <input
                  type="number"
                  min="1"
                  value={form.target}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      target: event.target.value,
                    })
                  }
                  required
                />
              </label>

              <label className="field">
                Reminder (optional)
                <input
                  type="time"
                  value={form.reminder}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      reminder: event.target.value,
                    })
                  }
                />
              </label>

              {form.frequency === "Custom Days" && (
                <div className="field habits-field-full">
                  <span>Repeat on</span>
                  <div className="habits-weekday-options">
                    {DAYS.map((day) => (
                      <button
                        type="button"
                        key={day.value}
                        className={
                          form.days.includes(day.value)
                            ? "selected"
                            : ""
                        }
                        onClick={() => toggleDay(day.value)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="field habits-field-full">
                Description (optional)
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field habits-field-full">
                Notes (optional)
                <textarea
                  rows="2"
                  value={form.notes}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      notes: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <div className="habits-modal-actions">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                type="submit"
              >
                {editingId !== null
                  ? "Save changes"
                  : "Create habit"}
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="mt habits-list-section">
        <div className="habits-section-heading">
          <div>
            <h2>
              {selectedDate === today
                ? "Your habits"
                : `Habits for ${dateFromKey(
                    selectedDate
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}`}
            </h2>
            <p className="muted small">
              Your habit updates are saved automatically.
            </p>
          </div>
          <span className="habits-count-pill">
            {visibleHabits.length} shown
          </span>
        </div>

        <div className="toolbar habits-toolbar">
          <input
            className="habits-search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search habits..."
            aria-label="Search habits"
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter habits"
          >
            <option>All</option>
            <option>Due today</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Paused</option>
            <option>Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            aria-label="Filter by category"
          >
            <option>All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort habits"
          >
            <option value="default">Default order</option>
            <option value="name">Name</option>
            <option value="streak">Current streak</option>
            <option value="completion">Completion status</option>
          </select>
        </div>

        <div className="habit-list habits-enhanced-list">
          {visibleHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={{
                ...habit,
                done: isCompleted(habit, selectedDate),
                streak: getStreak(habit),
                isScheduled: isScheduled(
                  habit,
                  selectedDateObject
                ),
                selectedDate,
              }}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
              onUpdateNotes={updateNotes}
              onEdit={openEditForm}
              onPause={togglePaused}
              onArchive={archiveHabit}
            />
          ))}

          {visibleHabits.length === 0 && (
            <div className="habits-empty-state">
              <span>🌱</span>
              <h3>
                {filter === "Archived"
                  ? "No archived habits"
                  : "No habits found"}
              </h3>
              <p>
                Try changing your filters or add a new habit.
              </p>

              {filter !== "Archived" && (
                <button
                  className="btn btn-primary"
                  onClick={openAddForm}
                >
                  + Add your first habit
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-2 mt habits-bottom-grid">
        <div className="card habits-analytics-card">
          <h2>Weekly activity</h2>
          <p className="muted small">
            Completion rate by day
          </p>

          <div className="habits-chart">
            {weeklyStats.map((day) => (
              <div
                className="habits-chart-column"
                key={day.key}
              >
                <span>{day.percent}%</span>

                <div className="habits-chart-track">
                  <div
                    className="habits-chart-bar"
                    style={{ height: `${day.percent}%` }}
                  />
                </div>

                <small>
                  {DAYS.find(
                    (item) => item.value === day.date.getDay()
                  )?.label}
                </small>
              </div>
            ))}
          </div>
        </div>

        <div className="card habits-analytics-card">
          <h2>Rewards & achievements</h2>
          <p className="muted small">
            Build consistency and earn XP.
          </p>

          <div className="habits-level-row">
            <span className="habits-level-icon">⭐</span>

            <div className="habits-level-info">
              <strong>Level {level}</strong>
              <span>{xpInLevel}/100 XP to next level</span>
              <ProgressBar value={xpInLevel} />
            </div>

            <strong>{totalXP} XP</strong>
          </div>

          <div className="habits-badges">
            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className={`habits-badge ${
                  achievement.unlocked ? "unlocked" : "locked"
                }`}
              >
                <span>
                  {achievement.unlocked
                    ? achievement.icon
                    : "🔒"}
                </span>

                <div>
                  <strong>{achievement.title}</strong>
                  <small>
                    {achievement.unlocked
                      ? "Unlocked"
                      : achievement.description}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {toast && (
        <div className="habits-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Habits;