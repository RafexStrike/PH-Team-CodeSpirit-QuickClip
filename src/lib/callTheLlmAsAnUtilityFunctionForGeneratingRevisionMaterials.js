// src/lib/callTheLlmAsAnUtilityFunctionForGeneratingRevisionMaterials.js

import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_TOKEN);


export async function askLUMINAL(conversationText) {
  try {
    if (!conversationText) {
      throw new Error("Conversation text is required.");
    }

    // Prepare the messages for the LLM
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant specialized in creating study materials. " +
          "Given a conversation or notes, generate educational content including flashcards, MCQs, and a short summary. " +
          "Format your output as a single valid JSON object structured as follows: " +
          `{ "revisionItems": [ 
              { "type": "flashcard", "question": "...", "answer": "..." }, 
              { "type": "mcq", "question": "...", "options": ["A","B","C","D"], "correctAnswer": "A" },
              { "type": "summary", "content": "..." } 
            ] }`
      },
      {
        role: "user",
        content: `Here is the full conversation:\n${conversationText}\n\nNow generate the structured revision data as described above.`
      }
    ];

    let out = "";

    // Stream the LLM response
    const stream = hf.chatCompletionStream({
      model: "NousResearch/Hermes-3-Llama-3.1-8B",
      messages,
    });

    for await (const chunk of stream) {
      if (chunk.choices?.length) {
        out += chunk.choices[0].delta.content || "";
      }
    }

    console.log("Raw LLM output:", out);

    // Try to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(out);
    } catch (e) {
      console.warn("Could not parse output as JSON, wrapping in fallback format.");
      parsed = { revisionItems: [{ type: "raw_text", content: out }] };
    }

    return parsed;
  } catch (err) {
    console.error("Error in askLUMINAL:", err);
    return { error: err.message };
  }
}
