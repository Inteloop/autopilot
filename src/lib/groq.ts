import knowledge from "@/data/knowledge.json";
import { answerLocally } from "@/lib/localBot";
import type { BotReply, ChatMessage, KnowledgeBase } from "@/types";

const kb = knowledge as KnowledgeBase;

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

function buildSystemPrompt() {
  return `Tu es l'assistant virtuel du concessionnaire Auto Abidjan a Abidjan.

Regles strictes :
- Reponds en francais, de maniere professionnelle, courte et precise.
- Utilise UNIQUEMENT les informations fournies dans le contexte JSON.
- Si tu ne sais pas, dis-le clairement et propose de mettre en relation avec un conseiller.
- Ne donne jamais de diagnostic mecanique definitif. Pour un voyant moteur, recommande un diagnostic atelier.
- Quand une action est utile, choisis une action parmi : "none", "book_appointment", "show_vehicle", "contact_advisor".
- Si tu proposes de voir un vehicule, ajoute "vehicleId" avec l'id exact du vehicule.
- Reponds toujours en JSON strict, sans Markdown, avec ce schema :
{"message":"...", "action":"none|book_appointment|show_vehicle|contact_advisor", "vehicleId":"id-optionnel"}

Contexte JSON Auto Abidjan :
${JSON.stringify(kb)}`;
}

function parseBotReply(content: string): BotReply {
  const jsonStart = content.indexOf("{");
  const jsonEnd = content.lastIndexOf("}");
  const candidate =
    jsonStart >= 0 && jsonEnd >= jsonStart
      ? content.slice(jsonStart, jsonEnd + 1)
      : content;
  const parsed = JSON.parse(candidate) as Partial<BotReply>;

  return {
    message:
      typeof parsed.message === "string"
        ? parsed.message
        : "Je n'ai pas pu formuler une reponse fiable. Je peux vous mettre en relation avec un conseiller.",
    action: parsed.action ?? "contact_advisor",
    vehicleId: parsed.vehicleId,
  };
}

export async function askBot(
  userMessage: string,
  history: ChatMessage[],
  apiKey: string,
): Promise<BotReply> {
  if (!apiKey.trim()) {
    return answerLocally(userMessage, history);
  }

  const recentHistory = history.slice(-10).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...recentHistory,
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("Reponse Groq invalide.");
  }

  return parseBotReply(content);
}
