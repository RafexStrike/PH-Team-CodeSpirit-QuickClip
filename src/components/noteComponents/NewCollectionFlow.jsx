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
import CreateNewCollectionButton from "./CreateNewCollectionButton";

export function NewCollectionTriggerButton() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">New Collection</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
            <DialogDescription>Give the new collection name</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="New Collection" />
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {/* <Button type="submit">Create New Collection</Button> */}
            <CreateNewCollectionButton />
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
