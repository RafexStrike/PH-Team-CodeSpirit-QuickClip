import { Button } from "@/components/ui/button";
import { ShowExistingCollectionModal } from "./ShowExistingCollectionList";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

export function ExistingCollectionTriggerButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Existing Collection</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Which collection do you want to save in?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Select a collection to save the notes
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ShowExistingCollectionModal />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
