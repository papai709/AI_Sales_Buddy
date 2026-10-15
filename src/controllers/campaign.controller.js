
import runDemoCampaign from "../services/campaign.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const startDemoCampaign = asyncHandler(async (req, res) => {
  const result = await runDemoCampaign();

  res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Demo campaign completed successfully"
    )
  );
});

export { startDemoCampaign };
