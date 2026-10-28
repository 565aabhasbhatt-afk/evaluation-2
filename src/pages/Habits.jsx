import React, { useState } from "react";
import HabitCard from "../components/HabitCard";
import StatCard from "../components/StatCard";

function Habits() {

  const [showForm, setShowForm] = useState(false);

  const [habitName, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [target, setTarget] = useState(1);
  const [category, setCategory] = useState("Learning");

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Study Python",
      frequency: "Daily",
      target: 1,
      category: "Learning",
      done: true
    },
    {
      id: 2,
      name: "Practice SQL",
      frequency: "Daily",
      target: 1,
      category: "Learning",
      done: false
    },
    {
      id: 3,
      name: "Read a book",
      frequency: "Weekly",
      target: 3,
      category: "Personal",
      done: true
    }
  ]);


  // Count completed habits

  let completed = 0;

  for (let i = 0; i < habits.length; i++) {

    if (habits[i].done === true) {
      completed = completed + 1;
    }

  }


  // Calculate percentage

  let percentage = 0;

  if (habits.length > 0) {

    percentage = Math.round(
      (completed / habits.length) * 100
    );

  }


  // Add a new habit

  function addHabit(event) {

    event.preventDefault();

    const newHabit = {
      id: habits.length + 1,
      name: habitName,
      frequency: frequency,
      target: target,
      category: category,
      done: false
    };

    setHabits([
      ...habits,
      newHabit
    ]);

    setHabitName("");
    setFrequency("Daily");
    setTarget(1);
    setCategory("Learning");

    setShowForm(false);

  }


  // Mark habit as complete

  function toggleHabit(id) {

    let newHabits = [];

    for (let i = 0; i < habits.length; i++) {

      if (habits[i].id === id) {

        let updatedHabit = {
          id: habits[i].id,
          name: habits[i].name,
          frequency: habits[i].frequency,
          target: habits[i].target,
          category: habits[i].category,
          done: !habits[i].done
        };

        newHabits.push(updatedHabit);

      } else {

        newHabits.push(habits[i]);

      }

    }

    setHabits(newHabits);

  }


  // Delete habit

  function deleteHabit(id) {

    let newHabits = [];

    for (let i = 0; i < habits.length; i++) {

      if (habits[i].id !== id) {
        newHabits.push(habits[i]);
      }

    }

    setHabits(newHabits);

  }


  return (
    <div>

      <div className="page-head row-between">

        <div>

          <h1>Daily Habits</h1>

          <p className="muted">
            Build consistency one day at a time.
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Habit
        </button>

      </div>


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


      {showForm && (

        <form
          className="card mt"
          onSubmit={addHabit}
        >

          <h2>Add a new habit</h2>

          <div className="form-grid mt">

            <label className="field">

              Habit name

              <input
                value={habitName}
                onChange={(event) =>
                  setHabitName(event.target.value)
                }
                required
              />

            </label>


            <label className="field">

              Frequency

              <select
                value={frequency}
                onChange={(event) =>
                  setFrequency(event.target.value)
                }
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
                onChange={(event) =>
                  setTarget(event.target.value)
                }
              />

            </label>


            <label className="field">

              Category

              <input
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              />

            </label>

          </div>


          <div className="card-actions">

            <button
              className="btn btn-primary"
              type="submit"
            >
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


      <div className="habit-list mt">

        {habits.map(function (habit) {

          return (

            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />

          );

        })}

      </div>

    </div>
  );
}

export default Habits;