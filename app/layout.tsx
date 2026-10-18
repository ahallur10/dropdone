import type { Metadata } from "next";
import { epilogue, geistSans, geistMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dropdone: Show it once. Drop it forever.",
  description:
    "Show Dropdone your messy export and the workbook you cleaned by hand. Next week, drop the new export and your workbook updates itself, wherever it lives.",
  icons: { apple: "/apple-touch-icon.png" },
  // Link previews (Slack, iMessage, social) use the hero still.
  metadataBase: new URL("https://dropdone-kappa.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Dropdone",
    title: "Dropdone: Show it once. Drop it forever.",
    description: "Clean one messy export by hand. Dropdone does the same cleanup on every export after that.",
    images: [{ url: "/dropdone-hero-poster.jpg", width: 1280, height: 714, alt: "A messy spreadsheet being cleaned" }],
  },
  twitter: { card: "summary_large_image" },
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
