"use client";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Tamarind Feedback App</title>
        <meta name="description" content="Tamarind Feedback App" />
      </head>
      <body>
        <Toaster position="top-center" />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
