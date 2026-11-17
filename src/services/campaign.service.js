
import Customer from "../models/customer.model.js";
import Campaign from "../models/campaign.model.js";
import { sendWhatsAppTemplate } from "./whatsapp.service.js";

const runDemoCampaign = async () => {
  // Read the selected recipients from the environment.
  const configuredPhones =
    process.env.WHATSAPP_TEST_RECIPIENT_PHONES || "";

  const phones = [
    ...new Set(
      configuredPhones
        .split(",")
        .map((phone) => phone.trim())
        .filter(Boolean)
    ),
  ];

  if (phones.length === 0) {
    throw new Error(
      "Configure at least one phone in WHATSAPP_TEST_RECIPIENT_PHONES."
    );
  }

  if (phones.length > 5) {
    throw new Error("A maximum of 5 test recipients is allowed.");
  }

  if (phones.some((phone) => !/^\d{8,15}$/.test(phone))) {
    throw new Error(
      "Phone numbers must contain 8-15 digits, including country code, without + or spaces."
    );
  }

  // Find only the explicitly selected customers.
  const customers = await Customer.find({
    phone: { $in: phones },
  });

  const customerMap = new Map(
    customers.map((customer) => [customer.phone, customer])
  );

  const missingPhones = phones.filter(
    (phone) => !customerMap.has(phone)
  );

  if (missingPhones.length > 0) {
    throw new Error(
      `These customers were not found in MongoDB: ${missingPhones.join(", ")}`
    );
  }

  // Preserve the order of the configured phone numbers.
  const selectedCustomers = phones.map(
    (phone) => customerMap.get(phone)
  );

  const campaign = await Campaign.create({
    name: "WhatsApp Template Test",
    message: "WhatsApp template: hello_world",
    status: "RUNNING",
    recipients: selectedCustomers.map((customer) => ({
      customer: customer._id,
      status: "PENDING",
    })),
  });

  // Send the same template to every selected customer.
  for (let i = 0; i < campaign.recipients.length; i++) {
    const recipient = campaign.recipients[i];
    const customer = selectedCustomers[i];

    try {
      const result = await sendWhatsAppTemplate(
        customer.phone,
        "hello_world",
        "en_US"
      );

      recipient.status = result.status;
      recipient.messageId = result.messageId;
      recipient.sentAt = new Date();

      console.log("WhatsApp template result:", {
        customer: customer.name,
        phone: customer.phone,
        status: result.status,
        messageId: result.messageId,
      });
    } catch (error) {
      recipient.status = "FAILED";

      console.error(
        `Failed to send to ${customer.phone}:`,
        error.message
      );
    }
  }

  const successful = campaign.recipients.filter(
    (recipient) =>
      recipient.status === "ACCEPTED" ||
      recipient.status === "SIMULATED"
  ).length;

  const failed = campaign.recipients.length - successful;

  if (successful === campaign.recipients.length) {
    campaign.status = "COMPLETED";
  } else if (successful === 0) {
    campaign.status = "FAILED";
  } else {
    campaign.status = "PARTIAL";
  }

  await campaign.save();

  return {
    campaignId: campaign._id,
    campaign: campaign.name,
    status: campaign.status,
    totalRecipients: campaign.recipients.length,
    accepted: campaign.recipients.filter(
      (recipient) => recipient.status === "ACCEPTED"
    ).length,
    simulated: campaign.recipients.filter(
      (recipient) => recipient.status === "SIMULATED"
    ).length,
    failed,
  };
};

export default runDemoCampaign;
