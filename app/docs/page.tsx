import { Card } from "@/components/ui/card";
import Link from "next/link";

const documentationSections = [
  {
    title: "Erste Schritte",
    description: "Grundlagen und Einrichtung der NextLevelTraders Plattform",
    links: [
      { href: "/docs/getting-started", label: "Einführung" },
      { href: "/docs/authentication", label: "Authentifizierung" },
      { href: "/docs/rate-limiting", label: "Rate Limiting" },
    ],
  },
  {
    title: "API Referenz",
    description: "Detaillierte API-Dokumentation und Beispiele",
    links: [
      { href: "/docs/api/watchlists", label: "Watchlists" },
      { href: "/docs/api/market-data", label: "Marktdaten" },
      { href: "/docs/api/setups", label: "Trading Setups" },
    ],
  },
  {
    title: "Ressourcen",
    description: "Hilfreiche Ressourcen und Support",
    links: [
      { href: "/docs/examples", label: "Code-Beispiele" },
      { href: "/docs/faq", label: "FAQ" },
      { href: "/docs/support", label: "Support" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="container py-10 max-w-5xl">
      <div className="space-y-4">
        <h1 className="font-heading text-3xl">Dokumentation</h1>
        <p className="text-muted-foreground max-w-[750px]">
          Willkommen in der NextLevelTraders Dokumentation. Hier finden Sie alles,
          was Sie für die Nutzung unserer Plattform und APIs benötigen.
        </p>
      </div>

      <div className="grid gap-6 mt-8">
        {documentationSections.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="font-heading text-2xl mb-2">{section.title}</h2>
            <p className="text-muted-foreground mb-4">{section.description}</p>
            <div className="grid gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center text-sm hover:text-primary transition-colors"
                >
                  {link.label}
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
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="font-heading text-2xl mb-4">API Playground</h2>
        <Card className="p-6 bg-muted/50">
          <p className="text-muted-foreground mb-4">
            Testen Sie unsere APIs interaktiv und erhalten Sie sofortiges Feedback:
          </p>
          <Link
            href="/test/rate-limit"
            className="inline-flex items-center text-primary hover:underline"
          >
            Rate Limit Tester ausprobieren
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </Card>
      </div>
    </div>
  );
}