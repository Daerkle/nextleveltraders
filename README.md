# NextLevelTraders

Eine moderne Trading-Plattform mit fortgeschrittenen Analyse- und Lernfunktionen.

## 🚀 Quick Start

```bash
# Repository klonen
git clone https://github.com/yourusername/nextleveltraders.git
cd nextleveltraders

# Dependencies installieren
npm install

# Umgebungsvariablen einrichten
npm run setup

# Development Server starten
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## 🛠️ Technologie-Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Testing:** [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)

## 📁 Projektstruktur

```
nextleveltraders/
├── app/                # Next.js App Router
├── components/         # React Komponenten
├── config/            # Konfigurationsdateien
├── hooks/             # Custom React Hooks
├── lib/               # Utility Funktionen
├── prisma/            # Datenbank Schema
├── public/            # Statische Dateien
├── scripts/           # Build & Setup Scripts
├── styles/            # Globale Styles
└── types/             # TypeScript Typdefinitionen
```

## 🔧 Development

### Voraussetzungen

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14

### Verfügbare Scripts

```bash
# Development
npm run dev           # Startet den Development Server
npm run build        # Erstellt den Production Build
npm run start        # Startet den Production Server

# Testing
npm run test         # Führt Tests aus
npm run test:watch   # Führt Tests im Watch-Mode aus
npm run test:ci      # Führt Tests für CI aus

# Code Quality
npm run lint         # Führt ESLint aus
npm run format       # Formatiert Code mit Prettier
npm run typecheck    # Prüft TypeScript Typen
npm run validate     # Führt alle Checks aus

# Datenbank
npm run db:migrate   # Führt Datenbankmigrationen aus
npm run db:seed      # Füllt die Datenbank mit Testdaten
```

### Environment Variablen

Kopieren Sie `.env.local.example` nach `.env.local` und füllen Sie die benötigten Werte aus:

```bash
npm run setup
```

## 🧪 Testing

Wir verwenden Jest für Unit- und Integrationstests. Die Tests befinden sich neben den Komponenten mit der Endung `.test.ts(x)`.

```bash
# Alle Tests ausführen
npm run test

# Tests im Watch-Mode
npm run test:watch

# Test Coverage Report erstellen
npm run test:coverage
```

## 📚 Dokumentation

- [Projekt Setup](docs/setup.md)
- [Architektur](docs/architecture.md)
- [API Referenz](docs/api.md)
- [Deployment](docs/deployment.md)
- [Contribution Guide](docs/contributing.md)

## 🔒 Security

Sicherheitslücken bitte vertraulich an security@nextleveltraders.com melden.

## 📄 Lizenz

[MIT](LICENSE.md) © NextLevelTraders
