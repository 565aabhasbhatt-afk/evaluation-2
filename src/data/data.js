// Simple starting data for SkillSphere

export const initialProfile = {
  name: "Alex",
  email: "alex@example.com",
  dailyTarget: 2,
  darkMode: false,
  goalReminder: true,
  streakAlerts: true,
  weeklySummary: false,
};

export const initialSkills = [
  {
    id: 1,
    name: "JavaScript",
    category: "Programming",
    difficulty: "Intermediate",
    progress: 72,
    targetDate: "2026-09-30",
    status: "Learning",
    description: "Core language, DOM and ES6 features.",
  },
  {
    id: 2,
    name: "React",
    category: "Web Development",
    difficulty: "Beginner",
    progress: 55,
    targetDate: "2026-10-15",
    status: "Learning",
    description: "Components, props, state and hooks.",
  },
  {
    id: 3,
    name: "Python",
    category: "Programming",
    difficulty: "Intermediate",
    progress: 80,
    targetDate: "2026-09-10",
    status: "Learning",
    description: "Scripting and data handling.",
  },
  {
    id: 4,
    name: "C Programming",
    category: "Programming",
    difficulty: "Beginner",
    progress: 65,
    targetDate: "2026-08-30",
    status: "Paused",
    description: "Pointers, arrays and memory basics.",
  },
  {
    id: 5,
    name: "Machine Learning",
    category: "Data Science",
    difficulty: "Advanced",
    progress: 48,
    targetDate: "2026-12-01",
    status: "Learning",
    description: "Regression, classification and models.",
  },
  {
    id: 6,
    name: "SQL",
    category: "Databases",
    difficulty: "Beginner",
    progress: 100,
    targetDate: "2026-07-01",
    status: "Completed",
    description: "Queries, joins and grouping.",
  },
];

export const initialHabits = [
  {
    id: 1,
    name: "Code for 1 hour",
    frequency: "Daily",
    target: 1,
    category: "Learning",
    streak: 12,
    done: false,
  },
  {
    id: 2,
    name: "Read 20 pages",
    frequency: "Daily",
    target: 20,
    category: "Reading",
    streak: 8,
    done: false,
  },
  {
    id: 3,
    name: "Practice JavaScript",
    frequency: "Weekdays",
    target: 1,
    category: "Learning",
    streak: 5,
    done: false,
  },
  {
    id: 4,
    name: "Morning workout",
    frequency: "Daily",
    target: 1,
    category: "Health",
    streak: 3,
    done: false,
  },
  {
    id: 5,
    name: "Drink enough water",
    frequency: "Daily",
    target: 8,
    category: "Health",
    streak: 15,
    done: false,
  },
  {
    id: 6,
    name: "Review notes",
    frequency: "Weekly",
    target: 1,
    category: "Learning",
    streak: 2,
    done: false,
  },
];

export const initialGoals = [
  {
    id: 1,
    name: "Complete React course",
    description: "Finish all modules and the final project.",
    category: "Web Development",
    dueDate: "2026-09-15",
    progress: 65,
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    name: "Build ML project",
    description: "Train and present a small prediction model.",
    category: "Data Science",
    dueDate: "2026-10-02",
    progress: 40,
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    name: "Practice C programming",
    description: "Solve 50 practice problems.",
    category: "Programming",
    dueDate: "2026-08-30",
    progress: 80,
    priority: "Medium",
    completed: false,
  },
  {
    id: 4,
    name: "Learn SQL joins",
    description: "Understand inner, left and right joins.",
    category: "Databases",
    dueDate: "2026-07-01",
    progress: 100,
    priority: "Low",
    completed: true,
  },
];

export const weeklyActivity = [
  { day: "Mon", hours: 3 },
  { day: "Tue", hours: 2 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 3.5 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 2 },
];

export const monthlyActivity = [
  { month: "Mar", hours: 20 },
  { month: "Apr", hours: 28 },
  { month: "May", hours: 24 },
  { month: "Jun", hours: 35 },
  { month: "Jul", hours: 30 },
  { month: "Aug", hours: 42 },
];

export const improvingSkills = [
  { name: "JavaScript", change: 12 },
  { name: "React", change: 9 },
  { name: "Python", change: 6 },
];

export const initialData = {
  profile: initialProfile,
  skills: initialSkills,
  habits: initialHabits,
  goals: initialGoals,
  learningHours: 42,
  streak: 12,
  habitsCompleted: 14,
};
