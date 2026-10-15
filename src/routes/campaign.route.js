
import { Router } from "express";
import { startDemoCampaign } from "../controllers/campaign.controller.js";

const router = Router();

router.post("/demo", startDemoCampaign);

export default router;
