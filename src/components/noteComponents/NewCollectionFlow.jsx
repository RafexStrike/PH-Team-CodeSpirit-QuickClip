"use client";
import { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EditorContext } from "@tiptap/react";

export default function NewCollectionDialog({ open, onOpenChange }) {
  const [newCollectionName, setNewCollectionName] = useState("New Collection");
  const [loading, setLoading] = useState(false);
  const { editor } = useContext(EditorContext);

  useEffect(() => {
    if (!open) setNewCollectionName("New Collection");
  }, [open]);

  async function handleCreate(e) {
    e?.preventDefault();
    if (!editor) return;
    setLoading(true);
    try {
      const html = editor.getHTML();
      const res = await fetch("/api/notesCollection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesCollectionName: newCollectionName, content: html }),
      });
      if (!res.ok) throw new Error(await res.text());
      // success: close this dialog
      onOpenChange(false);
    } catch (err) {
      console.error("create collection failed", err);
      alert("Failed to create collection");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>Give the new collection name</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" name="name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create & Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
