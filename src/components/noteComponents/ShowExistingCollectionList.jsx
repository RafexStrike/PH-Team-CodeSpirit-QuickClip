// src/components/noteComponents/ShowExistingCollectionList.jsx

"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useContext } from "react";
import { EditorContext } from "@tiptap/react";

export function ShowExistingCollectionModal() {
  const [collections, setCollections] = useState([]);
  const { editor } = useContext(EditorContext);

  // Fetch all collections
  useEffect(() => {
    async function fetchCollection() {
      try {
        const res = await fetch("/api/notesCollection");
        if (!res.ok)
          throw new Error(
            "Failed to fetch data. Giving error from ShowExistingCollection.jsx"
          );
        const data = await res.json();
        console.log(
          "Fetched data in ShowExistingCollection.jsx component:",
          data
        );
        setCollections(data);
      } catch (error) {
        console.error(
          "Error fetching collections (ShowExistingCollection.jsx):",
          error
        );
      }
    }
    fetchCollection();
  }, []);

  // Function to remove HTML tags and create a short title
  const extractTitleFromHTML = (html) => {
    // Remove HTML tags
    const textOnly = html.replace(/<[^>]*>/g, " ").trim();

    // Split into words and take first 5
    const words = textOnly.split(/\s+/).slice(0, 5).join(" ");

    // If text is empty, fallback
    return words || "Untitled Note";
  };

  // Function to handle saving
  const handleSavingOnExistingCollections = async (notesCollectionID) => {
    try {
      if (!editor) {
        console.error("Editor not ready");
        return;
      }

      const html = editor.getHTML();
      const title = extractTitleFromHTML(html);

      const res = await fetch("/api/saveNotesToExistingCollection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId: notesCollectionID,
          title,
          content: html,
        }),
      });

      if (!res.ok) throw new Error("Failed to save note");

      const data = await res.json();
      console.log("Note saved successfully:", data);
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note. Check console for details.");
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {collections.map((collection) => (
          <Button
            key={collection._id}
            onClick={() => handleSavingOnExistingCollections(collection._id)}
          >
            {collection.notesCollectionName || collection._id}
          </Button>
        ))}
      </div>
    </div>
  );
}
