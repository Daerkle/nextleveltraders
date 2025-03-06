# API Dokumentation

## 📚 Übersicht

Die NextLevelTraders API ist eine RESTful API, die über HTTPS zugänglich ist. Alle Daten werden im JSON-Format übertragen.

## 🔑 Authentifizierung

```bash
Authorization: Bearer <token>
```

Tokens können über die Clerk Authentication API bezogen werden.

## 📊 Rate Limiting

| Plan     | Requests/Minute | Burst |
|----------|----------------|-------|
| Free     | 60            | 5     |
| Pro      | 300           | 10    |
| Business | 1000          | 20    |

## 🛠️ Endpoints

### Authentication

#### `POST /api/auth/login`
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

#### `POST /api/auth/register`
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

### Market Data

#### `GET /api/market-data/quotes`
```typescript
interface QuoteRequest {
  symbols: string[];          // z.B. ["AAPL", "GOOGL"]
  fields?: string[];         // Optional: Spezifische Felder
}

interface QuoteResponse {
  [symbol: string]: {
    price: number;
    change: number;
    volume: number;
    timestamp: string;
  };
}
```

#### `GET /api/market-data/history`
```typescript
interface HistoryRequest {
  symbol: string;
  interval: "1m" | "5m" | "15m" | "1h" | "1d";
  from: string;              // ISO 8601
  to: string;               // ISO 8601
}

interface HistoryResponse {
  symbol: string;
  data: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}
```

### Watchlists

#### `GET /api/watchlists`
```typescript
interface WatchlistsResponse {
  watchlists: {
    id: string;
    name: string;
    symbols: string[];
    created_at: string;
  }[];
}
```

#### `POST /api/watchlists`
```typescript
interface CreateWatchlistRequest {
  name: string;
  symbols?: string[];
}

interface CreateWatchlistResponse {
  id: string;
  name: string;
  symbols: string[];
  created_at: string;
}
```

#### `PUT /api/watchlists/{id}`
```typescript
interface UpdateWatchlistRequest {
  name?: string;
  symbols?: string[];
}

interface UpdateWatchlistResponse {
  id: string;
  name: string;
  symbols: string[];
  updated_at: string;
}
```

### Subscriptions

#### `GET /api/subscriptions/plans`
```typescript
interface PlansResponse {
  plans: {
    id: string;
    name: string;
    price: number;
    interval: "month" | "year";
    features: string[];
  }[];
}
```

#### `POST /api/subscriptions/create-checkout`
```typescript
interface CreateCheckoutRequest {
  plan_id: string;
  success_url?: string;
  cancel_url?: string;
}

interface CreateCheckoutResponse {
  checkout_url: string;
  session_id: string;
}
```

## 🔄 Websocket API

### Connection

```typescript
const ws = new WebSocket('wss://api.nextleveltraders.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle data
};
```

### Subscriptions

```typescript
// Subscribe to real-time quotes
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'quotes',
  symbols: ['AAPL', 'GOOGL']
}));

// Subscribe to trade updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'trades',
  account_id: 'user_123'
}));
```

## 🚨 Error Handling

### Status Codes

| Code | Beschreibung           |
|------|------------------------|
| 200  | Erfolg                |
| 400  | Ungültige Anfrage     |
| 401  | Nicht authentifiziert |
| 403  | Keine Berechtigung    |
| 404  | Nicht gefunden        |
| 429  | Rate Limit erreicht   |
| 500  | Server Error          |

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Beispiel-Fehler

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 60,
      "remaining": 0,
      "reset": "2025-03-04T12:00:00Z"
    }
  }
}
```

## 📝 Beispiele

### cURL

```bash
# Quotes abrufen
curl -X GET "https://api.nextleveltraders.com/api/market-data/quotes?symbols=AAPL,GOOGL" \
  -H "Authorization: Bearer your_token"

# Watchlist erstellen
curl -X POST "https://api.nextleveltraders.com/api/watchlists" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"name": "Tech Stocks", "symbols": ["AAPL", "GOOGL", "MSFT"]}'
```

### JavaScript/TypeScript

```typescript
import { NextLevelTradersAPI } from '@nextleveltraders/api';

const api = new NextLevelTradersAPI({
  token: 'your_token'
});

// Quotes abrufen
const quotes = await api.getQuotes(['AAPL', 'GOOGL']);

// Watchlist erstellen
const watchlist = await api.createWatchlist({
  name: 'Tech Stocks',
  symbols: ['AAPL', 'GOOGL', 'MSFT']
});
```

## 🔒 Sicherheit

### Rate Limiting Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1583850000
```

### CORS

Die API unterstützt CORS für alle Origins in der Development-Umgebung und nur für zugelassene Origins in Production.

### API Keys

API Keys sollten sicher verwahrt und niemals im Client-Code exponiert werden. Verwenden Sie Umgebungsvariablen für sensitive Daten.

## 📚 SDKs & Tools

- [JavaScript/TypeScript SDK](https://github.com/nextleveltraders/js-sdk)
- [Python SDK](https://github.com/nextleveltraders/python-sdk)
- [Postman Collection](https://github.com/nextleveltraders/postman)
- [OpenAPI Spec](https://github.com/nextleveltraders/openapi)