import generateAIResponse from "../services/ai.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Please provide a valid message");
  }

  const reply = await generateAIResponse(message.trim());

  res.status(200).json(
    new ApiResponse(200, { reply }, "AI response generated successfully")
  );
});

export { chatWithAI };
