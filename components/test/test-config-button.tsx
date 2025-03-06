"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { useTest } from "@/hooks/use-test-context";
import { TestConfigModal } from "./test-config";
import type { TestFeature } from "@/types/test";
import { TEST_MODE_LABELS } from "@/lib/test/constants";

interface TestConfigButtonProps {
  className?: string;
  showBadge?: boolean;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function TestConfigButton({
  className,
  showBadge = true,
  showLabel = true,
  size = "sm",
}: TestConfigButtonProps) {
  const [open, setOpen] = useState(false);
  const { mode, features, debug } = useTest();

  const activeFeatureCount = useMemo(() => {
    return features.length;
  }, [features]);

  const hasFeaturesEnabled = activeFeatureCount > 0;
  const isDebugMode = debug;

  const buttonLabel = showLabel ? (
    <>
      <Settings className="w-4 h-4 mr-2" />
      Test-Einstellungen
      {showBadge && hasFeaturesEnabled && (
        <Badge 
          variant="secondary" 
          className="ml-2"
        >
          {activeFeatureCount}
        </Badge>
      )}
    </>
  ) : (
    <Settings className="w-4 h-4" />
  );

  return (
    <>
      <Button
        variant={hasFeaturesEnabled ? "default" : "outline"}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
        title={`Test-Modus: ${TEST_MODE_LABELS[mode]}${
          isDebugMode ? " (Debug aktiv)" : ""
        }`}
      >
        {buttonLabel}
      </Button>
      <TestConfigModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

interface ActiveFeaturesProps {
  features: TestFeature[];
  className?: string;
}

export function ActiveFeatures({ features, className }: ActiveFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <div className={className}>
      {features.map((feature) => (
        <Badge
          key={feature}
          variant="outline"
          className="mr-2 last:mr-0"
        >
          {feature}
        </Badge>
      ))}
    </div>
  );
}

export function TestConfigButtonWithFeatures({
  className,
  showBadge,
  showLabel,
  size,
}: TestConfigButtonProps) {
  const { features } = useTest();

  return (
    <div className="space-y-2">
      <TestConfigButton
        className={className}
        showBadge={showBadge}
        showLabel={showLabel}
        size={size}
      />
      <ActiveFeatures
        features={features}
        className="flex flex-wrap gap-2"
      />
    </div>
  );
}