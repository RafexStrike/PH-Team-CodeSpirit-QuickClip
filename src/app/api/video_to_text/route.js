// ✅ Force Node runtime so we can use child_process on Vercel
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import util from "util";
import { exec as execCb } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import { processVideoFile } from "@/lib/processVideo";

const exec = util.promisify(execCb);

// --- choose the ffmpeg binary dynamically ---
let ffmpegBin = "ffmpeg"; // fallback

if (ffmpegStatic && typeof ffmpegStatic === "string") {
  ffmpegBin = ffmpegStatic;
  console.log("✅ Using ffmpeg from ffmpeg-static:", ffmpegBin);
} else {
  try {
    // dynamic import because @ffmpeg-installer/ffmpeg is CJS
    const ffmpegInstaller = await import("@ffmpeg-installer/ffmpeg").then(
      (m) => m.default || m
    );
    if (ffmpegInstaller && ffmpegInstaller.path) {
      ffmpegBin = ffmpegInstaller.path;
      console.log("✅ Using ffmpeg from @ffmpeg-installer/ffmpeg:", ffmpegBin);
    } else {
      console.warn(
        "⚠️ @ffmpeg-installer/ffmpeg did not provide a path; will try system ffmpeg."
      );
    }
  } catch (e) {
    console.warn("⚠️ Could not import @ffmpeg-installer/ffmpeg:", e?.message || e);
  }
}

console.log("🎬 Final ffmpeg binary chosen:", ffmpegBin);

// --- optional diagnostics ---
try {
  console.log(
    "Does ffmpeg binary exist?",
    ffmpegBin ? fs.existsSync(ffmpegBin) : false
  );
} catch (e) {
  console.error("existsSync error:", e?.message || e);
}

// quick version check log:
exec(`"${ffmpegBin}" -version`)
  .then((res) => {
    console.log("ffmpeg version output:", res.stdout?.slice(0, 200));
  })
  .catch((err) => {
    console.error("ffmpeg -version failed:", err.message);
  });

// --- actual handler ---
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

    // 👇 Pass the ffmpeg binary path down so processVideoFile uses it
    const result = await processVideoFile(videoPath, ffmpegBin);

    // Remove video file after processing
    await fs.promises.unlink(videoPath).catch(() => {});

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in /api/video_to_text:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
