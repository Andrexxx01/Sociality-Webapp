"use client";

import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-105 rounded-[28px] border border-brand-neutral-800 bg-[#05070B] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <h3 className="text-[22px] font-bold text-brand-neutral-25">{title}</h3>
        <p className="mt-3 text-[15px] leading-7 text-brand-neutral-500">
          {description}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="h-11 cursor-pointer rounded-full border border-brand-neutral-800 bg-transparent px-6 text-brand-neutral-25 transition-all duration-200 hover:border-brand-primary-200 hover:bg-brand-neutral-950 hover:shadow-[0_0_16px_rgba(127,81,249,0.18)]"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={[
              "h-11 cursor-pointer rounded-full px-6 text-brand-neutral-25 transition-all duration-200",
              destructive
                ? "bg-brand-accent-red hover:brightness-110 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                : "bg-linear-to-r from-brand-primary-200 to-brand-primary-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(127,81,249,0.42)]",
            ].join(" ")}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
