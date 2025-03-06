"use client";

import { useFeatureAccess } from "@/hooks/use-subscriptions";
import { type FeatureFlag } from "@/config/subscriptions";
import { ProFeatureBanner } from "./pro-feature-banner";
import { Skeleton } from "@/components/ui/skeleton";

interface FeatureGateProps {
  feature: FeatureFlag;
  children: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({
  feature,
  children,
  showUpgrade = true,
}: FeatureGateProps) {
  const { hasAccess, isLoading } = useFeatureAccess(feature);

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[125px] w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (!showUpgrade) {
      return (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground text-center">
            Diese Funktion ist nur für Pro-Mitglieder verfügbar.
          </p>
        </div>
      );
    }

    return (
      <ProFeatureBanner
        title="Pro-Feature"
        description="Diese Funktion ist nur für Pro-Mitglieder verfügbar."
      />
    );
  }

  return <>{children}</>;
}

function useFeatureGroupAccess(features: FeatureFlag[]) {
  const defaultFeature = features[0] || 'canAccessRealTimeData';
  
  const feature1 = useFeatureAccess(features[0] || defaultFeature);
  const feature2 = useFeatureAccess(features[1] || defaultFeature);
  const feature3 = useFeatureAccess(features[2] || defaultFeature);
  const feature4 = useFeatureAccess(features[3] || defaultFeature);
  const feature5 = useFeatureAccess(features[4] || defaultFeature);

  const isLoading = 
    feature1.isLoading || 
    feature2.isLoading || 
    feature3.isLoading || 
    feature4.isLoading || 
    feature5.isLoading;

  const hasAccess = 
    feature1.hasAccess && 
    (features.length < 2 || feature2.hasAccess) &&
    (features.length < 3 || feature3.hasAccess) &&
    (features.length < 4 || feature4.hasAccess) &&
    (features.length < 5 || feature5.hasAccess);

  return {
    isLoading,
    hasAccess,
    shouldRender: features.length > 0,
    isValidFeatureSet: features.length <= 5
  };
}

interface FeatureGateGroupProps {
  features: FeatureFlag[];
  children: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGateGroup({
  features,
  children,
  showUpgrade = true,
}: FeatureGateGroupProps) {
  const { isLoading, hasAccess, shouldRender, isValidFeatureSet } = useFeatureGroupAccess(features);

  if (!shouldRender) {
    return <>{children}</>;
  }

  if (!isValidFeatureSet) {
    console.warn('FeatureGateGroup unterstützt maximal 5 Features');
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-[125px] w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (!showUpgrade) {
      return (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground text-center">
            Diese Funktionen sind nur für Pro-Mitglieder verfügbar.
          </p>
        </div>
      );
    }

    return (
      <ProFeatureBanner
        title="Pro-Features"
        description="Diese Funktionen sind nur für Pro-Mitglieder verfügbar."
      />
    );
  }

  return <>{children}</>;
}