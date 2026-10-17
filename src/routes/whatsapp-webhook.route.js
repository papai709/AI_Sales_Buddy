
import { Router } from "express";
import {
  verifyWhatsAppWebhook,
  receiveWhatsAppWebhook,
} from "../controllers/whatsapp-webhook.controller.js";

const router = Router();

router.get("/", verifyWhatsAppWebhook);
router.post("/", receiveWhatsAppWebhook);

export default router;
