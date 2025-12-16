const BASE_URL = "http://localhost:4000";

export const getEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Re-throw to be caught by the calling component
  }
};

export const addEvent = async (event) => {
  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      // Try to get more specific error from backend response
      const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON responses
      throw new Error(
        `HTTP error! status: ${response.status} - ${
          errorData.error || "Unknown error"
        }`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding event:", error);
    throw error; // Re-throw to be caught by the calling component
  }
};
