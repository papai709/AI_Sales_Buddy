import Business from "../models/business.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a new business
const createBusiness = asyncHandler(async (req, res) => {
  const { name, description, products, offers } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Business name is required");
  }

  const business = await Business.create({
    name,
    description,
    products,
    offers,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      business,
      "Business created successfully"
    )
  );
});

// Get a business by ID
const getBusiness = asyncHandler(async (req, res) => {
  const { businessId } = req.params;

  if (!/^[0-9a-fA-F]{24}$/.test(businessId)) {
    throw new ApiError(400, "Invalid business ID");
  }

  const business = await Business.findById(businessId);

  if (!business) {
    throw new ApiError(404, "Business not found");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      business,
      "Business fetched successfully"
    )
  );
});

export { createBusiness, getBusiness };
