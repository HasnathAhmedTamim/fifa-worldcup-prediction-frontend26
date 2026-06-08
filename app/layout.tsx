import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/lib/query-provider";
import { Navbar } from "@/components/shared/Navbar";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "World Cup Prediction League",
  description: "Football prediction league app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={spaceGrotesk.variable}>
        <QueryProvider>
          <Navbar />

          <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 lg:py-8">
            {children}
          </main>

          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}

