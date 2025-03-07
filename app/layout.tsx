import { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.otf",
      weight: "400",
      style: "normal"
    },
    {
      path: "../public/fonts/Geist-Medium.otf",
      weight: "500",
      style: "normal"
    },
    {
      path: "../public/fonts/Geist-SemiBold.otf",
      weight: "600",
      style: "normal"
    },
    {
      path: "../public/fonts/Geist-Bold.otf",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-sans"
});

const fontHeading = localFont({
  src: "../public/fonts/Geist-Bold.otf",
  variable: "--font-heading"
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
