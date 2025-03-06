# Deployment Guide

## 🌍 Übersicht

NextLevelTraders nutzt eine moderne Deployment-Strategie mit:
- Vercel für Frontend und API
- Supabase für die Datenbank
- Upstash für Redis
- GitHub Actions für CI/CD

## 🚀 Deployment-Umgebungen

### Development
- Branch: `develop`
- URL: `dev.nextleveltraders.com`
- Automatisches Deployment bei Push
- Feature-Branch Previews

### Staging
- Branch: `staging`
- URL: `staging.nextleveltraders.com`
- Deployment nach erfolgreichen Tests
- Produktionsnahes Testing

### Production
- Branch: `main`
- URL: `nextleveltraders.com`
- Manuelles Deployment nach Approval
- Zero-Downtime Updates

## ⚙️ Vercel Setup

1. **Projekt verbinden**
   ```bash
   vercel link
   ```

2. **Umgebungsvariablen konfigurieren**
   ```bash
   vercel env pull .env.production
   ```

3. **Domain konfigurieren**
   ```bash
   vercel domains add nextleveltraders.com
   ```

4. **Deployment ausführen**
   ```bash
   vercel deploy --prod
   ```

### Umgebungsvariablen

```bash
# Vercel UI oder CLI
vercel env add NEXT_PUBLIC_API_URL production
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
```

## 📦 Datenbank (Supabase)

1. **Projekt erstellen**
   ```bash
   supabase init
   supabase link --project-ref <project-id>
   ```

2. **Schema migrieren**
   ```bash
   npm run db:migrate
   ```

3. **Produktionsdaten seeden**
   ```bash
   npm run db:seed:prod
   ```

### Backups einrichten

```sql
-- Automatische Backups aktivieren
ALTER DATABASE nextleveltraders SET backup_hour TO 3;
```

## 🔄 Redis (Upstash)

1. **Cluster erstellen**
   ```bash
   upstash redis create --name nextleveltraders-prod
   ```

2. **Connection String konfigurieren**
   ```bash
   upstash redis connection-string nextleveltraders-prod
   ```

## 🔁 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, staging, main]
  pull_request:
    branches: [develop, staging, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          npm ci
          npm run test:ci
          
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: |
          npm ci
          npm run build
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: vercel deploy --prod
```

## 🔍 Monitoring & Logging

### Vercel Analytics
```typescript
// next.config.js
module.exports = {
  analytics: true,
}
```

### Error Tracking (Sentry)
```typescript
// sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🛡️ Security Checklist

- [ ] SSL/TLS aktiviert
- [ ] Rate Limiting konfiguriert
- [ ] CORS Policy gesetzt
- [ ] Security Headers aktiviert
- [ ] Database Backups eingerichtet
- [ ] Monitoring aktiviert
- [ ] Error Tracking eingerichtet

## 📋 Deployment Checkliste

### Pre-Deployment
1. Tests erfolgreich
2. Build erfolgreich
3. ENV Variablen geprüft
4. Datenbank Migrationen vorbereitet
5. Feature Flags gesetzt

### Deployment
1. Datenbank migrieren
2. Code deployen
3. CDN Cache invalidieren
4. DNS Updates prüfen

### Post-Deployment
1. Health Checks durchführen
2. Monitoring prüfen
3. Error Rates beobachten
4. Performance metrics prüfen

## 🔄 Rollback Plan

### Schneller Rollback
```bash
# Zurück zur letzten stabilen Version
vercel rollback
```

### Database Rollback
```bash
# Letzte Migration rückgängig machen
npm run db:rollback
```

## 📊 Performance Monitoring

### Core Web Vitals
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

### Custom Metrics
```typescript
export function reportWebVitals(metric) {
  console.log(metric);
}
```

## 🔧 Wartung

### Geplante Wartung
1. Wartungsmodus aktivieren
2. Updates durchführen
3. System testen
4. Wartungsmodus deaktivieren

### Notfall-Wartung
1. Problem identifizieren
2. Hotfix entwickeln
3. Hotfix deployen
4. System überwachen

## 📱 Mobile App Distribution

### iOS TestFlight
1. Build erstellen
2. TestFlight hochladen
3. Tester einladen

### Android Beta
1. Build erstellen
2. Play Console hochladen
3. Beta-Tester einladen

## 📈 Skalierung

### Horizontale Skalierung
- Vercel Automatic Scaling
- Supabase Connection Pooling
- Redis Cluster Mode

### Vertikale Skalierung
- Supabase Compute Upgrade
- Redis Memory Upgrade
- Storage Erweiterung

## 🆘 Troubleshooting

### Common Issues
1. Build Fehler
2. Migration Fehler
3. Performance Issues
4. Connection Issues

### Support Kontakte
- DevOps Team: devops@nextleveltraders.com
- Security Team: security@nextleveltraders.com
- Infrastructure: infra@nextleveltraders.com