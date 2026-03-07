import type { Metadata } from "next";
import "./globals.css";
import { sfPro } from "../lib/fonts";

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
      <body>{children}</body>
    </html>
  );
}
