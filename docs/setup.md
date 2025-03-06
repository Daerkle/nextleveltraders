# Projekt Setup Guide

Dieses Dokument führt Sie durch die vollständige Einrichtung des NextLevelTraders Projekts.

## 🔧 Grundvoraussetzungen

Stellen Sie sicher, dass folgende Software installiert ist:

- Node.js (>= 18.0.0)
- npm (>= 9.0.0)
- PostgreSQL (>= 14)
- Git

## 📥 Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/nextleveltraders.git
   cd nextleveltraders
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   ```bash
   npm run setup
   ```

4. **Datenbank einrichten**
   ```bash
   # PostgreSQL Datenbank erstellen
   createdb nextleveltraders

   # Prisma Migrationen ausführen
   npm run db:migrate

   # (Optional) Testdaten einfügen
   npm run db:seed
   ```

## 🔑 Externe Dienste einrichten

### Clerk (Authentication)
1. Account auf [clerk.dev](https://clerk.dev) erstellen
2. Neue Anwendung erstellen
3. API Keys kopieren und in `.env.local` einfügen

### Stripe (Zahlungen)
1. Account auf [stripe.com](https://stripe.com) erstellen
2. Testmodus aktivieren
3. API Keys kopieren und in `.env.local` einfügen
4. Webhook Endpoint in Stripe konfigurieren

### Upstash (Redis)
1. Account auf [upstash.com](https://upstash.com) erstellen
2. Redis Datenbank erstellen
3. Connection Details in `.env.local` einfügen

## 👨‍💻 Development

### Development Server starten
```bash
npm run dev
```

### Code Qualität
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type Checking
npm run typecheck

# Alle Checks
npm run validate
```

## 🧪 Tests einrichten

1. **Jest Konfiguration prüfen**
   - `jest.config.mjs` und `jest.setup.js` sind bereits konfiguriert
   - Test-Umgebungsvariablen in `.env.test.local` anpassen

2. **Tests ausführen**
   ```bash
   # Einzelner Test-Durchlauf
   npm test

   # Tests im Watch-Mode
   npm run test:watch

   # Coverage Report
   npm run test:coverage
   ```

## 🔍 VSCode Einrichtung

1. **Empfohlene Extensions installieren**
   - Öffnen Sie VSCode
   - Gehen Sie zur Extensions-Ansicht
   - Suchen Sie nach "@recommended"
   - Installieren Sie alle empfohlenen Extensions

2. **Workspace Settings**
   - `.vscode/settings.json` enthält projektspezifische Einstellungen
   - Formatting on Save ist standardmäßig aktiviert
   - TypeScript und ESLint sind konfiguriert

## 🐛 Debugging

1. **Launch Configurations**
   - Verschiedene Debug-Konfigurationen in `.vscode/launch.json`
   - Server-Side Debugging
   - Client-Side Debugging
   - Full-Stack Debugging
   - Jest Test Debugging

2. **Debug Modi starten**
   - F5 drücken oder Debug-Panel öffnen
   - Gewünschte Konfiguration auswählen
   - Breakpoints setzen und los debuggen

## 📋 Checkliste

- [ ] Repository geklont
- [ ] Dependencies installiert
- [ ] Umgebungsvariablen konfiguriert
- [ ] Datenbank eingerichtet
- [ ] Externe Dienste konfiguriert
- [ ] VSCode Extensions installiert
- [ ] Git Hooks aktiviert
- [ ] Erster Test-Build erfolgreich
- [ ] Lokale Entwicklungsumgebung läuft

## 🆘 Troubleshooting

### Häufige Probleme

1. **Dependencies Fehler**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

2. **Datenbank Fehler**
   ```bash
   npm run db:reset
   npm run db:migrate
   ```

3. **TypeScript Fehler**
   ```bash
   rm -rf .next
   npm run build
   ```

### Support

Bei weiteren Problemen:
- Issues auf GitHub erstellen
- Team-Channel auf Slack nutzen
- Development Team kontaktieren