import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be found in public/fonts
const fontHeading = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: "NextLevelTraders",
    template: "%s | NextLevelTraders",
  },
  description: "Fortschrittliche technische Analyse und Trading-Tools",
  keywords: [
    "trading",
    "technical analysis",
    "stock market",
    "crypto",
    "forex",
    "pivot points",
    "charts",
  ],
  authors: [
    {
      name: "NextLevelTraders",
      url: "https://nextleveltraders.com",
    },
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          card: "bg-card shadow-md",
          headerTitle: "text-2xl font-semibold",
          headerSubtitle: "text-muted-foreground",
        },
      }}
    >
      <html lang="de" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontHeading.variable
          )}
        >
          <AppProviders>{children}</AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
