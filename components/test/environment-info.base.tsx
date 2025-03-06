"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { TestEnvironment } from "@/types/test";
import { Info, Activity, Check, X } from "lucide-react";
import { TestEnvironmentInfoLoading } from "./environment-info.loading";

function getTestEnvironmentInfo(): TestEnvironment {
  return {
    isDevelopment: process.env.NODE_ENV === "development",
    nextVersion: process.env.NEXT_PUBLIC_NEXT_VERSION || "latest",
    reactVersion: process.env.NEXT_PUBLIC_REACT_VERSION || "latest",
    nodeVersion: process.env.NEXT_PUBLIC_NODE_VERSION || process.version || "unknown",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || window.location.origin,
    plan: "free",
    features: {
      realTimeData: false,
      advancedAnalytics: false,
      aiAssistant: false,
      customWatchlists: false,
      prioritySupport: false,
    },
  };
}

export function TestEnvironmentInfo() {
  const { isPro } = useSubscription();
  const [envInfo, setEnvInfo] = useState<TestEnvironment>(getTestEnvironmentInfo());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to prevent flash
    const timer = setTimeout(() => {
      setEnvInfo((prev) => ({
        ...prev,
        plan: isPro ? "pro" : "free",
        features: {
          realTimeData: isPro,
          advancedAnalytics: isPro,
          aiAssistant: isPro,
          customWatchlists: true,
          prioritySupport: isPro,
        },
      }));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isPro]);

  if (isLoading) {
    return <TestEnvironmentInfoLoading />;
  }

  const renderFeatureStatus = (enabled: boolean) => (
    <span className={`flex items-center gap-1 ${enabled ? "text-green-500" : "text-red-500"}`}>
      {enabled ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    </span>
  );

  const renderPlanBadge = () => (
    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
      isPro 
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground"
    }`}>
      {envInfo.plan.toUpperCase()}
    </div>
  );

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">System Status</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              envInfo.isDevelopment ? "bg-yellow-500" : "bg-green-500"
            }`} />
            <span className="text-sm text-muted-foreground">
              {envInfo.isDevelopment ? "Development" : "Production"}
            </span>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Environment:</span>
            <span className="font-mono">{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Next.js:</span>
            <span className="font-mono">{envInfo.nextVersion}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">React:</span>
            <span className="font-mono">{envInfo.reactVersion}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plan:</span>
            {renderPlanBadge()}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium">Features</h4>
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="grid gap-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Echtzeit-Daten</span>
              {renderFeatureStatus(envInfo.features.realTimeData)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Erweiterte Analysen</span>
              {renderFeatureStatus(envInfo.features.advancedAnalytics)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">KI-Assistent</span>
              {renderFeatureStatus(envInfo.features.aiAssistant)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Watchlists</span>
              {renderFeatureStatus(envInfo.features.customWatchlists)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Priority Support</span>
              {renderFeatureStatus(envInfo.features.prioritySupport)}
            </div>
          </div>
        </div>

        {envInfo.isDevelopment && (
          <div className="text-xs text-muted-foreground mt-4 p-2 bg-background/50 rounded-sm flex items-start gap-2">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <p>
              Sie befinden sich in der Entwicklungsumgebung. Einige Features
              könnten sich in der Produktionsumgebung anders verhalten.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function TestPageContainer({
  children,
  showEnvInfo = true,
}: {
  children: React.ReactNode;
  showEnvInfo?: boolean;
}) {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      {children}
      {showEnvInfo && (
        <div className="mt-8">
          <TestEnvironmentInfo />
        </div>
      )}
    </div>
  );
}