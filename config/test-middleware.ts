import { testMiddleware } from "@/middleware/require-test-features";
import type { TestFeature } from "@/types/test";
import { TEST_FEATURES } from "@/lib/test/constants";

/**
 * Route-Pattern für Test-Feature-Zugriffsschutz
 */
export const TEST_MIDDLEWARE_PATHS = {
  // Rate Limiting Test Routes
  RATE_LIMIT: [
    "/test/rate-limit",
    "/api/test-rate-limit",
  ] as const,

  // Code Block Test Routes
  CODE_BLOCKS: [
    "/test/code-blocks",
  ] as const,

  // API Playground Routes
  API_PLAYGROUND: [
    "/test/playground",
    "/api/test/playground/**",
  ] as const,

  // Settings Test Routes
  SETTINGS: [
    "/test/settings",
    "/api/test/settings/**",
  ] as const,
} as const;

type PathArrays = typeof TEST_MIDDLEWARE_PATHS;
type PathValues = PathArrays[keyof PathArrays];
type PathType = PathValues[number];

/**
 * Mapping von Test-Features zu ihren geschützten Routen
 */
export const TEST_FEATURE_ROUTES: Record<TestFeature, PathType[]> = {
  [TEST_FEATURES.RATE_LIMIT]: [...TEST_MIDDLEWARE_PATHS.RATE_LIMIT],
  [TEST_FEATURES.CODE_BLOCKS]: [...TEST_MIDDLEWARE_PATHS.CODE_BLOCKS],
  [TEST_FEATURES.API_PLAYGROUND]: [...TEST_MIDDLEWARE_PATHS.API_PLAYGROUND],
  [TEST_FEATURES.SETTINGS]: [...TEST_MIDDLEWARE_PATHS.SETTINGS],
};

/**
 * Test-Middleware-Konfiguration für Matcher
 */
export const testMiddlewareConfig = {
  // Rate Limiting Test Routes
  rateLimit: {
    matcher: TEST_MIDDLEWARE_PATHS.RATE_LIMIT,
    middleware: testMiddleware.rateLimit,
  },

  // Code Block Test Routes
  codeBlocks: {
    matcher: TEST_MIDDLEWARE_PATHS.CODE_BLOCKS,
    middleware: testMiddleware.codeBlocks,
  },

  // API Playground Routes
  apiPlayground: {
    matcher: TEST_MIDDLEWARE_PATHS.API_PLAYGROUND,
    middleware: testMiddleware.apiPlayground,
  },

  // Settings Test Routes
  settings: {
    matcher: TEST_MIDDLEWARE_PATHS.SETTINGS,
    middleware: testMiddleware.settings,
  },
} as const;

/**
 * Hilfsfunktion um zu prüfen, ob eine Route ein Test-Feature benötigt
 */
export function requiresTestFeature(path: string): TestFeature | null {
  for (const [feature, routes] of Object.entries(TEST_FEATURE_ROUTES)) {
    if (routes.some(route => {
      // Unterstützt glob patterns mit **
      const pattern = route.replace(/\*\*/g, ".*");
      return new RegExp(`^${pattern}$`).test(path);
    })) {
      return feature as TestFeature;
    }
  }
  return null;
}

/**
 * Alle geschützten Test-Routen
 */
export const PROTECTED_TEST_ROUTES = Object.values(TEST_FEATURE_ROUTES)
  .flatMap(routes => routes) as string[];

/**
 * Prüft, ob eine Route durch Test-Middleware geschützt ist
 */
export function isProtectedTestRoute(path: string): boolean {
  return requiresTestFeature(path) !== null;
}

/**
 * Gibt alle Test-Features zurück, die für eine Route erforderlich sind
 */
export function getRequiredTestFeatures(path: string): TestFeature[] {
  return Object.entries(TEST_FEATURE_ROUTES)
    .filter(([, routes]) => 
      routes.some(route => {
        const pattern = route.replace(/\*\*/g, ".*");
        return new RegExp(`^${pattern}$`).test(path);
      })
    )
    .map(([feature]) => feature as TestFeature);
}

/**
 * Generiert einen Matcher für Next.js Middleware
 */
export function createTestRouteMatcher(routes: readonly string[]): string[] {
  return routes.map(route => {
    // Convert ** wildcard to Next.js path matching
    return route.replace(/\*\*/g, ":path*");
  });
}

/**
 * Alle Test-Route-Matcher für die Middleware-Konfiguration
 */
export const TEST_ROUTE_MATCHERS = Object.fromEntries(
  Object.entries(TEST_MIDDLEWARE_PATHS).map(([key, routes]) => [
    key,
    createTestRouteMatcher(routes),
  ])
) as Record<keyof typeof TEST_MIDDLEWARE_PATHS, string[]>;