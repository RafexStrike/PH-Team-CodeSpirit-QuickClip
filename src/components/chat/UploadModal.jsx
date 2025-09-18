'use client';
import { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onUpload }) {

   console.log("src/components/chat/UploadModal.jsx component is triggered"); 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

     console.log("Upload started");

    setLoading(true);          // <-- show loader
    try {
      await onUpload(file);
    } finally {
      setLoading(false);       // <-- hide loader
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">Upload Video</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input file-input-bordered w-full mb-4"
            disabled={loading}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!file || loading}>
              {loading ? 'Processing...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
