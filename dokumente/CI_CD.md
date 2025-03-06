# CI/CD Pipeline

## 🔄 Pipeline-Übersicht

```mermaid
graph LR
    Code[Code] --> Lint[Lint & Format]
    Lint --> Test[Test]
    Test --> Build[Build]
    Build --> Deploy[Deploy]
    Deploy --> Monitor[Monitor]
```

## 🛠️ GitHub Actions

### 1. Main Pipeline

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Check types
        run: npm run typecheck
        
      - name: Lint
        run: npm run lint
        
      - name: Format check
        run: npm run format:check

  test:
    needs: validate
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
          
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload build
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next
          
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prebuilt'

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod --prebuilt'
```

## 🧪 Test Automation

### 1. Unit Tests

```yaml
# .github/workflows/test.yml
name: Tests
on: [pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 2. E2E Tests

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on:
  deployment_status:
    states: [success]

jobs:
  e2e:
    if: github.event.deployment_status.environment == 'Preview'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}
```

## 📦 Build Process

### 1. Docker Build

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Build Cache

```yaml
# Vercel Build Cache
build:
  cache:
    - type: npm
      path: .npm
      
    - type: build
      path: .next/cache
```

## 🚀 Deployment

### 1. Deployment Stages

```mermaid
graph TD
    PR[Pull Request] --> Preview[Preview Deployment]
    Preview --> QA[QA Testing]
    QA --> Staging[Staging Deployment]
    Staging --> Production[Production Deployment]
```

### 2. Rollback Strategie

```typescript
// Rollback Script
async function rollback(version: string) {
  // 1. Update Database
  await prisma.migration.rollback({ to: version });
  
  // 2. Deploy Previous Version
  await vercel.deploy({
    version,
    force: true,
  });
  
  // 3. Verify Health
  await checkHealth();
}
```

## 📊 Monitoring

### 1. Health Checks

```typescript
// Health Check Endpoint
export async function GET(req: Request) {
  const health = {
    status: 'healthy',
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    dependencies: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      external: await checkExternalServices(),
    },
  };

  return Response.json(health);
}
```

### 2. Performance Monitoring

```yaml
# Lighthouse CI Config
ci:
  collect:
    numberOfRuns: 3
    startServerCommand: npm run start
    url:
      - http://localhost:3000/
      - http://localhost:3000/dashboard
  assert:
    preset: lighthouse:recommended
    assertions:
      'first-contentful-paint': ['error', { minScore: 0.9 }]
      'interactive': ['error', { minScore: 0.9 }]
```

## 🔒 Security

### 1. Security Scans

```yaml
# Security Workflow
name: Security
on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Run OWASP ZAP Scan
        uses: zaproxy/action-full-scan@v0.4.0
        with:
          target: 'https://staging.nextleveltraders.com'
          
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 2. Dependency Updates

```yaml
# Dependabot Config
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

## 📈 Metriken

### 1. Pipeline Metriken

```typescript
// Pipeline Analytics
const metrics = {
  buildTime: 0,
  testCoverage: 0,
  deploymentSuccess: true,
  
  async track() {
    await analytics.track('Pipeline Run', {
      buildTime: this.buildTime,
      testCoverage: this.testCoverage,
      deploymentSuccess: this.deploymentSuccess,
      timestamp: new Date().toISOString(),
    });
  },
};
```

### 2. Success Rate

```typescript
// Success Rate Monitoring
const pipeline = {
  async calculateSuccessRate(days: number = 7) {
    const runs = await getPipelineRuns(days);
    
    return {
      total: runs.length,
      success: runs.filter(r => r.status === 'success').length,
      failure: runs.filter(r => r.status === 'failure').length,
      rate: runs.filter(r => r.status === 'success').length / runs.length,
    };
  },
};