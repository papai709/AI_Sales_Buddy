
import "dotenv/config";
import { createHmac } from "node:crypto";

const payload = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "TEST_WABA_ID",
      changes: [
        {
          field: "messages",
          value: {
            messaging_product: "whatsapp",
            messages: [
              {
                from: "TEST_SENDER",
                id: "wamid.TEST_MESSAGE",
                timestamp: "1792230000",
                type: "text",
                text: { body: "I'm interested in the course." },
              },
            ],
          },
        },
      ],
    },
  ],
};

const rawBody = JSON.stringify(payload);
const appSecret = process.env.WHATSAPP_APP_SECRET;

if (!appSecret) {
  throw new Error("WHATSAPP_APP_SECRET is missing from .env");
}

const signature =
  "sha256=" +
  createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");

const response = await fetch(
  "http://localhost:5000/webhooks/whatsapp",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hub-Signature-256": signature,
    },
    body: rawBody,
  }
);

console.log("Status:", response.status);
console.log("Response:", await response.text());
