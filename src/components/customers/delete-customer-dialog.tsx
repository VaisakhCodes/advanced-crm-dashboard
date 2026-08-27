"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  count: number;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteCustomerDialog({
  open,
  onOpenChange,
  customerName,
  count,
  onConfirm,
  isDeleting,
}: DeleteCustomerDialogProps) {
  const isBulkDelete = count > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {customerName}?
          </DialogTitle>

          <DialogDescription>
            This will permanently remove{" "}
            {isBulkDelete ? "these customers" : "this customer"}.{" "}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Deleting..."
              : isBulkDelete
                ? "Delete customers"
                : "Delete customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
