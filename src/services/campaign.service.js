
import Customer from "../models/customer.model.js";
import Campaign from "../models/campaign.model.js";
import sendWhatsAppMessage from "./whatsapp.service.js";

const DEMO_PROMOTION = {
  name: "Festive Course Offer",
  message:
    "Hello! ABC Computer Academy is offering a 10% festive discount on our Full Stack Development course. Original price: Rs. 5000. Offer price: Rs. 4500. Reply to learn more!",
};

const runDemoCampaign = async () => {
  const customers = await Customer.find({
    phone: { $regex: /^demo_/ },
  });

  if (customers.length === 0) {
    throw new Error(
      "No demo customers found. Run npm run seed:demo first."
    );
  }

  const campaign = await Campaign.create({
    name: DEMO_PROMOTION.name,
    message: DEMO_PROMOTION.message,
    status: "RUNNING",
    recipients: customers.map((customer) => ({
      customer: customer._id,
      status: "PENDING",
    })),
  });

  for (const recipient of campaign.recipients) {
    try {
      const customer = customers.find(
        (item) => item._id.toString() === recipient.customer.toString()
      );

      const result = await sendWhatsAppMessage(
        customer.phone,
        campaign.message
      );

      recipient.status = "SIMULATED";
      recipient.messageId = result.messageId;
      recipient.sentAt = new Date();
    } catch (error) {
      recipient.status = "FAILED";
      console.error("Simulated send failed:", error.message);
    }
  }

  campaign.status = campaign.recipients.every(
    (recipient) => recipient.status === "SIMULATED"
  )
    ? "COMPLETED"
    : "FAILED";

  await campaign.save();

  return {
    campaignId: campaign._id,
    campaign: campaign.name,
    status: campaign.status,
    totalRecipients: campaign.recipients.length,
    simulated: campaign.recipients.filter(
      (recipient) => recipient.status === "SIMULATED"
    ).length,
    failed: campaign.recipients.filter(
      (recipient) => recipient.status === "FAILED"
    ).length,
  };
};

export default runDemoCampaign;
