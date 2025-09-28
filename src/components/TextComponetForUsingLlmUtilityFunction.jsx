import React from "react";
import { askLLM } from "@/lib/callTheLlmUtility";

export default function TextComponetForUsingLlmUtilityFunction() {
  const prompt = "hey, how are you today?";
  const response = askLLM(prompt);
  return (
    <div>
      <div>textComponetForUsingLlmUtilityFunction</div>
      <h1>this is for checking if the LLM response work or not</h1>
      <h2>we are sending to the llm, hey, how are you today?</h2>
      <h3>{response}</h3>
    </div>
  );
}
