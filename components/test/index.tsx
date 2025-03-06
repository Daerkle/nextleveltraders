import type {
  TestMode,
  TestFeature,
  TestPage,
  TestExample,
  TestEnvironment,
  TestContainerOptions,
  TestContextConfig,
} from '@/types/test';

// Base components
export { TestContainer } from './test-container';
export { TestNav, testPages } from './test-nav';
export {
  TestSection,
  TestExample,
  TestGroup,
  TestNote,
  TestMetadata,
} from './test-section';

// Environment info components
export {
  TestEnvironmentInfo,
  TestEnvironmentInfoLoading,
  TestEnvironmentInfoSkeleton,
  TestPageContainer,
} from './environment-info';

// Feature management
export {
  TestFeatureGate,
  WithFeature,
  FeatureToggle,
} from './test-feature-gate';

// Test configuration components
export {
  TestConfig,
  TestConfigModal,
} from './test-config';

export {
  TestConfigButton,
  TestConfigButtonWithFeatures,
  ActiveFeatures,
} from './test-config-button';

// Test context and provider
export {
  TestProvider,
  useTest,
  withTest,
  TestContext,
  createTestContext,
} from './test-context';

// Re-export types
export type {
  TestMode,
  TestFeature,
  TestPage,
  TestExample as TestExampleType,
  TestEnvironment,
  TestContainerOptions,
  TestContextConfig,
};

// Utility re-exports
export {
  isValidTestMode,
  isValidTestFeature,
  canEnableFeature,
  enableFeatureWithDependencies,
  disableFeatureWithDependents,
  canActivateFeature,
  canDeactivateFeature,
  loadTestPreferences,
  saveTestPreferences,
  createDefaultTestConfig,
} from '@/lib/test/utils';

// Constants re-exports
export {
  TEST_MODES,
  TEST_FEATURES,
  TEST_MODE_LABELS,
  TEST_FEATURE_LABELS,
  TEST_FEATURE_DESCRIPTIONS,
  TEST_FEATURE_DEPENDENCIES,
  TEST_MODE_PERMISSIONS,
  TEST_ENV_KEYS,
  TEST_STORAGE_KEYS,
  DEFAULT_TEST_CONFIG,
} from '@/lib/test/constants';

// Utility function for checking test environment
export const isTestEnvironment = () => {
  if (typeof window === "undefined") return false;
  return process.env.NODE_ENV === "development" || 
         process.env.NEXT_PUBLIC_ENABLE_TEST_FEATURES === "true";
};

// Utility function for getting test info
export const getTestInfo = () => ({
  environment: process.env.NODE_ENV,
  testFeaturesEnabled: process.env.NEXT_PUBLIC_ENABLE_TEST_FEATURES === "true",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "development",
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
});