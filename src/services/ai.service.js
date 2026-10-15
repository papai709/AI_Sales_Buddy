import ai from "../config/ai.config.js";
import buildSalesAgentPrompt from "../prompts/sales-agent.prompt.js";

const generateAIResponse = async (message, business) => {
  const systemPrompt = buildSalesAgentPrompt(business);

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: message,
  });

  return response.text;
};

export default generateAIResponse;
