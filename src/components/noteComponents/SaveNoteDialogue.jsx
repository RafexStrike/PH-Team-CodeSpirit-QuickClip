import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ExistingCollectionFlow,
  ExistingCollectionTriggerButton,
} from "./ExistingCollectionFlow";
import { NewCollectionTriggerButton } from "./NewCollectionFlow";

export function SaveNoteDialogue() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Save Note</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Where do you want to save?</AlertDialogTitle>
          <AlertDialogDescription>
            You can create a new collection or save note to existing collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogCancel>New Collection</AlertDialogCancel> */}
          <NewCollectionTriggerButton />
          {/* <AlertDialogAction>Existing Collection</AlertDialogAction> */}
          <ExistingCollectionTriggerButton />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
