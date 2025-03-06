# Contributing Guide

## 👋 Willkommen

Danke für dein Interesse an NextLevelTraders! Diese Dokumentation hilft dir dabei, effektiv zum Projekt beizutragen.

## 🎯 Code of Conduct

Wir erwarten von allen Beteiligten:
- Respektvoller Umgang
- Konstruktives Feedback
- Professionelle Kommunikation
- Offenheit für neue Ideen

## 🚀 Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/nextleveltraders.git
   cd nextleveltraders
   ```

2. **Branch erstellen**
   ```bash
   git checkout -b feature/your-feature
   # oder
   git checkout -b fix/your-bugfix
   ```

3. **Dependencies installieren**
   ```bash
   npm install
   ```

4. **Development Server starten**
   ```bash
   npm run dev
   ```

## 📝 Coding Guidelines

### TypeScript
```typescript
// ✅ Gut
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Vermeiden
type User = {
  id: any;
  name: any;
  email: any;
}
```

### React Components
```typescript
// ✅ Gut
export function UserCard({ user }: { user: User }) {
  return (
    <div className="p-4 rounded-lg">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// ❌ Vermeiden
export default function({ user }) {
  return <div>{user.name}</div>;
}
```

### CSS/Tailwind
```tsx
// ✅ Gut - Komponenten-basierte Styles
const buttonStyles = cva([
  "px-4 py-2 rounded",
  "transition-colors",
  "focus:outline-none focus:ring-2",
]);

// ❌ Vermeiden - Inline Styles
<button style={{ padding: '8px 16px' }}>Click me</button>
```

## 📋 Pull Request Prozess

1. **Branch aktuell halten**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Änderungen committen**
   ```bash
   git add .
   git commit -m "feat(component): add user card"
   ```

3. **Tests ausführen**
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```

4. **Push & PR erstellen**
   ```bash
   git push origin feature/your-feature
   ```

### PR Template

```markdown
## Beschreibung
[Beschreibe deine Änderungen hier]

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance
- [ ] Test

## Screenshots/Videos
[Falls relevant]

## Checkliste
- [ ] Tests geschrieben/angepasst
- [ ] Dokumentation aktualisiert
- [ ] Code formatiert
- [ ] Types geprüft
```

## 🧪 Testing

### Unit Tests
```typescript
describe("UserCard", () => {
  it("renders user information correctly", () => {
    const user = {
      name: "Test User",
      email: "test@example.com",
    };
    
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

## 📚 Dokumentation

### Code Kommentare
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

### README Updates
- Neue Features dokumentieren
- Setup-Anweisungen aktualisieren
- Dependencies dokumentieren
- Breaking Changes markieren

## 🐛 Bug Reports

### Template
```markdown
### Beschreibung
[Beschreibe den Bug]

### Reproduktion
1. Gehe zu '...'
2. Klicke auf '....'
3. Scrolle zu '....'
4. Siehe Error

### Erwartetes Verhalten
[Was sollte passieren?]

### Screenshots
[Falls hilfreich]

### Umgebung
- OS: [z.B. Windows 11]
- Browser: [z.B. Chrome 120]
- Version: [z.B. 1.2.3]
```

## 🎨 Design Guidelines

### Farben
```typescript
// tailwind.config.js
const colors = {
  primary: {
    50: "#f0f9ff",
    500: "#0ea5e9",
    900: "#0c4a6e",
  },
  // ...
};
```

### Typography
```typescript
// Komponenten nutzen
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-base text-gray-600">Text</p>
```

## 🚀 Release Prozess

1. **Version erhöhen**
   ```bash
   npm version patch|minor|major
   ```

2. **Changelog updaten**
   ```markdown
   ## [1.2.0] - 2025-03-04
   ### Added
   - Neue Feature X
   ### Fixed
   - Bug in Komponente Y
   ```

3. **Release erstellen**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

## 🤝 Community

- GitHub Discussions für Fragen
- Issues für Bugs/Features
- Pull Requests für Code
- Wiki für Dokumentation

## 🎉 Anerkennung

Alle Contributor werden in der README.md und im Projekt aufgeführt:

```markdown
## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
```

## 📜 Lizenz

Durch das Beitragen zum Projekt stimmst du zu, dass deine Beiträge unter der MIT-Lizenz veröffentlicht werden.