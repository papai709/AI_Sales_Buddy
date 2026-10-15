
const sendWhatsAppMessage = async (phone, message) => {
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
};

export default sendWhatsAppMessage;
