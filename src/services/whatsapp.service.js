
const sendWhatsAppMessage = async (phone, message) => {
  const mode = process.env.WHATSAPP_MODE || "mock";

  // Keep the existing simulation for local testing
  if (mode === "mock") {
    const mockMessage = {
      simulated: true,
      messageId: `mock_${Date.now()}`,
      phone,
      message,
      status: "SIMULATED",
      createdAt: new Date(),
    };

    console.log("\n--- MOCK WHATSAPP MESSAGE ---");
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log("Status: SIMULATED");
    console.log("-----------------------------\n");

    return mockMessage;
  }

  // Send a real WhatsApp message through Meta
  if (mode === "real") {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      throw new Error("WhatsApp API credentials are missing");
    }

    const response = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", result);
      throw new Error(
        result.error?.message || "Failed to send WhatsApp message"
      );
    }

    return {
      simulated: false,
      messageId: result.messages?.[0]?.id,
      phone,
      message,
      status: "ACCEPTED",
    };
  }

  throw new Error("Invalid WHATSAPP_MODE. Use mock or real.");
};

export default sendWhatsAppMessage;
