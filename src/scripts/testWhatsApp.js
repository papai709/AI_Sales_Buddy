
import "dotenv/config";

const testWhatsApp = async () => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipient = process.env.WHATSAPP_TEST_RECIPIENT;

  if (!phoneNumberId || !accessToken || !recipient) {
    throw new Error("Missing WhatsApp test configuration in .env");
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
        to: recipient,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" },
        },
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("WhatsApp API error:", result);
    throw new Error("WhatsApp test message failed");
  }

  console.log("WhatsApp API accepted the test message.");
  console.log("Message ID:", result.messages?.[0]?.id);
};

testWhatsApp().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
