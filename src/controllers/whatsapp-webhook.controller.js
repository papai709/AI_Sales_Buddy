import processCustomerMessage from "../services/conversation.service.js";
export const verifyWhatsAppWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN &&
    challenge
  ) {
    return res.status(200).type("text/plain").send(challenge);
  }

  return res.sendStatus(403);
};

export const receiveWhatsAppWebhook = async (req, res) => {
  // Acknowledge the webhook before processing.
  res.status(200).send("OK");

  const entries = req.body?.entry ?? [];

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      const messages = change.value?.messages ?? [];

      for (const message of messages) {
        if (message.type !== "text") continue;

        const sender = message.from;
        const customerKey = sender.startsWith("demo_") 
          ? sender
          : sender;
        const text = message.text?.body;

        if (!sender || !text) continue;

        try {
          const result = await processCustomerMessage(customerKey, text);

          console.log("AI conversation processed:", {
            sender,
            reply: result.reply,
            status: result.status,
          });
        } catch (error) {
          console.error(
            "Failed to process incoming WhatsApp message:",
            error.message,
          );
        }
      }
    }
  }
};
