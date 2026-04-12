import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function analyzeWithLLM(
  message: string,
  customerName: string
) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an AI collections agent. Always return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Customer: ${customerName}
Message: "${message}"

Return JSON:
{
  "status": "...",
  "action": "...",
  "reason": "...",
  "reply": "..."
}

Statuses:
PROMISE_TO_PAY
FOLLOW_UP_SCHEDULED
DISPUTED
ESCALATED
RESOLVED
CONTACTED
`,
        },
      ],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content || "{}";

    return JSON.parse(text);
  } catch (err) {
    console.error("Groq LLM Error:", err);
    return null;
  }
}