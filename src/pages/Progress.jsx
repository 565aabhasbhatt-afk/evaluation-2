import React, { useState } from "react";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";

function Progress() {

  const [skills, setSkills] = useState([
    { id: 1, name: "Python", progress: 80 },
    { id: 2, name: "Machine Learning", progress: 65 },
    { id: 3, name: "SQL", progress: 50 },
    { id: 4, name: "React", progress: 40 }
  ]);

  const [learningHours, setLearningHours] = useState(45);
  const [streak, setStreak] = useState(7);

  const [goals, setGoals] = useState([
    { name: "Complete Python", completed: true },
    { name: "Learn SQL", completed: true },
    { name: "Build React Project", completed: false }
  ]);

  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 4 },
    { day: "Thu", hours: 2 },
    { day: "Fri", hours: 5 },
    { day: "Sat", hours: 6 },
    { day: "Sun", hours: 3 }
  ]);

  const [monthlyActivity, setMonthlyActivity] = useState([
    { month: "Jan", hours: 20 },
    { month: "Feb", hours: 25 },
    { month: "Mar", hours: 30 },
    { month: "Apr", hours: 35 },
    { month: "May", hours: 40 }
  ]);


  // Calculate average progress

  let total = 0;

  for (let i = 0; i < skills.length; i++) {
    total = total + skills[i].progress;
  }

  let average = 0;

  if (skills.length > 0) {
    average = Math.round(total / skills.length);
  }


  // Calculate completed goals

  let completedGoals = 0;

  for (let i = 0; i < goals.length; i++) {
    if (goals[i].completed === true) {
      completedGoals = completedGoals + 1;
    }
  }

  let goalPercent = 0;

  if (goals.length > 0) {
    goalPercent = Math.round(
      (completedGoals / goals.length) * 100
    );
  }


  // Find highest weekly hours

  let maxWeek = 0;

  for (let i = 0; i < weeklyActivity.length; i++) {
    if (weeklyActivity[i].hours > maxWeek) {
      maxWeek = weeklyActivity[i].hours;
    }
  }


  // Find highest monthly hours

  let maxMonth = 0;

  for (let i = 0; i < monthlyActivity.length; i++) {
    if (monthlyActivity[i].hours > maxMonth) {
      maxMonth = monthlyActivity[i].hours;
    }
  }


  return (
    <div>

      <div className="page-head">
        <h1>Progress</h1>

        <p className="muted">
          Detailed analytics on how your learning is improving.
        </p>
      </div>


      {/* Statistics */}

      <div className="grid grid-4">

        <StatCard
          label="Average Progress"
          value={average + "%"}
          icon="📊"
        />

        <StatCard
          label="Learning Hours"
          value={learningHours + "h"}
          icon="⏱"
        />

        <StatCard
          label="Current Streak"
          value={streak + " days"}
          icon="🔥"
        />

        <StatCard
          label="Goal Completion"
          value={goalPercent + "%"}
          icon="🎯"
        />

      </div>


      {/* Skill Progress */}

      <div className="card mt">

        <h2>Skill Progress</h2>

        <div className="mt">

          {skills.map(function (skill) {

            return (
              <div
                className="hbar-row"
                key={skill.id}
              >

                <span>
                  {skill.name}
                </span>

                <ProgressBar
                  value={skill.progress}
                />

                <span className="small">
                  {skill.progress}%
                </span>

              </div>
            );

          })}

        </div>

      </div>


      {/* Weekly and Monthly Activity */}

      <div className="grid grid-2 mt">


        {/* Weekly Activity */}

        <div className="card">

          <h2>Weekly Activity</h2>

          <div className="bar-chart">

            {weeklyActivity.map(function (day) {

              return (
                <div
                  className="bar-col"
                  key={day.day}
                >

                  <div
                    className="bar"
                    style={{
                      height:
                        (day.hours / maxWeek) * 100 + "%"
                    }}
                  >
                  </div>

                  <span className="bar-label">
                    {day.day}
                  </span>

                </div>
              );

            })}

          </div>

        </div>


        {/* Monthly Learning */}

        <div className="card">

          <h2>Monthly Learning</h2>

          <div className="bar-chart">

            {monthlyActivity.map(function (month) {

              return (
                <div
                  className="bar-col"
                  key={month.month}
                >

                  <div
                    className="bar"
                    style={{
                      height:
                        (month.hours / maxMonth) * 100 + "%"
                    }}
                  >
                  </div>

                  <span className="bar-label">
                    {month.month}
                  </span>

                </div>
              );

            })}

          </div>

        </div>

      </div>


      {/* Goals */}

      <div className="card mt">

        <h2>Goals</h2>

        <div className="mt">

          {goals.map(function (goal) {

            return (
              <div
                className="row-between small"
                key={goal.name}
                style={{ marginBottom: "8px" }}
              >

                <span>
                  {goal.name}
                </span>

                <span className="badge badge-completed">

                  {goal.completed
                    ? "Completed"
                    : "Not Completed"}

                </span>

              </div>
            );

          })}

        </div>

      </div>

    </div>
  );
}

export default Progress;