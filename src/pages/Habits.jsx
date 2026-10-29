import React, { useState } from "react";
import HabitCard from "../components/HabitCard";
import StatCard from "../components/StatCard";

function Habits() {
  // Toggle form visibility
  const [showForm, setShowForm] = useState(false);

  // Form input states
  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [target, setTarget] = useState(1);
  const [category, setCategory] = useState("Learning");

  // Habits list state
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Study Python",
      frequency: "Daily",
      target: 1,
      category: "Learning",
      streak: 5,
      done: true,
    },
    {
      id: 2,
      name: "Practice SQL",
      frequency: "Daily",
      target: 1,
      category: "Learning",
      streak: 2,
      done: false,
    },
    {
      id: 3,
      name: "Read a book",
      frequency: "Weekly",
      target: 3,
      category: "Personal",
      streak: 7,
      done: true,
    },
  ]);

  // Count completed habits and calculate percentage
  const completed = habits.filter((habit) => habit.done).length;
  const percentage =
    habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;

  // Add a new habit
  function addHabit(event) {
    event.preventDefault();

    const newHabit = {
      id: Date.now(),
      name: habitName,
      frequency: frequency,
      target: Number(target),
      category: category,
      streak: 0,
      done: false,
    };

    setHabits([...habits, newHabit]);

    // Reset form inputs
    setHabitName("");
    setFrequency("Daily");
    setTarget(1);
    setCategory("Learning");
    setShowForm(false);
  }

  // Toggle habit completed / not completed
  function toggleHabit(id) {
    const updated = habits.map((habit) => {
      if (habit.id === id) {
        return { ...habit, done: !habit.done };
      }
      return habit;
    });
    setHabits(updated);
  }

  // Delete habit by ID
  function deleteHabit(id) {
    const updated = habits.filter((habit) => habit.id !== id);
    setHabits(updated);
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="page-head row-between">
        <div>
          <h1>Daily Habits</h1>
          <p className="muted">Build consistency one day at a time.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Habit
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-3">
        <StatCard
          label="Completed today"
          value={completed + "/" + habits.length}
          icon="✅"
        />
        <StatCard
          label="Total habits"
          value={habits.length}
          icon="📚"
        />
        <StatCard
          label="Completion"
          value={percentage + "%"}
          icon="📊"
        />
      </div>

      {/* Add Habit Form */}
      {showForm && (
        <form className="card mt" onSubmit={addHabit}>
          <h2>Add a new habit</h2>

          <div className="form-grid mt">
            <label className="field">
              Habit name
              <input
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                required
              />
            </label>

            <label className="field">
              Frequency
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option>Daily</option>
                <option>Weekdays</option>
                <option>Weekly</option>
              </select>
            </label>

            <label className="field">
              Target
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </label>

            <label className="field">
              Category
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </label>
          </div>

          <div className="card-actions">
            <button className="btn btn-primary" type="submit">
              Add Habit
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

      {/* Habits List */}
      <div className="habit-list mt">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        ))}
      </div>
    </div>
  );
}

export default Habits;