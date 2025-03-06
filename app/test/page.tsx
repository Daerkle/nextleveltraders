import { Card } from "@/components/ui/card";
import {
  TestContainer,
  TestNav,
  TestNote,
  TestGroup,
  TestMetadata,
} from "@/components/test";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function TestIndexPage() {
  return (
    <TestContainer
      title="Test & Demo"
      description="Testen und Erkunden Sie die Features von NextLevelTraders"
      sidebar={
        <TestGroup className="space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <BadgeCheck className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-semibold">Test Center</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Diese Seiten sind Teil der NextLevelTraders Test- und Demo-Umgebung.
              Sie dienen der Entwicklung und dem Test von Features und Komponenten.
            </p>
          </Card>

          <Card className="p-4">
            <TestMetadata
              items={{
                "Node ENV": process.env.NODE_ENV || "development",
                "API URL": process.env.NEXT_PUBLIC_API_URL || "local",
                "Version": process.env.NEXT_PUBLIC_APP_VERSION || "dev",
              }}
            />
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2">Hilfreiche Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dokumentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  API Referenz
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/support"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </Card>
        </TestGroup>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Test & Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Testen und Erkunden Sie die Features von NextLevelTraders
          </p>
        </div>

        <TestNote type="info">
          Einige Features sind noch in Entwicklung und werden bald verfügbar sein.
          Der Funktionsumfang wird kontinuierlich erweitert.
        </TestNote>

        <div className="mt-6">
          <TestNav
            variant="grid"
            showTags
            showIcons
          />
        </div>

        <div className="mt-8 pt-6 border-t">
          <Card className="p-6 bg-muted/50">
            <h3 className="text-lg font-semibold mb-4">Entwickler Information</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Diese Seiten sind für Entwickler und Power-User gedacht, die die
                Features von NextLevelTraders im Detail testen und verstehen möchten.
              </p>
              <p>
                Die Tests sind nach Funktionsbereichen gruppiert und bieten
                interaktive Demos sowie Code-Beispiele.
              </p>
              <p>
                Einige Features sind abhängig von Ihrem Abonnement-Status. Ein
                Pro-Abonnement schaltet zusätzliche Funktionen und höhere Limits
                frei.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </TestContainer>
  );
}