import { type TestMode, type TestFeature } from "@/types/test";
import {
  TEST_MODES,
  TEST_FEATURES,
  TEST_FEATURE_DEPENDENCIES,
  TEST_MODE_PERMISSIONS,
  TEST_STORAGE_KEYS,
} from "./constants";

/**
 * Prüft, ob ein Wert ein gültiger Test-Modus ist
 */
export function isValidTestMode(mode: unknown): mode is TestMode {
  return typeof mode === "string" && mode in TEST_MODES;
}

/**
 * Prüft, ob ein Wert ein gültiges Test-Feature ist
 */
export function isValidTestFeature(feature: unknown): feature is TestFeature {
  return typeof feature === "string" && feature in TEST_FEATURES;
}

/**
 * Prüft, ob ein Feature in einem bestimmten Modus aktiviert werden kann
 */
export function canEnableFeature(feature: TestFeature, mode: TestMode): boolean {
  const permissions = TEST_MODE_PERMISSIONS[mode];
  if (!permissions) return false;
  
  // Im Entwicklungsmodus ist alles erlaubt
  if (permissions.canAccessAllFeatures) return true;

  // Prüfe Abhängigkeiten
  const dependencies = TEST_FEATURE_DEPENDENCIES[feature] || [];
  return dependencies.length === 0;
}

/**
 * Lädt die Test-Einstellungen aus dem localStorage
 */
export function loadTestPreferences() {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(TEST_STORAGE_KEYS.PREFERENCES);
    if (!stored) return null;

    const preferences = JSON.parse(stored);
    
    // Validiere die geladenen Einstellungen
    if (
      typeof preferences === "object" &&
      preferences !== null &&
      isValidTestMode(preferences.mode) &&
      Array.isArray(preferences.features) &&
      preferences.features.every(isValidTestFeature)
    ) {
      return preferences;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Test-Einstellungen:", error);
  }

  return null;
}

/**
 * Speichert die Test-Einstellungen im localStorage
 */
export function saveTestPreferences(preferences: {
  mode: TestMode;
  features: TestFeature[];
}) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      TEST_STORAGE_KEYS.PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.error("Fehler beim Speichern der Test-Einstellungen:", error);
  }
}

/**
 * Aktiviert ein Feature und alle seine Abhängigkeiten
 */
export function enableFeatureWithDependencies(
  feature: TestFeature,
  currentFeatures: TestFeature[]
): TestFeature[] {
  const dependencies = TEST_FEATURE_DEPENDENCIES[feature] || [];
  const newFeatures = new Set([...currentFeatures, feature, ...dependencies]);
  return Array.from(newFeatures);
}

/**
 * Deaktiviert ein Feature und alle Features, die davon abhängen
 */
export function disableFeatureWithDependents(
  feature: TestFeature,
  currentFeatures: TestFeature[]
): TestFeature[] {
  // Finde alle Features, die von diesem Feature abhängen
  const dependents = Object.entries(TEST_FEATURE_DEPENDENCIES)
    .filter(([, deps]) => deps.includes(feature))
    .map(([dependent]) => dependent as TestFeature);

  return currentFeatures.filter(
    (f) => f !== feature && !dependents.includes(f)
  );
}

/**
 * Prüft, ob ein Feature aktiviert werden kann (basierend auf Abhängigkeiten)
 */
export function canActivateFeature(
  feature: TestFeature,
  currentFeatures: TestFeature[]
): boolean {
  const dependencies = TEST_FEATURE_DEPENDENCIES[feature] || [];
  return dependencies.every((dep) => currentFeatures.includes(dep));
}

/**
 * Prüft, ob ein Feature deaktiviert werden kann (basierend auf abhängigen Features)
 */
export function canDeactivateFeature(
  feature: TestFeature,
  currentFeatures: TestFeature[]
): boolean {
  return !Object.entries(TEST_FEATURE_DEPENDENCIES)
    .some(([dependent, deps]) =>
      currentFeatures.includes(dependent as TestFeature) &&
      deps.includes(feature)
    );
}

/**
 * Gibt eine Liste aller verfügbaren Features zurück, die in einem bestimmten Modus aktiviert werden können
 */
export function getAvailableFeaturesForMode(mode: TestMode): TestFeature[] {
  const permissions = TEST_MODE_PERMISSIONS[mode];
  if (!permissions) return [];

  if (permissions.canAccessAllFeatures) {
    return Object.values(TEST_FEATURES);
  }

  return Object.entries(TEST_FEATURE_DEPENDENCIES)
    .filter(([, deps]) => deps.length === 0)
    .map(([feature]) => feature as TestFeature);
}

/**
 * Erstellt eine neue Test-Konfiguration mit Standardwerten
 */
export function createDefaultTestConfig(mode: TestMode = TEST_MODES.DEVELOPMENT) {
  return {
    mode,
    features: [],
    debug: process.env.NODE_ENV === "development",
  };
}