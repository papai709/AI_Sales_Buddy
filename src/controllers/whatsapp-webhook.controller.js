
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
  console.log(
    "WhatsApp webhook received:",
    JSON.stringify(req.body, null, 2)
  );

  // Acknowledge receipt. AI processing will be added later.
  return res.sendStatus(200);
};
