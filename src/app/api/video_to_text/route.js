import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function POST(req) {
  console.log("API /video_to_text called");
  try {
    const form = await req.formData();
    const videoFile = form.get("video");
    if (!videoFile) {
      return NextResponse.json(
        { error: "Video file is required" },
        { status: 400 }
      );
    }

    // Save video temporarily
    const buffer = await videoFile.arrayBuffer();
    const tmpDir = os.tmpdir();
    const videoPath = path.join(tmpDir, `video_${Date.now()}.mp4`);
    // Optional: progress check korar jonno console log kortesi
    console.log("Video saved at:", videoPath);
    await fs.promises.writeFile(videoPath, Buffer.from(buffer));

    // Extract audio using ffmpeg (only if needed; depends on model)
    const audioPath = path.join(tmpDir, `audio_${Date.now()}.wav`);
    // Optional: progress check korar jonno console log kortesi
    console.log("Audio extracted at:", audioPath);
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${audioPath}"`,
        (err, stdout, stderr) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Read audio file
    const audioData = await fs.promises.readFile(audioPath);

    // Transcription using whisper‐small
    console.log("Calling Whisper transcription..."); // Optional: progress check korar jonno console log kortesi
    const transcriptionResult = await hf.speechToText(audioData, {
      model: "openai/whisper-large-v3-turbo",
    });

    const transcription = transcriptionResult.text || transcriptionResult;

    // Summary using Hermés-3 (your current summarizer)
    const hermesResponse = await hf.chat({
      model: "NousResearch/Hermes-3-Llama-3.1-8B",
      messages: [
        {
          role: "user",
          content: `Please summarize the following transcript: ${transcription}`,
        },
      ],
    });

    const summary = hermesResponse.reply || hermesResponse;

    // clean up temporary files
    await fs.promises.unlink(videoPath).catch(() => {});
    await fs.promises.unlink(audioPath).catch(() => {});

    return NextResponse.json({ transcription, summary });
  } catch (err) {
    console.error("Error in video_to_text route:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
