import React from "react";

function Home({ navigateToPage }) {
  return (
    <div className="landing">

      {/* Top Bar */}
      <div className="top-bar">

        <span className="logo">
          <span className="logo-mark">S</span> SkillSphere
        </span>

      </div>


      {/* Hero Section */}
      <section className="hero">

        <h1>
          Build skills. Track progress. Become better every day.
        </h1>

        <p>
          SkillSphere helps you organize your skills, build habits
          and track your personal growth.
        </p>

        <div className="hero-buttons">

          <button onClick={() => navigateToPage("skills")} className="btn btn-primary">
            Start Tracking
          </button>

          <button onClick={() => navigateToPage("dashboard")} className="btn btn-light">
            Explore Dashboard
          </button>

        </div>

      </section>


      {/* How It Works */}
      <h2 className="mt">
        How It Works
      </h2>

      <div className="grid grid-3 steps">

        <div className="card">
          <h3>1. Add Your Skills</h3>

          <p className="small muted">
            Add the skills you are learning.
          </p>
        </div>


        <div className="card">
          <h3>2. Build Daily Habits</h3>

          <p className="small muted">
            Practice your skills every day.
          </p>
        </div>


        <div className="card">
          <h3>3. Track Your Progress</h3>

          <p className="small muted">
            See how much you are improving.
          </p>
        </div>

      </div>


      {/* Footer */}
      <footer className="footer">

        <strong>SkillSphere</strong>

        <p>
          A simple personal learning dashboard.
        </p>

        <div className="footer-links">

          <button onClick={() => navigateToPage("dashboard")}>Dashboard</button>

          <button onClick={() => navigateToPage("skills")}>Skills</button>

          <button onClick={() => navigateToPage("habits")}>Habits</button>

        </div>

        <p>
          © 2026 SkillSphere
        </p>

      </footer>

    </div>
  );
}

export default Home;