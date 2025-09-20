// src/lib/uploadVideo.js
export async function uploadVideoAndSummarize(file) {
  const form = new FormData();
  form.append("video", file);

  try {
    const res = await fetch("/api/video_to_text", {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data; // { transcript: "...", summary: "..." } or {error: "..."}
  } catch (err) {
    console.error("uploadVideoAndSummarize error:", err);
    return { error: err.message };
  }
}
