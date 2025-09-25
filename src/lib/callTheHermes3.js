// src/lib/chat.js
import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function getChatCompletion(prompt, { model = "NousResearch/Hermes-3-Llama-3.1-8B", params = {} } = {}) {
  if (!prompt) throw new Error("prompt is required");

  // call the client
  const out = await hf.chatCompletion({
    model,
    messages: [{ role: "user", content: prompt }],
    ...params,
  });

  // normalize common provider response shapes
  if (out?.choices && out.choices.length > 0) {
    const choice = out.choices[0];
    // common shapes:
    if (choice.message?.content) return choice.message.content;
    if (choice.text) return choice.text;
    if (choice.generated_text) return choice.generated_text;
    // fallback: return the choice object as JSON string
    return JSON.stringify(choice);
  }

  if (out?.generated_text) return out.generated_text;
  if (typeof out === "string") return out;
  return JSON.stringify(out);
}
