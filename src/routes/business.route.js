
import { Router } from "express";
import {
  createBusiness,
  getBusiness,
} from "../controllers/buisness.controller.js";

const router = Router();

router.post("/", createBusiness);
router.get("/:businessId", getBusiness);

export default router;
