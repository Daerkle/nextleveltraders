"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TestMode, TestFeature, TEST_MODES } from "./index";

interface TestContextValue {
  mode: TestMode;
  features: TestFeature[];
  isFeatureEnabled: (feature: TestFeature) => boolean;
  toggleFeature: (feature: TestFeature) => void;
  setMode: (mode: TestMode) => void;
  debug: boolean;
  toggleDebug: () => void;
}

const TestContext = createContext<TestContextValue | undefined>(undefined);

interface TestProviderProps {
  children: React.ReactNode;
  initialMode?: TestMode;
  initialFeatures?: TestFeature[];
  debug?: boolean;
}

export function TestProvider({
  children,
  initialMode = TEST_MODES.DEVELOPMENT,
  initialFeatures = [],
  debug = false,
}: TestProviderProps) {
  const [mode, setMode] = useState<TestMode>(initialMode);
  const [features, setFeatures] = useState<TestFeature[]>(initialFeatures);
  const [isDebug, setIsDebug] = useState(debug);

  const isFeatureEnabled = (feature: TestFeature) => features.includes(feature);

  const toggleFeature = (feature: TestFeature) => {
    setFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleDebug = () => setIsDebug(prev => !prev);

  // Log state changes in debug mode
  useEffect(() => {
    if (isDebug) {
      console.group("Test Context Update");
      console.log("Mode:", mode);
      console.log("Features:", features);
      console.groupEnd();
    }
  }, [mode, features, isDebug]);

  return (
    <TestContext.Provider
      value={{
        mode,
        features,
        isFeatureEnabled,
        toggleFeature,
        setMode,
        debug: isDebug,
        toggleDebug,
      }}
    >
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
    ...props 
  }: P & TestProviderProps) {
    return (
      <TestProvider
        initialMode={initialMode}
        initialFeatures={initialFeatures}
        debug={debug}
      >
        <Component {...props as P} />
      </TestProvider>
    );
  };
}

export function createTestContext(options?: {
  mode?: TestMode;
  features?: TestFeature[];
  debug?: boolean;
}) {
  return {
    mode: options?.mode || TEST_MODES.DEVELOPMENT,
    features: options?.features || [],
    debug: options?.debug || false,
  };
}

export { TestContext };