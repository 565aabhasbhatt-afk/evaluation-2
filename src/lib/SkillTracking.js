
// progress calculation and skill status - ye progress automate krta hai
const TASKS = [
  "Learn the fundamentals",
  "Understand the basic concepts",
  "Practice examples",
  "Solve exercises",
  "Practice independently",
  "Fix common errors",
  "Build a small feature",
  "Review notes",
  "Take a quiz",
  "Build a mini project",
  "Practice interview questions",
  "Apply the skill",
  "Learn best practices",
  "Read documentation",
  "Solve advanced problems",
  "Build another feature",
  "Review weak areas",
  "Complete final challenge",
  "Final revision",
  "Final project",
];


// Create tasks for a skill
export function createTasks(
  skillName,
  completed = 0
) {
  return TASKS.map((task, index) => ({
    id: `${Date.now()}-${index}`,
    title: `${skillName}: ${task}`,
    completed: index < completed,
  }));
}


// Calculate progress
export function calculateProgress(tasks = []) {

  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  return Math.round(
    (completed / tasks.length) * 100
  );
}


// Decide skill status
export function getStatus(
  progress,
  paused = false
) {

  if (progress === 100) {
    return "Completed";
  }

  if (paused) {
    return "Paused";
  }

  if (progress === 0) {
    return "Not Started";
  }

  return "Learning";
}


// Convert old skills
// into the new task system
export function normalizeSkill(skill) {

  const oldProgress =
    Number(skill.progress || 0);

  const paused =
    typeof skill.paused === "boolean"
      ? skill.paused
      : skill.status === "Paused";

  let tasks = skill.tasks;

  // If old skill has no tasks,
  // create them automatically
  if (
    !Array.isArray(tasks) ||
    tasks.length === 0
  ) {
    tasks = createTasks(
      skill.name,
      Math.round(oldProgress / 5)
    );
  }

  const progress =
    calculateProgress(tasks);

  return {
    ...skill,
    tasks,
    progress,
    paused,
    status: getStatus(
      progress,
      paused
    ),
  };
}


// Normalize all application data
export function normalizeData(data) {

  return {
    ...data,

    skills: (data.skills || []).map(
      normalizeSkill
    ),
  };
}