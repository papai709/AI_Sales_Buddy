
import Customer from "../models/customer.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import processCustomerMessage from "../services/conversation.service.js";

const handleCustomerReply = asyncHandler(async (req, res) => {
  const { customerId, message } = req.body;

  if (!customerId || !/^[0-9a-fA-F]{24}$/.test(customerId)) {
    throw new ApiError(400, "A valid customer ID is required");
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "A valid message is required");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const result = await processCustomerMessage(
    customer._id,
    message.trim()
  );

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Customer reply processed successfully"
    )
  );
});

export { handleCustomerReply };
