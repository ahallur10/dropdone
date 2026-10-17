import type { Metadata } from "next";
import { epilogue, geistSans, geistMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dropdone: Show it once. Drop it forever.",
  description:
    "Show Dropdone your messy export and the workbook you cleaned by hand. Next week, drop the new export and your workbook updates itself, wherever it lives.",
  icons: { apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
