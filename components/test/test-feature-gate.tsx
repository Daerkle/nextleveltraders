"use client";

import { useTest } from "./test-context";
import type { TestFeature } from "@/types/test";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

interface TestFeatureGateProps {
  /** Feature that needs to be enabled */
  feature: TestFeature;
  /** Content to show when feature is enabled */
  children: React.ReactNode;
  /** Optional heading when feature is disabled */
  title?: string;
  /** Optional message when feature is disabled */
  message?: string;
  /** Optional fallback content when feature is disabled */
  fallback?: React.ReactNode;
}

export function TestFeatureGate({
  feature,
  children,
  title = "Feature nicht verfügbar",
  message = "Diese Funktionalität ist derzeit nicht aktiviert.",
  fallback,
}: TestFeatureGateProps) {
  const { isFeatureEnabled, toggleFeature } = useTest();
  const isEnabled = isFeatureEnabled(feature);

  if (isEnabled) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-muted rounded-full">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => toggleFeature(feature)}
          >
            Feature aktivieren
          </Button>
          <Button
            variant="ghost"
            asChild
          >
            <Link href="/test">
              Zur Test-Übersicht
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface TestFeatureProps {
  /** Feature to check */
  feature: TestFeature;
  /** Content to show when feature is enabled */
  children: React.ReactNode;
  /** Optional fallback content when feature is disabled */
  fallback?: React.ReactNode;
}

export function WithFeature({
  feature,
  children,
  fallback,
}: TestFeatureProps) {
  const { isFeatureEnabled } = useTest();
  
  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}

interface TestFeatureToggleProps {
  /** Feature to toggle */
  feature: TestFeature;
  /** Optional label */
  label?: string;
  /** Optional description */
  description?: string;
  /** Optional custom children */
  children?: React.ReactNode;
}

export function FeatureToggle({
  feature,
  label,
  description,
  children,
}: TestFeatureToggleProps) {
  const { isFeatureEnabled, toggleFeature } = useTest();
  const enabled = isFeatureEnabled(feature);

  if (children) {
    return (
      <div 
        onClick={() => toggleFeature(feature)} 
        role="button" 
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleFeature(feature);
          }
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => toggleFeature(feature)}
      className="w-full justify-start"
    >
      <div className="flex flex-col items-start text-left">
        <span className="font-medium">
          {label || feature}{" "}
          <span className={enabled ? "text-primary" : "text-muted-foreground"}>
            ({enabled ? "aktiviert" : "deaktiviert"})
          </span>
        </span>
        {description && (
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
    </Button>
  );
}