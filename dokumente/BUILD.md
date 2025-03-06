# Build & Deployment Guide

## 🚀 Quick Start

```bash
# Installation
npm install

# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm start
```

## 📋 Voraussetzungen

### System Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Redis (für Caching & Rate Limiting)
- Git

### Empfohlene Tools
- VS Code mit empfohlenen Extensions
- Docker für lokale Services
- ngrok für Webhook Testing

## 🛠️ Development Setup

### 1. Repository klonen
```bash
git clone https://github.com/nextleveltraders/nextleveltraders.git
cd nextleveltraders
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Environment Setup
```bash
# Environment Variablen einrichten
npm run setup

# Datenbank starten (mit Docker)
docker-compose up -d db redis

# Datenbank migrieren
npm run db:migrate
```

### 4. Development Server
```bash
npm run dev
# Server läuft auf http://localhost:3000
```

## 🏗️ Build-Prozess

### Development Build
```bash
# TypeScript Build
npm run build

# Mit Type Checking
npm run build:check

# Mit zusätzlichen Validierungen
npm run validate
```

### Production Build
```bash
# Optimierter Production Build
NODE_ENV=production npm run build

# Mit Source Maps
GENERATE_SOURCEMAP=true npm run build

# Mit Bundle Analyzer
ANALYZE=true npm run build
```

## 🧪 Tests ausführen

### Unit Tests
```bash
# Alle Tests
npm test

# Mit Coverage
npm run test:coverage

# Einzelne Test Suite
npm test -- auth.test.ts
```

### E2E Tests
```bash
# E2E Tests starten
npm run test:e2e

# Mit UI
npm run test:e2e:ui
```

## 📦 Build Artifacts

### Output Struktur
```
.next/
├── cache/           # Build Cache
├── server/          # Server Code
├── static/          # Static Assets
└── standalone/      # Standalone Build
```

### Asset Optimierung
- Image Optimization
- JS/CSS Minification
- Tree Shaking
- Code Splitting

## 🚀 Deployment

### Vercel Deployment
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel

# Production Deployment
vercel --prod
```

### Docker Deployment
```bash
# Docker Image bauen
docker build -t nextleveltraders .

# Container starten
docker run -p 3000:3000 nextleveltraders
```

### Manual Deployment
```bash
# Build
npm run build

# Dependencies installieren
npm ci --production

# Server starten
npm start
```

## 🔍 Monitoring & Logging

### Build Monitoring
```bash
# Build Stats
npm run build:stats

# Bundle Analyze
npm run analyze
```

### Runtime Monitoring
- New Relic Integration
- Sentry Error Tracking
- Custom Metrics

## 🚨 Troubleshooting

### Common Build Issues

1. **Memory Issues**
   ```bash
   # Increase Node memory
   NODE_OPTIONS="--max_old_space_size=4096" npm run build
   ```

2. **Cache Issues**
   ```bash
   # Clear cache
   npm run clean
   rm -rf .next
   ```

3. **TypeScript Errors**
   ```bash
   # Type check
   npm run typecheck
   
   # Clear TypeScript cache
   rm -rf .tsbuildinfo
   ```

### Performance Issues

1. **Bundle Size**
   ```bash
   # Analyze bundle
   npm run analyze
   ```

2. **Build Zeit**
   ```bash
   # Mit Timing
   TIMING=1 npm run build
   ```

## 📊 Build Matrix

### Supported Platforms

| OS      | Node 18 | Node 20 |
|---------|---------|---------|
| Linux   | ✅      | ✅      |
| macOS   | ✅      | ✅      |
| Windows | ✅      | ✅      |

### Build Modes

| Mode       | Command        | Use Case        |
|------------|---------------|-----------------|
| Dev        | `npm run dev` | Development     |
| Prod       | `npm run build` | Production    |
| Static     | `npm run export` | Static Sites |
| Standalone | `npm run standalone` | Edge     |

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Build & Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm test
```

### Release Process
1. Version bump
2. Changelog update
3. Build & test
4. Deploy
5. Monitoring

## 📚 Build Documentation

### Build Konfiguration
- next.config.js
- tsconfig.json
- postcss.config.js
- tailwind.config.js

### Environment Variablen
```bash
# Required
DATABASE_URL=
REDIS_URL=
NEXT_PUBLIC_API_URL=

# Optional
ANALYZE=
TIMING=
DEBUG=
```

## 🆘 Support

Bei Build-Problemen:
- Discord: #build-support
- GitHub Issues
- Documentation: docs.nextleveltraders.com/build

---

_Letzte Aktualisierung: März 2025_