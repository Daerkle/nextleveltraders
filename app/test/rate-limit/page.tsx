"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { RateLimitStatus } from "@/components/subscription/rate-limit-status";
import { CodeBlock } from "@/components/docs/code-block";
import {
  TestContainer,
  TestSection,
  TestExample,
  TestGroup,
  TestNote,
  TestMetadata,
} from "@/components/test";

interface ApiResponse {
  message?: string;
  timestamp?: string;
  headers?: Record<string, string>;
  error?: string;
}

interface ResponseLog {
  status: number;
  data: ApiResponse;
  timestamp: string;
}

const codeExample = `// Beispiel für die Verwendung des Rate Limiters
const { withRateLimit } = useRateLimit();

async function fetchData() {
  try {
    const data = await withRateLimit(
      () => fetch("/api/data"),
      "Fehler beim Laden der Daten"
    );
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`;

export default function RateLimitTestPage() {
  const { withRateLimit, currentLimit, remainingRequests } = useRateLimit();
  const [responses, setResponses] = useState<ResponseLog[]>([]);
  const [loading, setLoading] = useState(false);

  const makeRequest = async () => {
    setLoading(true);
    try {
      const data = await withRateLimit<ApiResponse>(
        () => fetch("/api/test-rate-limit"),
        "Fehler beim Test des Rate Limits"
      );
      setResponses(prev => [
        {
          status: 200,
          data,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      setResponses(prev => [
        {
          status: error instanceof Error ? 429 : 500,
          data: {
            error: error instanceof Error ? error.message : "Unbekannter Fehler",
          },
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const makeMultipleRequests = async (count: number) => {
    setLoading(true);
    for (let i = 0; i < count; i++) {
      await makeRequest();
      // Kleine Verzögerung zwischen den Anfragen
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setLoading(false);
  };

  return (
    <TestContainer
      title="Rate Limit Test"
      description="Test und Demo des API Rate Limiting Systems"
      sidebar={
        <TestGroup>
          <TestExample title="Rate Limit Status">
            <RateLimitStatus />
          </TestExample>

          <TestExample title="Aktuelle Limits">
            <TestMetadata
              items={{
                "Limit pro Stunde": currentLimit,
                "Verbleibend": remainingRequests,
                "Auslastung": `${Math.round((1 - remainingRequests / currentLimit) * 100)}%`,
              }}
            />
          </TestExample>
        </TestGroup>
      }
    >
      <TestSection
        title="Rate Limit Test"
        description="Testen Sie das API Rate Limiting System mit verschiedenen Request-Mustern."
      >
        <TestGroup>
          <TestNote type="info">
            Mit diesen Tests können Sie das Rate Limiting System in Aktion sehen.
            Die Limits basieren auf Ihrem Abonnement-Status.
          </TestNote>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => makeRequest()}
              disabled={loading}
            >
              Einzelne Anfrage
            </Button>
            <Button
              onClick={() => makeMultipleRequests(5)}
              disabled={loading}
              variant="outline"
            >
              5 Anfragen
            </Button>
            <Button
              onClick={() => makeMultipleRequests(10)}
              disabled={loading}
              variant="outline"
            >
              10 Anfragen
            </Button>
          </div>

          <TestExample
            title="Antwort-Log"
            description="Die letzten 10 API-Antworten werden hier angezeigt."
          >
            <div className="space-y-4">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    response.status === 200
                      ? "bg-green-500/10"
                      : "bg-destructive/10"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono">
                      Status: {response.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              ))}
              {responses.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Noch keine Anfragen durchgeführt.
                </p>
              )}
            </div>
          </TestExample>

          <TestExample
            title="Code Beispiel"
            description="So verwenden Sie den Rate Limiter in Ihrem Code:"
          >
            <CodeBlock
              code={codeExample}
              language="typescript"
              fileName="example.ts"
            />
          </TestExample>
        </TestGroup>
      </TestSection>
    </TestContainer>
  );
}