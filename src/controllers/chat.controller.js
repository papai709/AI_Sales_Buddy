import generateAIResponse from "../services/ai.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Please provide a valid message");
  }

  const business = {
    name: "ABC Computer Academy",
    description: "A computer training institute",
    products: [
      {
        name: "Full Stack Development",
        price: 5000,
        description: "A course covering frontend and backend development",
      },
    ],
    offers: [
      {
        name: "Festive Discount",
        details: "10% discount for eligible customers",
      },
    ],
  };
  
  const reply = await generateAIResponse(message.trim(), business);

  res.status(200).json(
    new ApiResponse(200, { reply }, "AI response generated successfully")
  );
});

export { chatWithAI };
