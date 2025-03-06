import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { TestMode, TestFeature } from "@/types/test";
import {
  TEST_MODES,
  TEST_FEATURES,
  TEST_MODE_PERMISSIONS,
  TEST_STORAGE_KEYS,
} from "@/lib/test/constants";

interface TestPreferences {
  mode: TestMode;
  features: TestFeature[];
  debug: boolean;
}

/**
 * Middleware-Konfiguration für Test-Feature-Zugriff
 */
export interface TestFeatureConfig {
  /** Erforderliche Features für den Zugriff */
  requiredFeatures?: TestFeature[];
  /** Erlaubte Test-Modi */
  allowedModes?: TestMode[];
  /** Prüft, ob Debug-Modus erforderlich ist */
  requireDebug?: boolean;
  /** Umleitung bei nicht erfüllten Anforderungen */
  redirect?: string;
}

/**
 * Middleware zum Prüfen von Test-Features und -Modi
 */
export function requireTestFeatures(config: TestFeatureConfig = {}) {
  return async function middleware(request: NextRequest) {
    const {
      requiredFeatures = [],
      allowedModes = [TEST_MODES.DEVELOPMENT, TEST_MODES.TEST],
      requireDebug = false,
      redirect = "/test",
    } = config;

    // Prüfe Test-Umgebung
    if (process.env.NODE_ENV === "production") {
      console.warn("Test features are not available in production");
      return NextResponse.redirect(new URL(redirect, request.url));
    }

    try {
      // Lade Test-Einstellungen aus Cookies
      const testPreferences = request.cookies.get(TEST_STORAGE_KEYS.PREFERENCES);
      if (!testPreferences?.value) {
        throw new Error("No test preferences found");
      }

      const preferences = JSON.parse(testPreferences.value) as TestPreferences;
      
      // Validiere Mode
      if (!Object.values(TEST_MODES).includes(preferences.mode)) {
        throw new Error("Invalid test mode");
      }

      // Validiere Features
      const validFeatures = preferences.features.filter((feature): feature is TestFeature => 
        Object.values(TEST_FEATURES).includes(feature)
      );
      preferences.features = validFeatures;

      // Prüfe Test-Modus
      if (!allowedModes.includes(preferences.mode)) {
        throw new Error(`Test mode ${preferences.mode} is not allowed`);
      }

      // Prüfe Test-Feature-Berechtigungen
      const permissions = TEST_MODE_PERMISSIONS[preferences.mode];
      if (!permissions?.canAccessAllFeatures) {
        // Prüfe, ob alle erforderlichen Features aktiviert sind
        const missingFeatures = requiredFeatures.filter(
          (feature) => !preferences.features.includes(feature)
        );

        if (missingFeatures.length > 0) {
          throw new Error(
            `Missing required features: ${missingFeatures.join(", ")}`
          );
        }
      }

      // Prüfe Debug-Modus
      if (requireDebug && !preferences.debug) {
        throw new Error("Debug mode is required");
      }

      // Alles OK - Request kann fortgesetzt werden
      return NextResponse.next();

    } catch (error) {
      console.warn("Test feature access denied:", error);
      
      // Füge Fehlermeldung zu den Suchparametern hinzu
      const url = new URL(redirect, request.url);
      url.searchParams.set("error", error instanceof Error ? error.message : "Access denied");
      url.searchParams.set("from", request.nextUrl.pathname);

      return NextResponse.redirect(url);
    }
  };
}

/**
 * HOF zum Erstellen einer Test-Feature-Middleware mit Konfiguration
 */
export function createTestFeatureMiddleware(config: TestFeatureConfig) {
  return requireTestFeatures(config);
}

/**
 * Middleware für einzelne Test-Features
 */
export const withTestFeature = (feature: TestFeature) =>
  requireTestFeatures({
    requiredFeatures: [feature],
  });

/**
 * Middleware für Debug-Modus
 */
export const requireDebugMode = requireTestFeatures({
  requireDebug: true,
});

/**
 * Factory für Feature-spezifische Middleware mit zusätzlicher Konfiguration
 */
export function createFeatureMiddleware(
  feature: TestFeature,
  config: Omit<TestFeatureConfig, "requiredFeatures"> = {}
) {
  return requireTestFeatures({
    ...config,
    requiredFeatures: [feature],
  });
}

/**
 * Vordefinierte Middleware für bestimmte Features
 */
export const testMiddleware = {
  rateLimit: createFeatureMiddleware(TEST_FEATURES.RATE_LIMIT),
  codeBlocks: createFeatureMiddleware(TEST_FEATURES.CODE_BLOCKS),
  apiPlayground: createFeatureMiddleware(TEST_FEATURES.API_PLAYGROUND, {
    requireDebug: true,
  }),
  settings: createFeatureMiddleware(TEST_FEATURES.SETTINGS),
};