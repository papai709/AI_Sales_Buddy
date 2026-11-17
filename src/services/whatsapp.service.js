
const GRAPH_API_VERSION = "v25.0";

const getWhatsAppConfig = () => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error("WhatsApp API credentials are missing");
  }

  return { phoneNumberId, accessToken };
};

const sendToWhatsAppAPI = async (payload) => {
  const { phoneNumberId, accessToken } = getWhatsAppConfig();

  const response = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("WhatsApp API error:", result);
    throw new Error(
      result.error?.message || "Failed to send WhatsApp message"
    );
  }

  return result;
};

// Send ordinary text messages (used for Gemini replies)
export const sendWhatsAppMessage = async (phone, message) => {
  const mode = process.env.WHATSAPP_MODE || "mock";

  if (mode === "mock") {
    console.log("\n--- MOCK WHATSAPP MESSAGE ---");
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log("Status: SIMULATED");
    console.log("-----------------------------\n");

    return {
      simulated: true,
      messageId: `mock_${Date.now()}`,
      phone,
      message,
      status: "SIMULATED",
      createdAt: new Date(),
    };
  }

  if (mode === "real") {
    const result = await sendToWhatsAppAPI({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "text",
      text: { body: message },
    });

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

// Send an approved WhatsApp template (used to initiate the conversation)
export const sendWhatsAppTemplate = async (
  phone,
  templateName = "hello_world",
  languageCode = "en_US"
) => {
  const mode = process.env.WHATSAPP_MODE || "mock";

  if (mode === "mock") {
    console.log("\n--- MOCK WHATSAPP TEMPLATE ---");
    console.log(`To: ${phone}`);
    console.log(`Template: ${templateName}`);
    console.log(`Language: ${languageCode}`);
    console.log("Status: SIMULATED");
    console.log("------------------------------\n");

    return {
      simulated: true,
      messageId: `mock_${Date.now()}`,
      phone,
      templateName,
      status: "SIMULATED",
    };
  }

  if (mode === "real") {
    const result = await sendToWhatsAppAPI({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
      },
    });

    return {
      simulated: false,
      messageId: result.messages?.[0]?.id,
      phone,
      templateName,
      status: "ACCEPTED",
    };
  }

  throw new Error("Invalid WHATSAPP_MODE. Use mock or real.");
};

export default sendWhatsAppMessage;
