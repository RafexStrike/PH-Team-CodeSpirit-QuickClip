"use client";

import "@/styles/daisy.css";
import React from "react";
import ModalForCallingTheLLM from "@/components/noteComponents/ModalForCallingTheLLM";

export default function page() {
  return (
    <div>
      <h1>this is a note taking app</h1>
      <ModalForCallingTheLLM></ModalForCallingTheLLM>
    </div>
  );
}
