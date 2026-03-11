"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      offset={24}
      toastOptions={{
        className:
          "mt-16 md:mt-20 mr-2 md:mr-6 rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.28)]",
      }}
    />
  );
}
