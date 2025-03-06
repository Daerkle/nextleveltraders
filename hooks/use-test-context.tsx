"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { TestMode, TestFeature, TestContextConfig } from "@/types/test";
import { TEST_MODES } from "@/lib/test/constants";
import {
  loadTestPreferences,
  saveTestPreferences,
  canEnableFeature,
  enableFeatureWithDependencies,
  disableFeatureWithDependents,
  canActivateFeature,
  canDeactivateFeature,
  createDefaultTestConfig,
  isValidTestMode,
  isValidTestFeature,
} from "@/lib/test/utils";

interface TestContextValue extends TestContextConfig {
  isFeatureEnabled: (feature: TestFeature) => boolean;
  toggleFeature: (feature: TestFeature) => void;
  enableFeature: (feature: TestFeature) => void;
  disableFeature: (feature: TestFeature) => void;
  setMode: (mode: TestMode) => void;
  resetFeatures: () => void;
  toggleDebug: () => void;
}

const TestContext = createContext<TestContextValue | undefined>(undefined);

interface TestProviderProps {
  children: React.ReactNode;
  initialMode?: TestMode;
  initialFeatures?: TestFeature[];
  onChange?: (config: TestContextConfig) => void;
  debug?: boolean;
  persistPreferences?: boolean;
}

export function TestProvider({
  children,
  initialMode = TEST_MODES.DEVELOPMENT,
  initialFeatures = [],
  onChange,
  debug = false,
  persistPreferences = true,
}: TestProviderProps) {
  // Validiere initiale Werte
  const validatedMode = isValidTestMode(initialMode) ? initialMode : TEST_MODES.DEVELOPMENT;
  const validatedFeatures = initialFeatures.filter(isValidTestFeature);

  const [mode, setMode] = useState<TestMode>(validatedMode);
  const [features, setFeatures] = useState<TestFeature[]>(validatedFeatures);
  const [isDebug, setIsDebug] = useState(debug);

  // Lade gespeicherte Einstellungen beim Start
  useEffect(() => {
    if (persistPreferences) {
      const savedPreferences = loadTestPreferences();
      if (savedPreferences) {
        if (isValidTestMode(savedPreferences.mode)) {
          setMode(savedPreferences.mode);
        }
        const validFeatures = savedPreferences.features.filter(isValidTestFeature);
        setFeatures(validFeatures);
      }
    }
  }, [persistPreferences]);

  // Speichere Änderungen
  useEffect(() => {
    if (persistPreferences) {
      saveTestPreferences({ mode, features });
    }
    onChange?.({ mode, features, debug: isDebug });
  }, [mode, features, isDebug, persistPreferences, onChange]);

  // Debug-Logging
  useEffect(() => {
    if (isDebug) {
      console.group("Test Context Update");
      console.log("Mode:", mode);
      console.log("Features:", features);
      console.log("Valid Features:", features.filter(isValidTestFeature));
      console.groupEnd();
    }
  }, [mode, features, isDebug]);

  const isFeatureEnabled = useCallback((feature: TestFeature) => {
    return isValidTestFeature(feature) && features.includes(feature);
  }, [features]);

  const enableFeature = useCallback((feature: TestFeature) => {
    if (!isValidTestFeature(feature) || !canEnableFeature(feature, mode)) return;
    setFeatures(current => enableFeatureWithDependencies(feature, current));
  }, [mode]);

  const disableFeature = useCallback((feature: TestFeature) => {
    if (!isValidTestFeature(feature) || !canDeactivateFeature(feature, features)) return;
    setFeatures(current => disableFeatureWithDependents(feature, current));
  }, [features]);

  const toggleFeature = useCallback((feature: TestFeature) => {
    if (!isValidTestFeature(feature)) return;
    
    if (isFeatureEnabled(feature)) {
      disableFeature(feature);
    } else if (canActivateFeature(feature, features)) {
      enableFeature(feature);
    }
  }, [features, isFeatureEnabled, enableFeature, disableFeature]);

  const resetFeatures = useCallback(() => {
    setFeatures([]);
  }, []);

  const toggleDebug = useCallback(() => {
    setIsDebug(prev => !prev);
  }, []);

  const updateMode = useCallback((newMode: TestMode) => {
    if (!isValidTestMode(newMode)) return;
    
    setMode(newMode);
    // Entferne Features, die im neuen Modus nicht verfügbar sind
    setFeatures(current =>
      current.filter(feature => 
        isValidTestFeature(feature) && canEnableFeature(feature, newMode)
      )
    );
  }, []);

  const value = {
    mode,
    features,
    debug: isDebug,
    isFeatureEnabled,
    toggleFeature,
    enableFeature,
    disableFeature,
    setMode: updateMode,
    resetFeatures,
    toggleDebug,
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}

export function withTest<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & TestProviderProps> {
  return function WithTestComponent({ 
    initialMode,
    initialFeatures,
    debug,
    persistPreferences,
    onChange,
    ...props 
  }: P & TestProviderProps) {
    return (
      <TestProvider
        initialMode={initialMode}
        initialFeatures={initialFeatures}
        debug={debug}
        persistPreferences={persistPreferences}
        onChange={onChange}
      >
        <Component {...props as P} />
      </TestProvider>
    );
  };
}

export const createTestContext = (config?: Partial<TestContextConfig>) => ({
  ...createDefaultTestConfig(),
  ...config,
});

export { TestContext };