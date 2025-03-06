import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Star } from "lucide-react";

interface ProFeatureBannerProps {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
}

export function ProFeatureBanner({
  title = "Pro-Feature",
  description = "Diese Funktion ist nur für Pro-Mitglieder verfügbar.",
  features = [
    "Erweiterte Pivot-Analysen",
    "Echtzeit-Daten",
    "KI-Trading-Assistent",
    "Multi-Timeframe-Analysen",
    "Unbegrenzte Watchlists",
  ],
  className,
}: ProFeatureBannerProps) {
  const router = useRouter();

  return (
    <Card className={`p-6 relative overflow-hidden ${className}`}>
      {/* Hintergrund-Effekt */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />

      {/* Pro-Badge */}
      <Badge
        variant="secondary"
        className="absolute top-4 right-4 px-3 py-1 bg-primary/10"
      >
        <Star className="w-4 h-4 mr-1" />
        Pro
      </Badge>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/pricing")}
          >
            Upgrade auf Pro
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push("/dashboard")}
          >
            Später
          </Button>
        </div>
      </div>
    </Card>
  );
}