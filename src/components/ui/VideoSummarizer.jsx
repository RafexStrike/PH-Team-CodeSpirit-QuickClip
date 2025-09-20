"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function VideoSummarizer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!videoUrl) {
      alert("Please provide a video URL");
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      // Placeholder transcript for demo
      const transcript = `Transcript placeholder for video URL: ${videoUrl}`;

      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript })
      });

      const data = await res.json();

      if (data.error) alert(data.error);
      else setSummary(data);
    } catch (err) {
      console.error(err);
      alert("Error summarizing video.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg w-full max-w-lg mx-auto bg-white dark:bg-gray-800 space-y-4">
      <Upload className="w-12 h-12 text-gray-400 dark:text-gray-200 mb-2" />
      <p className="text-center text-gray-500 dark:text-gray-300 mb-2">
        Provide a video URL to summarize
      </p>

      <Input
        placeholder="Paste video URL here"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="mb-2"
      />

      <Button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </Button>

      {summary && (
        <Card className="w-full mt-4 bg-gray-50 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Transcript:</strong> {summary.transcript}</p>
            <ul className="list-disc list-inside">
              {summary.mainPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
