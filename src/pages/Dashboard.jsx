import React, { useState } from "react";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import HabitCard from "../components/HabitCard";

function Dashboard() {
  // Habits state for daily tracking
  const [habits, setHabits] = useState([
    { id: 1, name: "Study React", done: false },
    { id: 2, name: "Practice Java", done: false },
    { id: 3, name: "Read ML notes", done: true },
  ]);

  // Skills learning data
  const skills = [
    { id: 1, name: "Python", progress: 70 },
    { id: 2, name: "Java", progress: 60 },
    { id: 3, name: "React", progress: 40 },
    { id: 4, name: "Machine Learning", progress: 50 },
  ];

  // Learning goals data
  const goals = [
    { id: 1, name: "Learn React", progress: 70 },
    { id: 2, name: "Practice Java", progress: 50 },
    { id: 3, name: "Build ML Project", progress: 30 },
  ];

  // Weekly study hours activity
  const weeklyActivity = [
    { day: "Mon", height: "40%" },
    { day: "Tue", height: "60%" },
    { day: "Wed", height: "50%" },
    { day: "Thu", height: "80%" },
    { day: "Fri", height: "70%" },
    { day: "Sat", height: "90%" },
    { day: "Sun", height: "50%" },
  ];

  // Toggle habit completion status
  function toggleHabit(id) {
    const updated = habits.map((habit) => {
      if (habit.id === id) {
        return { ...habit, done: !habit.done };
      }
      return habit;
    });
    setHabits(updated);
  }

  // Count how many habits are completed today
  const doneToday = habits.filter((habit) => habit.done).length;

  return (
    <div>
      {/* Welcome Heading */}
      <div className="page-head">
        <h1>Good morning, Alex 👋</h1>
        <p className="muted">Here's your learning overview for today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-4">
        <StatCard label="Current Streak" value="5 days" icon="🔥" />
        <StatCard label="Skills Learning" value={skills.length} icon="📚" />
        <StatCard label="Goals Completed" value="2" icon="✓" />
        <StatCard label="Learning Hours" value="12h" icon="⏱" />
      </div>

      {/* Habits and Skills Row */}
      <div className="grid grid-2 mt">
        {/* Today's Habits */}
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

        {/* Current Skills Progress */}
        <div className="card">
          <h2>Current Skills</h2>
          <div className="mt">
            {skills.map((skill) => (
              <div key={skill.id} className="hbar-row">
                <span>{skill.name}</span>
                <ProgressBar value={skill.progress} />
                <span className="small">{skill.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals and Weekly Activity Row */}
      <div className="grid grid-2 mt">
        {/* Goals */}
        <div className="card">
          <h2>My Goals</h2>
          <div className="mt">
            {goals.map((goal) => (
              <div key={goal.id} className="hbar-row">
                <span>{goal.name}</span>
                <ProgressBar value={goal.progress} />
                <span className="small">{goal.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="card">
          <h2>Weekly Activity</h2>
          <div className="bar-chart">
            {weeklyActivity.map((item) => (
              <div key={item.day} className="bar-col">
                <div className="bar" style={{ height: item.height }}></div>
                <span className="bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;