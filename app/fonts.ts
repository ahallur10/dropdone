// app/fonts.ts
// Loads Dropdone's three typefaces through next/font so they self-host with no layout shift.
// In app/layout.tsx:
//   import { epilogue, geistSans, geistMono } from "./fonts";
//   <html lang="en" className={`${epilogue.variable} ${geistSans.variable} ${geistMono.variable}`}>

import { Epilogue, Geist, Geist_Mono } from "next/font/google";

export const epilogue = Epilogue({
  subsets: ["latin"],
  style: ["normal", "italic"], // italic is only used by type-display and type-stat
  variable: "--font-epilogue",
  display: "swap",
});

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
