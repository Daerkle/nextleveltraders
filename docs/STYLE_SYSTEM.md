# NextLevelTraders Style System

## Übersicht

Das Style-System basiert auf Tailwind CSS mit benutzerdefinierten Themes und CSS-Variablen für konsistentes Design.

## Theme System

### Verfügbare Themes
- Light Mode (Standard)
- Dark Mode
- System Mode (folgt den Systemeinstellungen)

### Theme Konfiguration
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

## CSS-Variablen

### Farben
```css
--background: Hintergrundfarbe
--foreground: Textfarbe
--card: Kartenfarbe
--card-foreground: Kartentext
--popover: Popover-Hintergrund
--popover-foreground: Popover-Text
--primary: Primärfarbe
--primary-foreground: Primärtext
--secondary: Sekundärfarbe
--secondary-foreground: Sekundärtext
--muted: Gedämpfte Farbe
--muted-foreground: Gedämpfter Text
--accent: Akzentfarbe
--accent-foreground: Akzenttext
--destructive: Warnfarbe
--destructive-foreground: Warntext
--border: Rahmenfarbe
--input: Eingabefeld-Farbe
--ring: Focus-Ring-Farbe
```

### Chart Farben
```css
--chart-1: Erste Chart-Farbe (220 80% 50%)
--chart-2: Zweite Chart-Farbe (200 80% 50%)
--chart-3: Dritte Chart-Farbe (180 80% 50%)
--chart-4: Vierte Chart-Farbe (160 80% 50%)
--chart-5: Fünfte Chart-Farbe (140 80% 50%)
```

### Abstände & Radien
```css
--radius: Grundlegender Border-Radius (0.625rem)
```

## Verwendung

### CSS-Variablen in Tailwind
```tsx
// In Komponenten
className="bg-background text-foreground"
className="border-border"
className="ring-ring"
```

### Dark Mode
Der Dark Mode wird automatisch durch das Theme-System verwaltet. Komponenten erben die Farben basierend auf dem aktiven Theme.

### Responsive Design
Alle Komponenten sind standardmäßig responsive durch Tailwind-Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1400px

## Best Practices

1. Konsistente Verwendung von CSS-Variablen
   ```tsx
   // Gut
   className="bg-background"
   
   // Vermeiden
   className="bg-white dark:bg-black"
   ```

2. Komponenten-Styling
   - Verwende die vordefinierten Farben und Variablen
   - Nutze Tailwind-Utilities für Layout und Spacing
   - Vermeide inline styles

3. Theme-Kompatibilität
   - Teste Komponenten in beiden Themes
   - Verwende die *-foreground Varianten für Text auf farbigen Hintergründen

## UI-Komponenten

### Buttons
```tsx
<Button variant="default">Default Button</Button>
<Button variant="destructive">Destructive Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>Inhalt</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Alerts
```tsx
<Alert>
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    Diese Nachricht enthält wichtige Informationen.
  </AlertDescription>
</Alert>
```

## Animation System

Das Projekt verwendet `tailwindcss-animate` für konsistente Animationen:

```tsx
// Verfügbare Animationen
className="animate-accordion-down"  // Accordion öffnen
className="animate-accordion-up"    // Accordion schließen
className="animate-collapsible-down" // Collapsible öffnen
className="animate-collapsible-up"   // Collapsible schließen
```

## Entwickler-Workflow

1. Neue Komponenten
   - Erstelle die Komponente im components/ui Verzeichnis
   - Verwende CSS-Variablen für Theming
   - Dokumentiere die Komponente in diesem Style Guide

2. Theme-Änderungen
   - Aktualisiere globals.css für neue CSS-Variablen
   - Teste in beiden Themes
   - Aktualisiere die Dokumentation

3. Code Reviews
   - Prüfe auf konsistente Verwendung von CSS-Variablen
   - Stelle sicher, dass Komponenten in beiden Themes funktionieren
   - Validiere responsive Designs