
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


export const receiveWhatsAppWebhook = (req, res) => {
  const entries = req.body?.entry ?? [];

  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      const value = change.value;
      const messages = value?.messages ?? [];

      for (const message of messages) {
        if (message.type !== "text") {
          console.log("Ignoring non-text WhatsApp message.");
          continue;
        }

        console.log("Incoming WhatsApp message:");
        console.log("Sender:", message.from);
        console.log("Message:", message.text?.body);
        console.log("Message ID:", message.id);
      }
    }
  }

  return res.status(200).send("OK");
};
