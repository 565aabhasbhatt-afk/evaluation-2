import React, { useState } from "react";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import HabitCard from "../components/HabitCard";

function Dashboard() {

  const [habits, setHabits] = useState([
    { id: 1, name: "Study React", done: false },
    { id: 2, name: "Practice Java", done: false },
    { id: 3, name: "Read ML notes", done: true }
  ]);

  const skills = [
    { id: 1, name: "Python", progress: 70 },
    { id: 2, name: "Java", progress: 60 },
    { id: 3, name: "React", progress: 40 },
    { id: 4, name: "Machine Learning", progress: 50 }
  ];

  const goals = [
    { id: 1, name: "Learn React", progress: 70 },
    { id: 2, name: "Practice Java", progress: 50 },
    { id: 3, name: "Build ML Project", progress: 30 }
  ];

  function toggleHabit(id) {

    const newHabits = habits.map((habit) => {

      if (habit.id === id) {
        return {
          ...habit,
          done: !habit.done
        };
      }

      return habit;
    });

    setHabits(newHabits);
  }

  let doneToday = 0;

  for (let i = 0; i < habits.length; i++) {
    if (habits[i].done) {
      doneToday++;
    }
  }

  return (
    <div>

      {/* Welcome */}
      <div className="page-head">
        <h1>Good morning, Alex 👋</h1>
        <p className="muted">
          Here's your learning overview for today.
        </p>
      </div>


      {/* Statistics */}
      <div className="grid grid-4">

        <StatCard
          label="Current Streak"
          value="5 days"
          icon="🔥"
        />

        <StatCard
          label="Skills Learning"
          value={skills.length}
          icon="📚"
        />

        <StatCard
          label="Goals Completed"
          value="2"
          icon="✓"
        />

        <StatCard
          label="Learning Hours"
          value="12h"
          icon="⏱"
        />

      </div>


      {/* Habits and Skills */}
      <div className="grid grid-2 mt">

        {/* Habits */}
        <div className="card">

          <div className="row-between">
            <h2>Today's Habits</h2>

            <span className="badge">
              {doneToday}/{habits.length} done
            </span>
          </div>

          <div className="habit-list mt">

            {habits.map((habit) => (

              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabit}
              />

            ))}

          </div>

        </div>


        {/* Skills */}
        <div className="card">

          <h2>Current Skills</h2>

          <div className="mt">

            {skills.map((skill) => (

              <div
                key={skill.id}
                className="hbar-row"
              >

                <span>{skill.name}</span>

                <ProgressBar
                  value={skill.progress}
                />

                <span className="small">
                  {skill.progress}%
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* Goals */}
      <div className="grid grid-2 mt">

        <div className="card">

          <h2>My Goals</h2>

          <div className="mt">

            {goals.map((goal) => (

              <div
                key={goal.id}
                className="hbar-row"
              >

                <span>{goal.name}</span>

                <ProgressBar
                  value={goal.progress}
                />

                <span className="small">
                  {goal.progress}%
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* Weekly Activity */}
        <div className="card">

          <h2>Weekly Activity</h2>

          <div className="bar-chart">

            <div className="bar-col">
              <div className="bar" style={{ height: "40%" }}></div>
              <span className="bar-label">Mon</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "60%" }}></div>
              <span className="bar-label">Tue</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "50%" }}></div>
              <span className="bar-label">Wed</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "80%" }}></div>
              <span className="bar-label">Thu</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "70%" }}></div>
              <span className="bar-label">Fri</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "90%" }}></div>
              <span className="bar-label">Sat</span>
            </div>

            <div className="bar-col">
              <div className="bar" style={{ height: "50%" }}></div>
              <span className="bar-label">Sun</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;