# Configuration Management

## 🔧 Konfigurationsübersicht

```mermaid
graph TD
    ENV[Environment Variables] --> Local[Local Dev]
    ENV --> Staging[Staging]
    ENV --> Production[Production]
    
    Local --> DevConfig[Development Config]
    Staging --> StagingConfig[Staging Config]
    Production --> ProdConfig[Production Config]
    
    DevConfig --> Features[Feature Flags]
    StagingConfig --> Features
    ProdConfig --> Features
```

## 🌍 Environment Variables

### 1. Basis-Konfiguration

```typescript
// env.mjs
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    
    // Redis
    REDIS_URL: z.string().url(),
    
    // Auth
    CLERK_SECRET_KEY: z.string().min(1),
    
    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    
    // API Keys
    MARKET_DATA_API_KEY: z.string().min(1),
  },
  
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  
  runtimeEnv: process.env,
});
```

### 2. Environment Templates

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
CLERK_SECRET_KEY=""
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""

# Payments
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# API Keys
MARKET_DATA_API_KEY=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔐 Secrets Management

### 1. Secrets Rotation

```typescript
const secretsManager = {
  // Automatische Rotation
  async rotateSecrets() {
    const secrets = [
      {
        name: 'DATABASE_PASSWORD',
        provider: 'postgres',
        rotationInterval: '30d'
      },
      {
        name: 'API_KEY',
        provider: 'internal',
        rotationInterval: '90d'
      }
    ];
    
    for (const secret of secrets) {
      if (await shouldRotate(secret)) {
        await rotateSecret(secret);
        await updateServices(secret);
      }
    }
  },
  
  // Secrets Validierung
  async validateSecrets() {
    const validations = [
      validateDatabaseConnection(),
      validateRedisConnection(),
      validateAPIKeys(),
    ];
    
    return Promise.all(validations);
  }
};
```

### 2. Secrets Verschlüsselung

```typescript
const encryption = {
  async encryptSecrets() {
    const config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16
    };
    
    return {
      // Verschlüsselung
      encrypt: async (data: string) => {
        const key = await generateKey();
        const iv = crypto.randomBytes(config.ivLength);
        const cipher = crypto.createCipheriv(
          config.algorithm,
          key,
          iv
        );
        
        return {
          encrypted: cipher.update(data, 'utf8', 'hex'),
          iv: iv.toString('hex'),
          tag: cipher.getAuthTag()
        };
      },
      
      // Entschlüsselung
      decrypt: async (encrypted: string, iv: string, tag: Buffer) => {
        const key = await getKey();
        const decipher = crypto.createDecipheriv(
          config.algorithm,
          key,
          Buffer.from(iv, 'hex')
        );
        
        decipher.setAuthTag(tag);
        return decipher.update(encrypted, 'hex', 'utf8');
      }
    };
  }
};
```

## 🎯 Feature Flags

### 1. Feature Configuration

```typescript
interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  dependencies?: string[];
  environments: string[];
}

const features: FeatureFlag[] = [
  {
    name: 'trading-bot',
    description: 'Automated Trading Bot',
    enabled: true,
    rolloutPercentage: 25,
    environments: ['staging', 'production']
  },
  {
    name: 'advanced-analytics',
    description: 'Enhanced Analytics Dashboard',
    enabled: true,
    dependencies: ['trading-bot'],
    environments: ['production']
  }
];
```

### 2. Feature Management

```typescript
const featureManager = {
  async isEnabled(
    feature: string,
    userId?: string
  ): Promise<boolean> {
    const flag = await getFeatureFlag(feature);
    
    if (!flag.enabled) return false;
    if (!flag.environments.includes(process.env.NODE_ENV)) return false;
    
    // Rollout Check
    if (flag.rolloutPercentage) {
      const userHash = await hashUser(userId);
      return userHash % 100 < flag.rolloutPercentage;
    }
    
    return true;
  },
  
  async updateFeature(
    feature: string,
    config: Partial<FeatureFlag>
  ) {
    await audit.log('feature_update', {
      feature,
      changes: config,
      updatedBy: currentUser.id
    });
    
    await updateFeatureFlag(feature, config);
  }
};
```

## 📊 Configuration Monitoring

### 1. Config Validation

```typescript
const configValidator = {
  async validateConfig() {
    const validations = [
      // Environment Variables
      validateRequiredEnvVars(),
      validateEnvVarTypes(),
      
      // Connections
      validateDatabaseConfig(),
      validateRedisConfig(),
      
      // API Keys
      validateAPIKeys(),
      
      // Feature Flags
      validateFeatureFlags(),
    ];
    
    return Promise.all(validations);
  }
};
```

### 2. Config Monitoring

```typescript
const configMonitoring = {
  async monitorConfig() {
    return {
      // Config Status
      envVars: await checkEnvVars(),
      secrets: await checkSecrets(),
      features: await checkFeatures(),
      
      // Änderungen
      changes: await getConfigChanges(),
      
      // Auditing
      audit: await getConfigAudit()
    };
  }
};
```

## 🔄 Configuration Updates

### 1. Update Process

```typescript
const configUpdater = {
  async updateConfig(changes: ConfigChanges) {
    // 1. Validate Changes
    await validateConfigChanges(changes);
    
    // 2. Create Backup
    await backupCurrentConfig();
    
    // 3. Apply Changes
    await applyConfigChanges(changes);
    
    // 4. Verify
    await verifyConfig();
    
    // 5. Notify
    await notifyConfigChange(changes);
  }
};
```

### 2. Rollback Process

```typescript
const configRollback = {
  async rollback(version: string) {
    // 1. Load Backup
    const backup = await loadConfigBackup(version);
    
    // 2. Validate Backup
    await validateConfig(backup);
    
    // 3. Apply Backup
    await applyConfig(backup);
    
    // 4. Verify
    await verifyConfig();
    
    // 5. Notify
    await notifyConfigRollback(version);
  }
};
```

## 📝 Configuration Documentation

### 1. Config Schema

```typescript
// Configuration Types
type Environment = 'development' | 'staging' | 'production';

interface Config {
  app: {
    name: string;
    version: string;
    environment: Environment;
    debug: boolean;
  };
  
  database: {
    url: string;
    pool: {
      min: number;
      max: number;
    };
    ssl: boolean;
  };
  
  cache: {
    url: string;
    ttl: number;
    prefix: string;
  };
  
  auth: {
    secretKey: string;
    publicKey: string;
    sessionTTL: number;
  };
}
```

### 2. Config Beispiele

```yaml
# Development Config
app:
  environment: development
  debug: true
database:
  pool:
    min: 1
    max: 10
  ssl: false

# Production Config
app:
  environment: production
  debug: false
database:
  pool:
    min: 5
    max: 50
  ssl: true