import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function ShowExistingCollectionModal() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchCollection() {
      const res = await fetch("/api/notesCollection");
      const data = await res.json();
      setCollections(data);
    }
    fetchCollection();
  }, []);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        {/* here will go the collections name button */}
        {collections.map((collection) => {
          console.log(collection._id);

          return <Button>{collection._id}</Button>;
        })}
      </div>
    </div>
  );
}
