# Projekt-Dependencies

Eine Übersicht aller Dependencies und ihre Verwendung im Projekt.

## 🛠️ Core Dependencies

### Framework & UI
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| next | 14.0.4 | React Framework | App-Framework, Routing, SSR |
| react | 18.2.0 | UI Library | UI-Komponenten |
| react-dom | 18.2.0 | DOM Rendering | React DOM Integration |
| typescript | 5.1.6 | Type System | Statische Typisierung |
| tailwindcss | 3.3.3 | CSS Framework | Styling |

### UI Components & Design
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| @radix-ui/* | ^1.0.0 | UI Primitives | Basis-UI-Komponenten |
| class-variance-authority | ^0.7.0 | Style Variants | Component Styling |
| clsx | ^2.0.0 | Class Names | CSS Class Management |
| lucide-react | ^0.294.0 | Icons | UI Icons |
| tailwind-merge | ^2.1.0 | Tailwind Utils | CSS Class Merging |

### Authentication & Security
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| @clerk/nextjs | ^4.23.2 | Auth Provider | Authentication |
| @upstash/ratelimit | ^0.4.3 | Rate Limiting | API Protection |
| @upstash/redis | ^1.22.0 | Redis Client | Caching, Sessions |

### Data Management
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| @prisma/client | ^5.1.1 | Database ORM | Datenbank-Zugriff |
| @t3-oss/env-nextjs | ^0.6.0 | Env Management | Umgebungsvariablen |
| zod | ^3.21.4 | Schema Validation | Datenvalidierung |

### Payments
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| stripe | ^12.16.0 | Payment Provider | Zahlungsabwicklung |

## 🔧 Development Dependencies

### Code Quality
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| @typescript-eslint/eslint-plugin | ^6.2.0 | ESLint Plugin | TypeScript Linting |
| @typescript-eslint/parser | ^6.2.0 | ESLint Parser | TypeScript Parsing |
| eslint | 8.45.0 | Linter | Code Linting |
| prettier | ^3.0.0 | Code Formatter | Code Formatting |

### Testing
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| jest | ^29.6.2 | Test Framework | Unit/Integration Tests |
| @testing-library/react | ^14.0.0 | React Testing | Component Tests |
| @types/jest | ^29.5.3 | Jest Types | TypeScript Support |

### Build Tools
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| autoprefixer | 10.4.14 | CSS Tool | CSS Vendor Prefixing |
| postcss | 8.4.27 | CSS Tool | CSS Processing |
| prisma | ^5.1.1 | Database Tool | Schema Management |

### Git Hooks
| Package | Version | Beschreibung | Verwendung |
|---------|---------|--------------|------------|
| husky | ^8.0.3 | Git Hooks | Pre-commit Hooks |
| lint-staged | ^13.2.3 | Lint Tool | Staged Files Linting |
| @commitlint/cli | ^17.7.1 | Commit Linting | Commit Message Validation |

## 📦 Dependency Management

### Update-Strategie

#### Reguläre Updates
- Minor Updates: Wöchentlich
- Major Updates: Nach Evaluation
- Security Updates: Sofort

#### Update-Prozess
1. Development Branch erstellen
2. Dependencies aktualisieren
   ```bash
   npm update
   ```
3. Tests durchführen
4. Staging Deployment
5. Production Release

### Vulnerability Scanning
- NPM Audit bei jedem Build
- Weekly Security Scans
- Dependabot Alerts

## 🔒 Lizenzierung

Alle Dependencies sind MIT, Apache 2.0 oder ähnlich liberal lizenziert.
Details siehe [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

## 📊 Dependency Stats

### Paket-Anzahl
- Production Dependencies: 15
- Development Dependencies: 20
- Peer Dependencies: 3

### Bundle Size Impact
| Package | Size (min+gzip) |
|---------|----------------|
| react | 2.8 kB |
| next | 76.7 kB |
| tailwindcss | 3.9 kB |
| @prisma/client | 41.2 kB |

## 🔄 Version Lock Strategie

### Package Lock
- package-lock.json committed
- Exact versions für kritische Dependencies
- Caret ranges für Dev Dependencies

### Version Constraints
- Node.js >= 18.0.0
- npm >= 9.0.0
- TypeScript >= 5.0.0

## 🚨 Known Issues

### Aktuelle Probleme
1. @radix-ui/react-select@1.2.2
   - Safari Rendering Issue
   - Workaround vorhanden

2. @upstash/redis@1.22.0
   - Memory Leak bei langen Sessions
   - Fix in Arbeit

### Geplante Updates
1. Next.js 14 -> 15
   - Geplant für Q2 2025
   - Breaking Changes dokumentiert

2. Prisma 5 -> 6
   - Geplant für Q3 2025
   - Schema Migration erforderlich

## 📚 Ressourcen

- [Dependency Dashboard](https://nextleveltraders.com/dev/dependencies)
- [Update Logs](https://nextleveltraders.com/dev/updates)
- [Security Advisories](https://nextleveltraders.com/security)