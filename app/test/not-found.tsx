import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestContainer } from "@/components/test/test-container";
import { FileSearch } from "lucide-react";
import Link from "next/link";

export default function TestNotFoundPage() {
  return (
    <TestContainer>
      <Card className="p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <FileSearch className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Test-Seite nicht gefunden
            </h1>
            <p className="text-muted-foreground">
              Die gesuchte Test- oder Demo-Seite existiert nicht oder wurde verschoben.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default">
              <Link href="/test">
                Zur Test-Übersicht
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">
                Zur Dokumentation
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t w-full max-w-sm">
            <p className="text-sm text-muted-foreground">
              Verfügbare Test-Seiten finden Sie in der{" "}
              <Link
                href="/test"
                className="text-primary hover:underline"
              >
                Test-Übersicht
              </Link>
              . Wenn Sie glauben, dass dies ein Fehler ist, kontaktieren Sie bitte
              den{" "}
              <Link
                href="/docs/support"
                className="text-primary hover:underline"
              >
                Support
              </Link>
              .
            </p>
          </div>
        </div>
      </Card>
    </TestContainer>
  );
}