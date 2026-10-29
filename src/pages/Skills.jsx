import React, {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Target,
  BookOpen,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

import { useApp } from "../AppContext";

import SkillCard from "../components/SkillCard";

import {
  createTasks,
  normalizeSkill,
} from "../lib/SkillTracking.js";

import CourseRecommendations
  from "../components/CourseRecommendations";


export default function Skills() {

  const {
    data,
    update,
    toggleTask,
    togglePause,
    deleteSkill,
  } = useApp();


  const [showForm, setShowForm] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [filter, setFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("Progress");


  const emptyForm = {
    name: "",
    category: "Development",
    difficulty: "Beginner",
    targetDate: "",
    description: "",
    paused: false,
  };


  const [form, setForm] =
    useState(emptyForm);


  const skills =
    data.skills || [];


  /* =========================
     STATS
  ========================= */

  const stats =
    useMemo(() => {

      const total =
        skills.length;

      const active =
        skills.filter(
          (skill) =>
            skill.status ===
            "Learning"
        ).length;

      const completed =
        skills.filter(
          (skill) =>
            skill.status ===
            "Completed"
        ).length;

      const average =
        total === 0
          ? 0
          : Math.round(
              skills.reduce(
                (sum, skill) =>
                  sum +
                  skill.progress,
                0
              ) / total
            );

      return {
        total,
        active,
        completed,
        average,
      };

    }, [skills]);


  /* =========================
     CURRENT FOCUS
  ========================= */

  const currentFocus =
    skills
      .filter(
        (skill) =>
          skill.status ===
          "Learning"
      )
      .sort(
        (a, b) =>
          b.progress -
          a.progress
      )[0];


  /* =========================
     FILTER + SORT
  ========================= */

  const filteredSkills =
    useMemo(() => {

      let result =
        [...skills];

      if (filter !== "All") {

        result =
          result.filter(
            (skill) =>
              skill.status ===
              filter
          );

      }

      if (sortBy === "Progress") {

        result.sort(
          (a, b) =>
            b.progress -
            a.progress
        );

      }

      if (sortBy === "Name") {

        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        );

      }

      return result;

    }, [
      skills,
      filter,
      sortBy,
    ]);


  /* =========================
     ADD FORM
  ========================= */

  function openAddForm() {

    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);

  }


  /* =========================
     EDIT FORM
  ========================= */

  function openEditForm(skill) {

    setEditId(skill.id);

    setForm({

      name: skill.name,

      category:
        skill.category,

      difficulty:
        skill.difficulty,

      targetDate:
        skill.targetDate ||
        "",

      description:
        skill.description ||
        "",

      paused:
        skill.paused,

    });

    setShowForm(true);

  }


  /* =========================
     SAVE FORM
  ========================= */

  function handleSubmit(e) {

    e.preventDefault();

    if (!form.name.trim()) {
      return;
    }


    /* EDIT */

    if (editId) {

      const updated =
        skills.map(
          (skill) => {

            if (
              skill.id !==
              editId
            ) {
              return skill;
            }

            return normalizeSkill({

              ...skill,

              name:
                form.name.trim(),

              category:
                form.category,

              difficulty:
                form.difficulty,

              targetDate:
                form.targetDate,

              description:
                form.description,

              paused:
                form.paused,

            });

          }
        );

      update({
        skills: updated,
      });

    }


    /* ADD */

    else {

      const newSkill =
        normalizeSkill({

          id: Date.now(),

          name:
            form.name.trim(),

          category:
            form.category,

          difficulty:
            form.difficulty,

          targetDate:
            form.targetDate,

          description:
            form.description,

          paused: false,

          tasks:
            createTasks(
              form.name.trim()
            ),

        });


      update({

        skills: [
          ...skills,
          newSkill,
        ],

      });

    }


    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);

  }


  /* =========================
     DELETE
  ========================= */

  function handleDelete(id) {

    if (
      window.confirm(
        "Delete this skill?"
      )
    ) {

      deleteSkill(id);

    }

  }


  /* =========================
     CONTINUE
  ========================= */

  function continueLearning(id) {

    const element =
      document.getElementById(
        `skill-${id}`
      );

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

    }

  }


  return (

    <div className="skills-page">


      {/* =====================
          PAGE HEADER
      ===================== */}

      <div className="page-head skills-header">

        <div>

          <h1>
            My Skills
          </h1>

          <p>
            Track your learning journey, build your skills, and achieve your goals.
          </p>

        </div>


        <button
          className="btn btn-primary"
          onClick={openAddForm}
        >

          <Plus size={18} />

          Add Skill

        </button>

      </div>


      {/* =====================
          STAT CARDS
      ===================== */}

      <div className="grid grid-4 skills-stats">

        <div className="stat-card">

          <div className="stat-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <div className="stat-label">
              Skills Tracked
            </div>

            <div className="stat-value">
              {stats.total}
            </div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <div className="stat-label">
              Active Learning
            </div>

            <div className="stat-value">
              {stats.active}
            </div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>

          <div>
            <div className="stat-label">
              Completed
            </div>

            <div className="stat-value">
              {stats.completed}
            </div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Target size={20} />
          </div>

          <div>
            <div className="stat-label">
              Average Progress
            </div>

            <div className="stat-value">
              {stats.average}%
            </div>
          </div>

        </div>

      </div>


      {/* =====================
          FOCUS + JOURNEY
      ===================== */}

      <div className="skills-overview">


        {/* CURRENT FOCUS */}

        {currentFocus && (

          <div className="card focus-card">

            <div className="section-eyebrow">
              CURRENT FOCUS
            </div>

            <div className="focus-title-row">

              <div>

                <h2>
                  {currentFocus.name}
                </h2>

                <p>
                  You're currently at{" "}
                  <strong>
                    {currentFocus.progress}%
                  </strong>
                </p>

              </div>

              <div className="focus-percentage">
                {currentFocus.progress}%
              </div>

            </div>


            <div className="progress-bar">

              <div
                className="progress"
                style={{
                  width:
                    `${currentFocus.progress}%`,
                }}
              />

            </div>


            <button
              className="btn btn-primary focus-button"
              onClick={() =>
                continueLearning(
                  currentFocus.id
                )
              }
            >
              Continue Learning
            </button>

          </div>

        )}



      </div>


      {/* =====================
          ADD / EDIT FORM
      ===================== */}

      {showForm && (

        <div className="card mt skills-form-card">

          <h2>
            {editId
              ? "Edit Skill"
              : "Add New Skill"}
          </h2>

          <p>
            Progress is automatically
            calculated from completed
            tasks.
          </p>


          <form
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              <div className="field">

                <label>
                  Skill Name
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. React"
                  required
                />

              </div>


              <div className="field">

                <label>
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Development
                  </option>

                  <option>
                    Programming
                  </option>

                  <option>
                    AI / ML
                  </option>

                  <option>
                    Database
                  </option>

                  <option>
                    Cloud
                  </option>

                  <option>
                    Data
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>


              <div className="field">

                <label>
                  Difficulty
                </label>

                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Beginner
                  </option>

                  <option>
                    Intermediate
                  </option>

                  <option>
                    Advanced
                  </option>

                </select>

              </div>


              <div className="field">

                <label>
                  Target Date
                </label>

                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      targetDate:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>


            <div className="field">

              <label>
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                rows="3"
                placeholder="What do you want to learn?"
              />

            </div>


            {editId && (

              <label>

                <input
                  type="checkbox"
                  checked={form.paused}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paused:
                        e.target.checked,
                    })
                  }
                />

                {" "}
                Pause this skill

              </label>

            )}


            <div className="form-actions">

              <button
                type="button"
                className="btn btn-light"
                onClick={() => {

                  setShowForm(false);
                  setEditId(null);

                }}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="btn btn-primary"
              >

                {editId
                  ? "Save Changes"
                  : "Add Skill"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* =====================
          FILTER + SORT
      ===================== */}

      <div className="toolbar mt skills-toolbar">

        <div className="filter-buttons">

          {[
            "All",
            "Learning",
            "Not Started",
            "Paused",
            "Completed",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item
                  ? "btn btn-primary"
                  : "btn btn-light"
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>

          ))}

        </div>


        <div className="sort-control">

          <span>
            Sort by
          </span>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
          >

            <option>
              Progress
            </option>

            <option>
              Name
            </option>

          </select>

        </div>

      </div>


      {/* =====================
          SKILL CARDS
      ===================== */}

      <div className="grid grid-3 mt skills-grid">

        {filteredSkills.length === 0 ? (

          <div className="card">

            <h3>
              No skills found
            </h3>

            <p>
              Add a skill or
              change your filter.
            </p>

          </div>

        ) : (

          filteredSkills.map(
            (skill) => (

              <div
                key={skill.id}
                id={`skill-${skill.id}`}
                className="skill-grid-item"
              >

                <SkillCard
                  skill={skill}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  onToggleTask={toggleTask}
                  onTogglePause={togglePause}
                />

              </div>

            )
          )

        )}

      </div>


      {/* =====================
          COURSE API
      ===================== */}

      <div className="skills-courses">

        <CourseRecommendations
          skills={skills}
        />

      </div>


    </div>

  );

}