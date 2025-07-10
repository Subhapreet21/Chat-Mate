import axios from "axios";

export const sendMessageToOpenAI = async (parts) => {
  const data = { parts };
  try {
    const response = await axios.post("/api/chat", data);
    return response.data;
  } catch (err) {
    let msg = err?.response?.data?.error || "Failed to get response.";
    if (err?.response?.status === 429 || msg.toLowerCase().includes("quota")) {
      msg =
        "You have reached your usage limit. Please try again later or check your API provider’s billing settings.";
    }
    return { error: msg };
  }
};
