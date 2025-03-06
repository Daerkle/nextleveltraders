# Contributing to NextLevelTraders

## 🎯 Inhaltsverzeichnis

- [Code of Conduct](#code-of-conduct)
- [Erste Schritte](#erste-schritte)
- [Development Setup](#development-setup)
- [Branching Strategie](#branching-strategie)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Prozess](#pull-request-prozess)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📚 Code of Conduct

Dieses Projekt und alle Beteiligten unterliegen unserem [Code of Conduct](CODE_OF_CONDUCT.md). 
Bitte lies dir diesen durch, bevor du mit der Mitarbeit beginnst.

## 🚀 Erste Schritte

1. **Fork das Repository**
   ```bash
   # Clone deinen Fork
   git clone https://github.com/yourusername/nextleveltraders.git
   cd nextleveltraders
   
   # Upstream hinzufügen
   git remote add upstream https://github.com/nextleveltraders/nextleveltraders.git
   ```

2. **Branch erstellen**
   ```bash
   # Halte deinen main Branch aktuell
   git checkout main
   git pull upstream main
   
   # Erstelle einen Feature Branch
   git checkout -b feature/awesome-feature
   ```

## ⚙️ Development Setup

1. **Dependencies installieren**
   ```bash
   npm install
   ```

2. **Umgebungsvariablen einrichten**
   ```bash
   cp .env.example .env.local
   # Fülle die erforderlichen Werte aus
   ```

3. **Development Server starten**
   ```bash
   npm run dev
   ```

## 🌳 Branching Strategie

- `main` - Produktionscode
- `develop` - Entwicklungsbranch
- `feature/*` - Neue Features
- `fix/*` - Bugfixes
- `docs/*` - Dokumentationsänderungen
- `refactor/*` - Code-Refactoring
- `test/*` - Test-Implementierungen

## 💬 Commit Guidelines

Wir nutzen [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` Neue Features
- `fix:` Bugfixes
- `docs:` Dokumentation
- `style:` Formatierung
- `refactor:` Code-Refactoring
- `test:` Tests
- `chore:` Maintenance

**Beispiele:**
```bash
feat(auth): add Google OAuth support
fix(api): handle rate limit errors properly
docs(readme): update installation steps
```

## 🔄 Pull Request Prozess

1. **Update deinen Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Tests ausführen**
   ```bash
   npm run test
   npm run lint
   ```

3. **PR erstellen**
   - Nutze das PR Template
   - Verlinke relevante Issues
   - Füge Screenshots/Videos hinzu
   - Beschreibe Änderungen detailliert

4. **Review Prozess**
   - Mindestens 2 Approvals erforderlich
   - Alle Checks müssen bestanden sein
   - Feedback einarbeiten

## 📝 Code Standards

### TypeScript
```typescript
// ✅ Gut
interface User {
  id: string;
  name: string;
}

function greetUser(user: User): string {
  return `Hello ${user.name}!`;
}

// ❌ Vermeiden
function greet(u: any): any {
  return "Hello " + u.name;
}
```

### React Components
```tsx
// ✅ Gut
export function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-lg p-4">
      <h3>{user.name}</h3>
    </div>
  );
}

// ❌ Vermeiden
export default function({ data }: any) {
  return <div>{data.name}</div>;
}
```

### CSS/Tailwind
```tsx
// ✅ Gut
const buttonStyles = cva([
  "px-4 py-2 rounded",
  "transition-colors",
]);

// ❌ Vermeiden
<button style={{padding: '8px 16px'}}>
```

## 🧪 Testing

### Unit Tests
```typescript
describe("UserCard", () => {
  it("renders user information", () => {
    const user = { name: "Test User" };
    render(<UserCard user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });
});
```

### Integration Tests
```typescript
describe("Auth Flow", () => {
  it("allows users to login", async () => {
    const { user } = renderWithAuth(<LoginForm />);
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /login/i }));
  });
});
```

## 📖 Documentation

- Code-Kommentare in JSDoc Format
- README.md für jedes Modul
- API Dokumentation mit OpenAPI/Swagger
- Storybook für UI Komponenten

### JSDoc Beispiel
```typescript
/**
 * Formatiert einen Betrag in EUR
 * @param amount - Der zu formatierende Betrag
 * @returns Formatierter String (z.B. "42,00 €")
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
```

## 👥 Community

- [Discord Server](https://discord.gg/nextleveltraders)
- [GitHub Discussions](https://github.com/nextleveltraders/nextleveltraders/discussions)
- [StackOverflow Tag](https://stackoverflow.com/questions/tagged/nextleveltraders)

## 🏆 Contributor Programm

Aktive Contributors können Teil unseres Contributor Programms werden:

- Zugang zu privaten Channels
- Beta-Zugang zu neuen Features
- Einladungen zu Contributor Events
- Erwähnung in der README.md
- Contributor Badge im Discord

## 🎯 Good First Issues

Suche nach Issues mit dem Label `good first issue` für einen einfachen Einstieg:
[Good First Issues](https://github.com/nextleveltraders/nextleveltraders/labels/good%20first%20issue)

## 🤝 Mentoring

Wir bieten ein Mentoring-Programm für neue Contributors:
- Discord Channel `#mentoring`
- Wöchentliche Office Hours
- Code Reviews mit erfahrenen Contributors

## 📋 Checkliste

- [ ] Code of Conduct gelesen
- [ ] Development Setup abgeschlossen
- [ ] Tests geschrieben
- [ ] Dokumentation aktualisiert
- [ ] Changelog Entry erstellt
- [ ] PR Template ausgefüllt

## ❓ Fragen?

- Technical Questions: [StackOverflow](https://stackoverflow.com/questions/tagged/nextleveltraders)
- Community Support: [Discord](https://discord.gg/nextleveltraders)
- Email Support: contribute@nextleveltraders.com