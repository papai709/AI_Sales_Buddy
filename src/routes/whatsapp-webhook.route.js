
import { Router } from "express";
import {
  verifyWhatsAppWebhook,
  receiveWhatsAppWebhook,
} from "../controllers/whatsapp-webhook.controller.js";

import verifyWhatsAppSignature from "../middlewares/verifyWhatsAppSignature.middleware.js";

const router = Router();

router.get("/", verifyWhatsAppWebhook);
// router.post("/", receiveWhatsAppWebhook);

router.post("/", verifyWhatsAppSignature, receiveWhatsAppWebhook);

export default router;
