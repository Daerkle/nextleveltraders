import { LucideIcon } from "lucide-react";

/**
 * Eine Test-Seite im Test & Demo Bereich
 */
export interface TestPage {
  /** Titel der Test-Seite */
  title: string;
  /** Beschreibung der Test-Seite */
  description: string;
  /** URL-Pfad zur Test-Seite */
  href: string;
  /** Icon der Test-Seite */
  icon: LucideIcon;
  /** Tags zur Kategorisierung */
  tags: string[];
  /** Markiert die Seite als "Coming Soon" */
  comingSoon?: boolean;
}

/**
 * Test-Modi für verschiedene Umgebungen
 */
export const TEST_MODES = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

/**
 * Verfügbare Test-Features
 */
export const TEST_FEATURES = {
  RATE_LIMIT: 'rate-limit',
  CODE_BLOCKS: 'code-blocks',
  API_PLAYGROUND: 'api-playground',
  SETTINGS: 'settings',
} as const;

export type TestMode = typeof TEST_MODES[keyof typeof TEST_MODES];
export type TestFeature = typeof TEST_FEATURES[keyof typeof TEST_FEATURES];

/**
 * Ein Test-Beispiel innerhalb einer Test-Seite
 */
export interface TestExample {
  /** Titel des Beispiels */
  title: string;
  /** Optionale Beschreibung */
  description?: string;
  /** Code des Beispiels */
  code?: string;
  /** Programmiersprache des Codes */
  language?: string;
  /** Dateiname für Code-Beispiele */
  fileName?: string;
}

/**
 * Status eines Test-Requests
 */
export interface TestRequestStatus {
  /** HTTP Status Code */
  code: number;
  /** Statustext */
  text: string;
  /** Zeitstempel */
  timestamp: string;
  /** Zusätzliche Daten */
  data?: unknown;
  /** Fehlermeldung */
  error?: string;
}

/**
 * Test-Umgebungsinformationen
 */
export interface TestEnvironment {
  /** Ist Entwicklungsumgebung */
  isDevelopment: boolean;
  /** Next.js Version */
  nextVersion: string;
  /** React Version */
  reactVersion: string;
  /** Node Version */
  nodeVersion: string;
  /** API URL */
  apiUrl: string;
  /** Subscription Plan */
  plan: 'free' | 'pro';
  /** Feature Flags */
  features: Record<string, boolean>;
}

/**
 * Optionen für Test-Container
 */
export interface TestContainerOptions {
  /** Titel im Browser-Tab */
  title?: string;
  /** Beschreibung für SEO */
  description?: string;
  /** Test-Modus */
  mode?: TestMode;
  /** Aktivierte Features */
  features?: TestFeature[];
  /** Zeige Umgebungsinformationen */
  showEnvironmentInfo?: boolean;
  /** Zeige Debug-Informationen */
  debug?: boolean;
  /** Zusätzliche Metadaten */
  metadata?: Record<string, string>;
}

/**
 * Konfiguration für einen Test-Kontext
 */
export interface TestContextConfig {
  /** Gewählter Test-Modus */
  mode: TestMode;
  /** Aktivierte Features */
  features: TestFeature[];
  /** Debug-Modus aktiviert */
  debug: boolean;
  /** Event-Handler für Änderungen */
  onChange?: (config: TestContextConfig) => void;
}