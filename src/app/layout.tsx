import type { Metadata } from "next";
import "./globals.css";
import { sfPro } from "../lib/fonts";
import AppProviders from "@/providers/appProviders";

export const metadata: Metadata = {
  title: "Sociality Web App",
  description: "Social media frontend built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sfPro.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
