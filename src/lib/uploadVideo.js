// src/lib/uploadVideo.js
export async function uploadVideoAndSummarize(file) {
  console.log("uploadVideoAndSummarize called with", file?.name);
  const form = new FormData();
  form.append("video", file);

  try {
    const res = await fetch("/api/video_to_text", {
      method: "POST",
      body: form,
    });

    console.log("fetch to /api/video_to_text returned", res.status);
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      console.error("Server error response:", res.status, text);
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    console.log("uploadVideoAndSummarize result", data);
    return data;
  } catch (err) {
    console.error("uploadVideoAndSummarize error:", err);
    return { error: err.message };
  }
}
