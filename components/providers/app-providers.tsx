"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SubscriptionProvider } from "@/components/subscription/subscription-provider";
import { RateLimitProvider } from "@/components/providers/rate-limit-provider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SubscriptionProvider>
        <RateLimitProvider showStatus>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
              classNames: {
                toast: "group",
                description: "text-muted-foreground text-sm",
                actionButton:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                cancelButton:
                  "bg-muted text-muted-foreground hover:bg-muted/90",
              },
            }}
          />
        </RateLimitProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}