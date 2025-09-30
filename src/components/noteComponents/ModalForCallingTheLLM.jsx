"use client";

import React, { useState } from "react";
import { askLLM } from "@/lib/callTheLlmUtility";

export default function ModalForCallingTheLLM() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(prompt);
    console.log("sending the prompt to the LLM...");
    const res = askLLM(prompt);
    setResponse(res);
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="my_modal_6" className="btn">
        open modal
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>

          <p className="py-4">Ask anything to the AI</p>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />

            <button type="submit" className="btn btn-primary m-2">
              Ask AI
            </button>
          </form>

          {response && (
            <div>
              <div className="mt-4 p-2 border rounded bg-base-200">
                <h4 className="font-bold">AI Response:</h4>
                <p>{response}</p>
              </div>
            </div>
          )}
          <div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
