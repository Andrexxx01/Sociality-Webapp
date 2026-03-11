"use client";

import { useRef } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";

type CreatePostDropzoneProps = {
  previewUrl: string | null;
  error?: string;
  onFileSelect: (file: File | null) => void;
  onRemove: () => void;
};

export default function CreatePostDropzone({
  previewUrl,
  error,
  onFileSelect,
  onRemove,
}: CreatePostDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  return (
    <div>
      <div
        className={[
          "overflow-hidden rounded-4xl border bg-[rgba(4,10,22,0.92)] transition-all duration-200",
          error
            ? "border-pink-500 shadow-[0_0_0_1px_rgba(236,72,153,0.4)]"
            : "border-brand-neutral-800",
        ].join(" ")}
      >
        {!previewUrl ? (
          <button
            type="button"
            onClick={handleOpenPicker}
            className="flex h-35 w-full cursor-pointer flex-col items-center justify-center px-6 text-center transition-all duration-200 hover:bg-brand-neutral-950/60 md:h-34.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-neutral-800 bg-brand-neutral-950 text-brand-neutral-25">
              <UploadCloud className="h-5 w-5" />
            </span>
            <p className="mt-5 text-[16px] font-semibold">
              <span className="text-brand-primary-200">Click to upload</span>
              <span className="text-brand-neutral-500"> or drag and drop</span>
            </p>
            <p className="mt-3 text-[14px] text-brand-neutral-500">
              PNG or JPG (max. 5mb)
            </p>
          </button>
        ) : (
          <div className="p-5">
            <div className="overflow-hidden rounded-[10px] bg-brand-neutral-950">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-78.5 w-full object-cover md:h-75"
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleOpenPicker}
                className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-neutral-900 px-4 text-[16px] font-medium text-brand-neutral-25 transition-all duration-200 hover:shadow-[0_0_16px_rgba(127,81,249,0.18)]"
              >
                <Image
                  src="/images/Phase Arrow.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="h-4.5 w-4.5"
                />
                Change Image
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-neutral-900 px-4 text-[16px] font-medium text-pink-500 transition-all duration-200 hover:shadow-[0_0_16px_rgba(236,72,153,0.2)]"
              >
                <Trash2 className="h-4.5 w-4.5" />
                Delete Image
              </button>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>
      {error ? <p className="mt-3 text-[14px] text-pink-500">{error}</p> : null}
    </div>
  );
}
