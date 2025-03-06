# Code Style Guide

## 📚 Inhaltsverzeichnis

1. [Allgemeine Prinzipien](#allgemeine-prinzipien)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React Best Practices](#react-best-practices)
4. [CSS/Tailwind Standards](#css-tailwind-standards)
5. [Testing Conventions](#testing-conventions)
6. [Dokumentation](#dokumentation)

## 🎯 Allgemeine Prinzipien

### Namenskonventionen

```typescript
// ✅ Gut
const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

// ❌ Schlecht
const calc = (i: any[]): number => {
  return i.reduce((t, item) => t + item.p, 0);
};
```

### Dateistruktur
```
components/
├── feature/              # Feature-spezifische Komponenten
│   └── trading/
│       ├── TradingChart.tsx
│       └── OrderForm.tsx
├── layout/              # Layout Komponenten
│   ├── Sidebar.tsx
│   └── Header.tsx
└── ui/                  # Wiederverwendbare UI Komponenten
    ├── Button.tsx
    └── Card.tsx
```

### Import-Sortierung
```typescript
// 1. React/Next.js Imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. External Libraries
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// 3. Internal Modules
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

// 4. Types/Interfaces
import type { User } from '@/types';

// 5. Assets/Styles
import '@/styles/component.css';
```

## 💻 TypeScript Guidelines

### Type Definitions

```typescript
// ✅ Gut
interface User {
  id: string;
  email: string;
  preferences?: UserPreferences;
}

type UserPreferences = {
  theme: 'light' | 'dark';
  notifications: boolean;
};

// ❌ Schlecht
type UserType = {
  id: any;
  email: any;
  prefs?: any;
};
```

### Generics

```typescript
// ✅ Gut
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}

// ❌ Schlecht
function fetchData(url: string): Promise<any> {
  return fetch(url).then(res => res.json());
}
```

### Error Handling

```typescript
// ✅ Gut
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Verwendung
try {
  await api.getData();
} catch (error) {
  if (error instanceof ApiError) {
    handleApiError(error);
  } else {
    handleGenericError(error);
  }
}
```

## ⚛️ React Best Practices

### Komponenten-Struktur

```typescript
// ✅ Gut
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  children 
}: ButtonProps) {
  return (
    <button className={cn(styles[variant], styles[size])}>
      {children}
    </button>
  );
}

// ❌ Schlecht
export default function Button(props: any) {
  return <button {...props} />;
}
```

### Hooks

```typescript
// ✅ Gut
function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ❌ Schlecht
function useData() {
  const [data, setData] = useState<any>(null);
  // ...
}
```

## 🎨 CSS/Tailwind Standards

### Klassen-Organisation

```tsx
// ✅ Gut
<div
  className={cn(
    // Layout
    "flex flex-col gap-4",
    // Spacing
    "p-4 my-2",
    // Typography
    "text-sm font-medium",
    // Colors
    "bg-white dark:bg-gray-800",
    // States
    "hover:bg-gray-50 dark:hover:bg-gray-700",
    // Variants
    variant === "outline" && "border border-gray-200"
  )}
>
```

### Custom Utilities

```typescript
// ✅ Gut
const buttonVariants = cva(
  "rounded-md font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

## 🧪 Testing Conventions

### Test-Struktur

```typescript
describe('Component: Button', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button onClick={onPress}>Click me</Button>
    );
    
    await userEvent.click(getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Mock-Konventionen

```typescript
// ✅ Gut
jest.mock('@/lib/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({
    id: '1',
    name: 'Test User',
  }),
}));

// ❌ Schlecht
const mockFn = jest.fn(() => ({ data: {} }));
```

## 📝 Dokumentation

### JSDoc Comments

```typescript
/**
 * Berechnet den Gesamtpreis aller Items im Warenkorb.
 * 
 * @param items - Array von Warenkorb-Items
 * @param discountCode - Optionaler Rabattcode
 * @returns Gesamtpreis nach Rabatt
 * @throws {ValidationError} Wenn ungültige Items übergeben werden
 * 
 * @example
 * ```ts
 * const total = calculateTotal(items, "SAVE20");
 * ```
 */
function calculateTotal(
  items: CartItem[], 
  discountCode?: string
): number {
  // Implementation
}
```

### Component Documentation

```typescript
interface DataTableProps<TData> {
  /** Die anzuzeigenden Daten */
  data: TData[];
  /** Spalten-Konfiguration */
  columns: Column<TData>[];
  /** Callback für Zeilen-Selektion */
  onRowSelect?: (row: TData) => void;
}

/**
 * DataTable Komponente für tabellarische Datenansicht.
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={users}
 *   columns={userColumns}
 *   onRowSelect={handleSelect}
 * />
 * ```
 */
export function DataTable<TData>({ 
  data,
  columns,
  onRowSelect,
}: DataTableProps<TData>) {
  // Implementation
}
```

## 🔍 Code Reviews

### Review Checkliste

1. **Funktionalität**
   - [ ] Feature Requirements erfüllt
   - [ ] Edge Cases behandelt
   - [ ] Error Handling implementiert

2. **Code Qualität**
   - [ ] TypeScript Types vollständig
   - [ ] Keine any Types
   - [ ] Einheitliche Formatierung
   - [ ] Keine Code-Duplikation

3. **Performance**
   - [ ] Unnötige Re-Renders vermieden
   - [ ] Speicher-Management optimiert
   - [ ] Bundle-Size berücksichtigt

4. **Testing**
   - [ ] Unit Tests vorhanden
   - [ ] Edge Cases getestet
   - [ ] Integration Tests (wenn nötig)

### PR Template

```markdown
## Beschreibung
[Feature/Fix beschreiben]

## Änderungen
- [Wichtige Änderung 1]
- [Wichtige Änderung 2]

## Tests
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] Manual Tests

## Screenshots
[Falls relevant]
```

## 🚀 Deployment

### Pre-Deployment Checklist

1. **Code Qualität**
   - [ ] Linting Errors behoben
   - [ ] Type Checks bestanden
   - [ ] Tests erfolgreich

2. **Performance**
   - [ ] Bundle Size optimiert
   - [ ] Lighthouse Score geprüft
   - [ ] Core Web Vitals getestet

3. **Security**
   - [ ] Dependencies geprüft
   - [ ] Security Scans durchgeführt
   - [ ] ENV Vars validiert