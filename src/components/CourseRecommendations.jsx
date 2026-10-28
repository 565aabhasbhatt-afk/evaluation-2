import React, { useEffect, useState } from "react";

const API_URL = "/api/codetrain/catalog";

export default function CourseRecommendations({ skills = [] }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        console.log("API status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("CodeTrain API data:", data);

        if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      })
      .catch((err) => {
        console.error("CodeTrain API error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card mt">
        <h2>Recommended Courses</h2>
        <p>Loading courses from CodeTrain...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mt">
        <h2>Recommended Courses</h2>
        <p>Unable to load courses.</p>
        <small>{error}</small>
      </div>
    );
  }

  return (
    <div className="card mt">
      <h2>Recommended Courses</h2>

      <p>
        Courses from CodeTrain matched with your skills.
      </p>

      <div className="grid grid-3">
        {courses.slice(0, 6).map((course) => {
          const title =
            course.title ||
            course.name ||
            "CodeTrain Course";

          const link =
            course.url ||
            course.link ||
            `https://codetrain.ai/learn/${course.id}`;

          return (
            <div className="card" key={course.id}>
              <h3>{title}</h3>

              <p>
                Explore this course and improve your
                technical skills.
              </p>

              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Explore Course
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}