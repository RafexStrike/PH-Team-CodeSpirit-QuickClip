// src/lib/processVideo.js
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import { exec as execCb } from "child_process";
import { getChatCompletion } from "./callTheHermesForVideoSummarization";

const exec = util.promisify(execCb);

/**
 * Extracts audio (wav 16k mono) from the videoPath using ffmpeg,
 * calls Hugging Face inference REST endpoints for ASR and summarization,
 * and returns { transcription, summary }.
 */
export async function processVideoFile(videoPath) {
  const tmpDir = os.tmpdir();
  const audioPath = path.join(tmpDir, `audio_${Date.now()}.wav`);

  // Resolve ffmpeg binary (try ffmpeg-static then fall back to 'ffmpeg' in PATH)
  let ffmpegBin = "ffmpeg";
  try {
    const ffmpegMod = await import("ffmpeg-static").catch(() => null);
    const maybe = ffmpegMod && (ffmpegMod.default || ffmpegMod.path || ffmpegMod);
    if (maybe && typeof maybe === "string" && fs.existsSync(maybe)) {
      ffmpegBin = maybe;
      console.log("Using ffmpeg from ffmpeg-static:", ffmpegBin);
    } else {
      console.warn("ffmpeg-static not usable; will use ffmpeg on PATH.");
    }
  } catch (e) {
    console.warn("ffmpeg-static import failed - will try system ffmpeg:", e?.message || e);
  }

  // Check ffmpeg availability
  try {
    await exec(`"${ffmpegBin}" -version`, { windowsHide: true, timeout: 5000 });
    console.log("ffmpeg available at:", ffmpegBin);
  } catch (err) {
    throw new Error(
      `ffmpeg not found. Tried '${ffmpegBin}'. Install ffmpeg (apt/brew) or ensure ffmpeg-static provides a binary. ${err?.message || ""}`
    );
  }

  // Extract audio to WAV (16k, mono)
  const ffmpegCmd = `"${ffmpegBin}" -y -i "${videoPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${audioPath}"`;
  try {
    console.log("Running ffmpeg:", ffmpegCmd);
    const { stdout, stderr } = await exec(ffmpegCmd, { windowsHide: true, maxBuffer: 1024 * 1024 * 100 });
    if (stdout) console.log("ffmpeg stdout (trunc):", String(stdout).slice(0, 400));
    if (stderr) console.log("ffmpeg stderr (trunc):", String(stderr).slice(0, 400));
  } catch (err) {
    const message = err?.message || String(err);
    const stderr = err?.stderr ? String(err.stderr).slice(0, 2000) : "";
    console.error("ffmpeg failed:", message, stderr);
    throw new Error(`ffmpeg processing failed: ${message}\n${stderr}`);
  }

  // Read audio
  let audioBuffer;
  try {
    audioBuffer = await fs.promises.readFile(audioPath);
  } catch (err) {
    await fs.promises.unlink(audioPath).catch(() => {});
    throw new Error("Failed to read extracted audio: " + (err?.message || err));
  }

  // Use HF REST API for ASR
  if (!process.env.HF_TOKEN) {
    await fs.promises.unlink(audioPath).catch(() => {});
    throw new Error("HF_TOKEN missing from environment (.env.local).");
  }
  const hfToken = process.env.HF_TOKEN;

  let transcription = "";
  try {
    const asrUrl = "https://api-inference.huggingface.co/models/openai/whisper-large-v3";
    console.log("Calling HF ASR endpoint:", asrUrl);
    const asrRes = await fetch(asrUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "audio/wav",
      },
      body: audioBuffer,
    });

    const raw = await asrRes.text().catch(() => "");
    if (!asrRes.ok) {
      console.error("HF ASR HTTP error", asrRes.status, asrRes.statusText, raw.slice(0, 2000));
      throw new Error(`HF ASR failed: ${asrRes.status} ${asrRes.statusText} - ${raw.slice(0,1000)}`);
    }

    let asrJson;
    try { asrJson = raw ? JSON.parse(raw) : null; } catch (e) { asrJson = raw; }
    console.log("ASR response (truncated):", (typeof asrJson === "string" ? asrJson : JSON.stringify(asrJson)).slice(0,800));

    if (!asrJson) transcription = "";
    else if (typeof asrJson === "string") transcription = asrJson;
    else if (asrJson.text) transcription = asrJson.text;
    else if (asrJson.transcription) transcription = asrJson.transcription;
    else if (Array.isArray(asrJson) && asrJson[0]?.text) transcription = asrJson[0].text;
    else transcription = JSON.stringify(asrJson);
  } catch (err) {
    await fs.promises.unlink(audioPath).catch(() => {});
    console.error("ASR error:", err);
    throw new Error("ASR (speech-to-text) failed: " + (err?.message || err));
  }

  // Summarization via HF REST API
  // let summary = "";
  // try {
  //   const sumUrl = "https://api-inference.huggingface.co/models/NousResearch/Hermes-3-Llama-3.1-8B";
  //   console.log("Calling HF summarization endpoint:", sumUrl);

  //   const prompt = `Summarize the transcript below into a concise summary (<= 3 sentences):\n\n${transcription}`;

  //   const sumRes = await fetch(sumUrl, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${hfToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ inputs: prompt }),
  //   });

  //   const raw = await sumRes.text().catch(() => "");
  //   if (!sumRes.ok) {
  //     console.error("HF summary HTTP error", sumRes.status, sumRes.statusText, raw.slice(0, 2000));
  //     throw new Error(`HF summary failed: ${sumRes.status} ${sumRes.statusText} - ${raw.slice(0,1000)}`);
  //   }

  //   let sumJson;
  //   try { sumJson = raw ? JSON.parse(raw) : null; } catch (e) { sumJson = raw; }
  //   console.log("Summary response (truncated):", (typeof sumJson === "string" ? sumJson : JSON.stringify(sumJson)).slice(0,800));

  //   if (Array.isArray(sumJson) && sumJson[0]?.generated_text) summary = sumJson[0].generated_text;
  //   else if (sumJson?.generated_text) summary = sumJson.generated_text;
  //   else if (sumJson?.reply) summary = sumJson.reply;
  //   else if (sumJson?.choices?.[0]?.text) summary = sumJson.choices[0].text;
  //   else summary = typeof sumJson === "string" ? sumJson : JSON.stringify(sumJson);
  // } catch (err) {
  //   console.error("Summary call failed:", err);
  //   summary = `Error generating summary: ${err?.message || err}`;
  // }

  // Summarization via shared chat helper (reuse existing chat code)
let summary = "";
try {
  // import the helper at top of file:
  // import { getChatCompletion } from "./chat";
  // (make sure the import exists — see note below)
  const prompt = `Summarize the transcript below into a concise summary (<= 3 sentences):\n\n${transcription}`;

  // call the chat helper which uses InferenceClient under the hood
  // you may pass model or params via the second arg if needed
  summary = await getChatCompletion(prompt, {
    model: "NousResearch/Hermes-3-Llama-3.1-8B",
    // params: { max_tokens: 256 } // optional provider params if desired
  });

  console.log("Summary (from getChatCompletion) (trunc):", (summary || "").slice(0, 800));
} catch (err) {
  console.error("Summary call failed (via chat helper):", err);
  summary = `Error generating summary: ${err?.message || err}`;
}


  // cleanup audio
  await fs.promises.unlink(audioPath).catch(() => {});

  return { transcription, summary };
}
