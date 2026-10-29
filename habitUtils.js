const DAY_MS = 24 * 60 * 60 * 1000;

export function toDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function fromDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function getScheduledDays(habit) {
    if (Array.isArray(habit.days) && habit.days.length > 0) {
        return habit.days;
    }

    if (habit.frequency === "Weekdays") {
        return [1, 2, 3, 4, 5];
    }

    if (habit.frequency === "Weekly") {
        return [1];
    }

    return [0, 1, 2, 3, 4, 5, 6];
}

export function isHabitScheduled(habit, date) {
    return getScheduledDays(habit).includes(date.getDay());
}

export function getCompletedDates(habit) {
    const dates = Array.isArray(habit.completedDates)
        ? habit.completedDates
        : [];

    return [...new Set(dates)].sort();
}

export function getCurrentStreak(habit, today = new Date()) {
    const completed = new Set(getCompletedDates(habit));

    const cursor = new Date(today);
    cursor.setHours(0, 0, 0, 0);

    // A streak may continue from yesterday if today's
    // scheduled habit has not been completed yet.
    if (!completed.has(toDateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;

    for (let i = 0; i < 366; i++) {
        if (isHabitScheduled(habit, cursor)) {
            if (!completed.has(toDateKey(cursor))) {
                break;
            }

            streak++;
        }

        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

export function getLongestStreak(habit) {
    const completed = new Set(getCompletedDates(habit));

    if (completed.size === 0) {
        return 0;
    }

    const dates = [...completed]
        .map(fromDateKey)
        .sort((a, b) => a - b);

    let current = 0;
    let longest = 0;

    for (const date of dates) {
        if (!isHabitScheduled(habit, date)) {
            continue;
        }

        current++;
        longest = Math.max(longest, current);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        // Count consecutive scheduled completions, skipping
        // days on which the habit was not scheduled.
        let cursor = nextDate;

        while (!isHabitScheduled(habit, cursor)) {
            cursor.setDate(cursor.getDate() + 1);
        }

        if (!completed.has(toDateKey(cursor))) {
            current = 0;
        }
    }

    return longest;
}

export function getTotalCheckIns(habits) {
    return habits.reduce(
        (total, habit) => total + getCompletedDates(habit).length,
        0
    );
}

export function getTotalXP(habits) {
    return getTotalCheckIns(habits) * 10;
}

export function getLevel(xp) {
    return Math.floor(xp / 100) + 1;
}

export function getXPIntoLevel(xp) {
    return xp % 100;
}

export function getAchievementStatus(habits) {
    const checkIns = getTotalCheckIns(habits);
    const bestStreak = Math.max(
        0,
        ...habits.map((habit) =>
            Math.max(
                getCurrentStreak(habit),
                Number(habit.longestStreak) || getLongestStreak(habit)
            )
        )
    );

    return [
        {
            id: "first-step",
            title: "First Step",
            description: "Complete your first habit.",
            icon: "🌱",
            unlocked: checkIns >= 1,
        },
        {
            id: "three-day-streak",
            title: "3-Day Streak",
            description: "Maintain a three-day streak.",
            icon: "🔥",
            unlocked: bestStreak >= 3,
        },
        {
            id: "seven-day-warrior",
            title: "7-Day Warrior",
            description: "Reach a seven-day streak.",
            icon: "⚡",
            unlocked: bestStreak >= 7,
        },
        {
            id: "thirty-check-ins",
            title: "Consistency Champion",
            description: "Complete 30 habit check-ins.",
            icon: "🏆",
            unlocked: checkIns >= 30,
        },
    ];
}