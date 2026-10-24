
import { createHmac, timingSafeEqual } from "node:crypto";

const verifyWhatsAppSignature = (req, res, next) => {
  const signature = req.get("X-Hub-Signature-256");
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const rawBody = req.rawBody;

  if (!appSecret || !signature || !rawBody) {
    return res.status(401).send("Unauthorized webhook request");
  }

  const expectedSignature = `sha256=${createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex")}`;

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return res.status(401).send("Invalid webhook signature");
  }

  next();
};

export default verifyWhatsAppSignature;
