// src/components/UploadForm.jsx
'use client';

import React, { useRef, useState } from 'react';
import ProgressBar from './ProgressBar';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handlePick = (e) => {
    setResult(null);
    setUploadPct(0);
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setVideoUrl(URL.createObjectURL(f));
    else setVideoUrl('');
  };

  const handleUpload = () => {
    if (!file) return;
    setIsProcessing(true);
    setResult(null);

    const form = new FormData();
    form.append('video', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/video_to_text');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadPct(percent);
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setIsProcessing(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText);
            setResult(json);
          } catch (err) {
            setResult({ error: 'Invalid JSON response from server' });
          }
        } else {
          setResult({ error: `Upload failed: ${xhr.status} ${xhr.statusText}`, details: xhr.responseText });
        }
      }
    };

    xhr.onerror = () => {
      setIsProcessing(false);
      setResult({ error: 'Network error during upload' });
    };

    xhr.send(form);
  };

  return (
    <div className="p-4 border border-base-300 rounded-lg">
      <div className="mb-3">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handlePick}
          className="file-input file-input-bordered w-full"
          disabled={isProcessing}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <button className="btn btn-primary" onClick={handleUpload} disabled={!file || isProcessing}>
          {isProcessing ? 'Uploading...' : 'Upload & Process'}
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => {
            setFile(null);
            setVideoUrl('');
            setUploadPct(0);
            setResult(null);
            if (inputRef.current) inputRef.current.value = '';
          }}
          disabled={isProcessing}
        >
          Reset
        </button>
      </div>

      {uploadPct > 0 && (
        <div className="mb-3">
          <ProgressBar percent={uploadPct} />
        </div>
      )}

      {videoUrl && (
        <div className="mb-3">
          <h3 className="font-semibold mb-2">Preview</h3>
          <video src={videoUrl} controls className="w-full max-h-96 rounded" />
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-base-200 rounded">
          <h3 className="font-semibold">Result</h3>
          {result.error ? (
            <pre className="text-sm text-red-500">{result.error}{result.details ? `\n${result.details}` : ''}</pre>
          ) : (
            <>
              <div className="mt-2">
                <strong>Transcription:</strong>
                <div className="whitespace-pre-wrap mt-1">{result.transcription}</div>
              </div>
              <div className="mt-2">
                <strong>Summary:</strong>
                <div className="whitespace-pre-wrap mt-1">{result.summary}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
