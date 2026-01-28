"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[280px] sm:max-w-[360px] p-4 sm:p-6">
        <DialogHeader className="mb-0">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div
              className={`p-1.5 sm:p-2 rounded-full shrink-0 ${
                variant === "danger"
                  ? "bg-red-500/20 text-red-500"
                  : "bg-yellow-500/20 text-yellow-500"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 pt-0.5">
              <DialogTitle className="text-sm sm:text-base font-semibold">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-3 sm:mt-4 gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-secondary text-secondary-foreground py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              variant === "danger"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
