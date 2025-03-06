import type { TestMode, TestFeature } from "@/types/test";

/**
 * Verfügbare Test-Modi
 */
export const TEST_MODES = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

/**
 * Test-Feature Flags
 */
export const TEST_FEATURES = {
  RATE_LIMIT: "rate-limit",
  CODE_BLOCKS: "code-blocks",
  API_PLAYGROUND: "api-playground",
  SETTINGS: "settings",
} as const;

/**
 * Labels für Test-Modi
 */
export const TEST_MODE_LABELS: Record<TestMode, string> = {
  [TEST_MODES.DEVELOPMENT]: "Entwicklung",
  [TEST_MODES.PRODUCTION]: "Produktion",
  [TEST_MODES.TEST]: "Test",
};

/**
 * Labels für Test-Features
 */
export const TEST_FEATURE_LABELS: Record<TestFeature, string> = {
  [TEST_FEATURES.RATE_LIMIT]: "Rate Limiting",
  [TEST_FEATURES.CODE_BLOCKS]: "Code Blocks",
  [TEST_FEATURES.API_PLAYGROUND]: "API Playground",
  [TEST_FEATURES.SETTINGS]: "Settings",
};

/**
 * Beschreibungen für Test-Features
 */
export const TEST_FEATURE_DESCRIPTIONS: Record<TestFeature, string> = {
  [TEST_FEATURES.RATE_LIMIT]: "API Rate Limiting Tests und Demos",
  [TEST_FEATURES.CODE_BLOCKS]: "Code Block Komponenten und Syntax Highlighting",
  [TEST_FEATURES.API_PLAYGROUND]: "Interaktiver API Test-Bereich",
  [TEST_FEATURES.SETTINGS]: "Einstellungen und Konfigurationen",
};

/**
 * Standard-Test-Konfiguration
 */
export const DEFAULT_TEST_CONFIG = {
  mode: TEST_MODES.DEVELOPMENT,
  features: [] as TestFeature[],
  debug: false,
};

/**
 * Test-Feature Icons (Lucide Icon Names)
 */
export const TEST_FEATURE_ICONS = {
  [TEST_FEATURES.RATE_LIMIT]: "Activity",
  [TEST_FEATURES.CODE_BLOCKS]: "Code",
  [TEST_FEATURES.API_PLAYGROUND]: "Zap",
  [TEST_FEATURES.SETTINGS]: "Settings",
} as const;

/**
 * Test-Feature Gruppen
 */
export const TEST_FEATURE_GROUPS = {
  API: [TEST_FEATURES.RATE_LIMIT, TEST_FEATURES.API_PLAYGROUND],
  UI: [TEST_FEATURES.CODE_BLOCKS, TEST_FEATURES.SETTINGS],
} as const;

/**
 * Test-Feature Abhängigkeiten
 */
export const TEST_FEATURE_DEPENDENCIES: Partial<Record<TestFeature, TestFeature[]>> = {
  [TEST_FEATURES.API_PLAYGROUND]: [TEST_FEATURES.RATE_LIMIT],
};

/**
 * Test-Mode Berechtigungen
 */
export const TEST_MODE_PERMISSIONS = {
  [TEST_MODES.DEVELOPMENT]: {
    canAccessAllFeatures: true,
    canToggleFeatures: true,
    canChangeMode: true,
  },
  [TEST_MODES.PRODUCTION]: {
    canAccessAllFeatures: false,
    canToggleFeatures: false,
    canChangeMode: false,
  },
  [TEST_MODES.TEST]: {
    canAccessAllFeatures: true,
    canToggleFeatures: true,
    canChangeMode: true,
  },
};

/**
 * Test Environment Keys
 */
export const TEST_ENV_KEYS = {
  MODE: "TEST_MODE",
  FEATURES: "TEST_FEATURES",
  DEBUG: "TEST_DEBUG",
} as const;

/**
 * Test Storage Keys
 */
export const TEST_STORAGE_KEYS = {
  PREFERENCES: "test_preferences",
  LAST_MODE: "test_last_mode",
  ENABLED_FEATURES: "test_enabled_features",
} as const;