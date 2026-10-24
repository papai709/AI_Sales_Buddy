
import ai from "../config/ai.config.js";
import buildSalesAgentPrompt from "../prompts/sales-agent.prompt.js";
import Lead from "../models/lead.model.js";
import Customer from "../models/customer.model.js";
import { demoBusiness } from "../data/demo.data.js";
import sendWhatsAppMessage from "./whatsapp.service.js";

const processCustomerMessage = async (customerId, message) => {
  const customer = String(customerId).startsWith("demo_")
    ? await Customer.findOne({ phone: customerId })
    : await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  let lead = await Lead.findOne({ customer: customer._id });

  if (!lead) {
    lead = await Lead.create({
      customer: customer._id,
    });
  }

  lead.messages.push({
    role: "user",
    content: message,
  });

  const history = lead.messages.map((item) => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.content }],
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    config: {
      systemInstruction: buildSalesAgentPrompt(demoBusiness),
      responseMimeType: "application/json",
    },
    contents: history,
  });

  const analysis = JSON.parse(response.text);

  if (
    typeof analysis.reply !== "string" ||
    typeof analysis.interest !== "string" ||
    typeof analysis.intent !== "string" ||
    !Number.isInteger(analysis.score) ||
    analysis.score < 0 ||
    analysis.score > 100 ||
    !["COLD", "WARM", "HOT"].includes(analysis.status) ||
    typeof analysis.needsHuman !== "boolean"
  ) {
    throw new Error("Gemini returned an invalid lead analysis");
  }

  const expectedStatus =
    analysis.score >= 70 ? "HOT" :
    analysis.score >= 30 ? "WARM" : "COLD";

  lead.interest = analysis.interest;
  lead.intent = analysis.intent;
  lead.score = analysis.score;
  lead.status = expectedStatus;
  lead.needsHuman = analysis.needsHuman;

  lead.messages.push({
    role: "assistant",
    content: analysis.reply,
  });

  await lead.save();

  // Simulate sending the AI reply to the customer
  const whatsappResult = await sendWhatsAppMessage(
    customer.phone,
    analysis.reply
  );
  return {
    customer: customer.name,
    reply: analysis.reply,
    interest: lead.interest,
    intent: lead.intent,
    score: lead.score,
    status: lead.status,
    needsHuman: lead.needsHuman,
    messages: lead.messages,
    whatsapp: whatsappResult,
  };
};

export default processCustomerMessage;
