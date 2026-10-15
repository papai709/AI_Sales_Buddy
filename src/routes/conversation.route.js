
import { Router } from "express";
import { handleCustomerReply } from "../controllers/conversation.controller.js";

const router = Router();

router.post("/reply", handleCustomerReply);

export default router;
