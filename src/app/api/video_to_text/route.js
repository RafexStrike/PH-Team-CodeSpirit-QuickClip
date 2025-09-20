// src/app/api/video_to_text/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import { processVideoFile } from "@/lib/processVideo";

export async function POST(req) {
  try {
    const form = await req.formData();
    const videoFile = form.get("video");

    if (!videoFile) {
      return NextResponse.json({ error: "Video file is required" }, { status: 400 });
    }

    // Save uploaded file to a temp path
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const tmpDir = os.tmpdir();
    const videoPath = path.join(tmpDir, `upload_${Date.now()}.mp4`);
    await fs.promises.writeFile(videoPath, buffer);
    console.log("Saved uploaded video to", videoPath);

    // Process video (extract audio, ASR, summarize)
    const result = await processVideoFile(videoPath);

    // Remove video file after processing
    await fs.promises.unlink(videoPath).catch(() => {});

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in /api/video_to_text:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
