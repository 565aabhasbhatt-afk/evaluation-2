const API_URL = "http://127.0.0.1:8000";

export async function predictGoalCompletion(goalData) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(errorData.detail || "Failed to get goal prediction.");
  }

  return await response.json();
}
