type AIResult ={
  status: string;
  reply: string;
  action: string;
  reason: string;
};

export function analyzeCustomerMessage(message: string, customerName: string): AIResult {
  const lower = message.toLowerCase();

  if (
    lower.includes("pay tomorrow") ||
    lower.includes("pay today") ||
    lower.includes("pay tonight") ||
    lower.includes("i'll pay") ||
    lower.includes("i will pay")

  ) {
    return {
      status: "PROMISE_TO_PAY",
      action: "MARK_PROMISE_TO_PAY",
      reason: "Customer committed to making payment soon.",
      reply: `Understood ${customerName}, I've marked this as a payment commitment. We'll follow up if needed.`,

    };
  }

  if (
    lower.includes("remind me") ||
    lower.includes("later") ||
    lower.includes("next week") ||
    lower.includes("tomorrow")
  ){
    return {
      status: "FOLLOW_UP_SCHEDULED",
      action: "SCHEDULE_FOLLOW_UP",
      reason: "customer requested follow-up at a later time.",
      reply: `No problem ${customerName}, I've scheduled a follow-up reminder for you.`,

    };
  }

  if(
    lower.includes("already paid") ||
    lower.includes("wrong amount") ||
    lower.includes("don't owe") ||
    lower.includes("do not owe") ||
    lower.includes("paid already")
  ){
    return{
      status: "DISPUTED",
      action: "MARK_DISPUTED",
      reason: "customer disputed the payment or claimed it was already completed.",
      reply : `Thanks for letting us know ${customerName}. I've marked this case for review and paused further follow-ups.`,

    };
  }

  if (
    lower.includes("help") ||
    lower.includes("support") ||
    lower.includes("talk to someone") ||
    lower.includes("human") ||
    lower.includes("problem")
  ){
    return {
      status: "ESCALATED",
      action: "ESCALATE_TO_HUMAN",
      reason: "Customer requested human help or indicated support was needed.",
      reply: `I understand ${customerName}. I've escalated this case to a support team member for further assistance.`,

    };
  }

  if (
    lower.includes("done") ||
    lower.includes("completed") ||
    lower.includes("resolved")
  ) {
    return{
      status: "RESOLVED",
      action: "CLOSE_CASE",
      reason: "Customer indicated the issue or payment was completed.",
      reply: `Great, thanks ${customerName}. I've marked this case as resolved.`,

    };
  }

  return {
    status: "CONTACTED",
    action: "LOG_RESPONSE",
    reason: "Customer responded, but no strong workflow action was triggered.",
    reply: `Thanks ${customerName}, I've noted your response and we'll continue processsing your case.`,

  };
}