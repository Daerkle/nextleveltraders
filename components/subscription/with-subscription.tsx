import { useSubscriptionFeatures } from "@/hooks/use-subscription";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { LockIcon, Loader2Icon } from "lucide-react";

interface WithSubscriptionProps {
  feature: keyof ReturnType<typeof useSubscriptionFeatures>["features"];
}

export function withSubscription<P extends object>(
  WrappedComponent: ComponentType<P>,
  { feature }: WithSubscriptionProps
) {
  return function WithSubscriptionComponent(props: P) {
    const { features, isLoading } = useSubscriptionFeatures();
    const router = useRouter();

    // Überprüfe den Feature-Zugriff
    const hasAccess = features[feature];

    useEffect(() => {
      // Wenn noch geladen wird, nichts tun
      if (isLoading) return;

      // Wenn kein Zugriff, zeige die Upgrade-Aufforderung
      if (!hasAccess) {
        // Optional: Redirect zur Pricing-Seite
        // router.push('/pricing');
      }
    }, [hasAccess, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!hasAccess) {
      return (
        <Card className="p-6">
          <Alert variant="destructive">
            <LockIcon className="h-4 w-4" />
            <AlertTitle>Pro-Feature</AlertTitle>
            <AlertDescription>
              Diese Funktion ist nur für Pro-Mitglieder verfügbar.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold">
              Upgrade auf NextLevelTraders Pro
            </h3>
            <p className="mt-2 text-muted-foreground">
              Erhalten Sie Zugriff auf alle Premium-Features und verbessern Sie Ihr Trading.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/pricing')}
            >
              Upgrade durchführen
            </Button>
          </div>
        </Card>
      );
    }

    // Wenn Zugriff gewährt, zeige die Komponente
    return <WrappedComponent {...props} />;
  };
}

// Beispiel für die Verwendung:
// const ProtectedComponent = withSubscription(MyComponent, { feature: "canAccessRealTimeData" });