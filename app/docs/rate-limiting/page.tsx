import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default function RateLimitingDocsPage() {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl mb-2">Rate Limiting</h1>
        <p className="text-muted-foreground">
          Informationen über die API-Nutzungsbeschränkungen und Rate Limiting in NextLevelTraders
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Überblick</h2>
        <p className="text-muted-foreground mb-6">
          Um eine faire Nutzung unserer API zu gewährleisten und die Servicequalität aufrechtzuerhalten,
          implementieren wir Rate Limiting. Die Limits unterscheiden sich je nach Abonnement-Status.
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Rate Limits nach Plan</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Requests/Stunde</TableHead>
                <TableHead className="text-right">Burst-Limit</TableHead>
                <TableHead>Hinweise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Basis (Kostenlos)</TableCell>
                <TableCell className="text-right">100</TableCell>
                <TableCell className="text-right">5/Minute</TableCell>
                <TableCell>15 Min. verzögerte Daten</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pro</TableCell>
                <TableCell className="text-right">1.000</TableCell>
                <TableCell className="text-right">50/Minute</TableCell>
                <TableCell>Echtzeit-Daten, höhere Priorität</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Rate Limit Headers</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Jede API-Antwort enthält die folgenden Headers:
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Header</TableHead>
                  <TableHead>Beschreibung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-sm">X-RateLimit-Limit</TableCell>
                  <TableCell>Maximale Anzahl der Anfragen pro Zeitfenster</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">X-RateLimit-Remaining</TableCell>
                  <TableCell>Verbleibende Anfragen im aktuellen Zeitfenster</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">X-RateLimit-Reset</TableCell>
                  <TableCell>Zeitpunkt, an dem das Limit zurückgesetzt wird</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-sm">Retry-After</TableCell>
                  <TableCell>Wartezeit in Sekunden bei Überschreitung des Limits</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
          <ul className="space-y-3 list-disc list-inside text-muted-foreground">
            <li>Implementieren Sie exponentielles Backoff bei Rate Limit Errors</li>
            <li>Cachen Sie Antworten wo möglich</li>
            <li>Nutzen Sie Batch-Anfragen statt vieler einzelner Requests</li>
            <li>Beachten Sie die Rate Limit Headers in Ihren API-Calls</li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Test und Demonstration</h3>
          <p className="text-muted-foreground mb-4">
            Sie können das Rate Limiting-System auf unserer Test-Seite ausprobieren:
          </p>
          <Link
            href="/test/rate-limit"
            className="inline-flex items-center text-primary hover:underline"
          >
            Zum Rate Limit Test
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-4">Fehlerbehandlung</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Bei Überschreitung des Rate Limits erhalten Sie eine{" "}
            <code className="px-1 py-0.5 bg-muted rounded text-sm">
              429 Too Many Requests
            </code>{" "}
            Antwort mit Details zum Reset-Zeitpunkt.
          </p>
          <div className="bg-card p-4 rounded-md border">
            <pre className="text-sm overflow-auto">
{`{
  "error": "Rate limit überschritten",
  "retryAfter": "2025-03-04T06:00:00.000Z",
  "limit": 100,
  "remaining": 0
}`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}