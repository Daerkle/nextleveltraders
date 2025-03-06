# API Dokumentation

## 🚀 API Übersicht

### Base URL
- Development: `http://localhost:3000/api`
- Staging: `https://staging.nextleveltraders.com/api`
- Production: `https://api.nextleveltraders.com`

### API Versioning
```
/api/v1/...  # Aktuelle Version
/api/v2/...  # Beta Version
```

## 🔑 Authentifizierung

```bash
# Bearer Token Authentication
Authorization: Bearer <token>
```

### Token Erhalt
```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

## 📊 Endpoints

### User Management

#### User Registration
```typescript
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}

Response: 201 Created
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-03-04T12:00:00Z"
}
```

#### User Profile
```typescript
GET /api/users/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "plan": "pro",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

### Trading

#### Place Order
```typescript
POST /api/trading/orders
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "symbol": "AAPL",
  "type": "buy",
  "amount": 100,
  "price": 150.50,
  "orderType": "limit"
}

Response: 201 Created
{
  "orderId": "order_123",
  "status": "pending",
  "createdAt": "2025-03-04T12:00:00Z"
}
```

#### Get Orders
```typescript
GET /api/trading/orders
Authorization: Bearer <token>

Query Parameters:
- status: "pending" | "completed" | "cancelled"
- from: ISO date
- to: ISO date
- limit: number
- offset: number

Response: 200 OK
{
  "orders": [
    {
      "id": "order_123",
      "symbol": "AAPL",
      "type": "buy",
      "amount": 100,
      "price": 150.50,
      "status": "completed",
      "createdAt": "2025-03-04T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Market Data

#### Real-time Quotes
```typescript
GET /api/market-data/quotes
Authorization: Bearer <token>

Query Parameters:
- symbols: string[] (comma-separated)
- fields: string[] (comma-separated)

Response: 200 OK
{
  "quotes": {
    "AAPL": {
      "price": 150.50,
      "change": 1.25,
      "volume": 1000000,
      "timestamp": "2025-03-04T12:00:00Z"
    }
  }
}
```

#### Historical Data
```typescript
GET /api/market-data/history
Authorization: Bearer <token>

Query Parameters:
- symbol: string
- interval: "1m" | "5m" | "15m" | "1h" | "1d"
- from: ISO date
- to: ISO date

Response: 200 OK
{
  "symbol": "AAPL",
  "interval": "1h",
  "data": [
    {
      "timestamp": "2025-03-04T12:00:00Z",
      "open": 150.00,
      "high": 151.00,
      "low": 149.50,
      "close": 150.50,
      "volume": 1000000
    }
  ]
}
```

## 🔄 WebSocket API

### Connection
```typescript
const ws = new WebSocket("wss://api.nextleveltraders.com/ws");

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "subscribe",
    channels: ["quotes", "orders"],
    symbols: ["AAPL", "GOOGL"]
  }));
};
```

### Message Types

#### Market Data Updates
```typescript
{
  "type": "quote",
  "symbol": "AAPL",
  "data": {
    "price": 150.50,
    "change": 1.25,
    "volume": 1000000,
    "timestamp": "2025-03-04T12:00:00Z"
  }
}
```

#### Order Updates
```typescript
{
  "type": "order_update",
  "orderId": "order_123",
  "status": "completed",
  "timestamp": "2025-03-04T12:00:00Z"
}
```

## 🔒 Rate Limits

### Limits per Plan

| Plan     | Requests/Min | Burst |
|----------|-------------|-------|
| Free     | 60          | 5     |
| Pro      | 300         | 10    |
| Business | 1000        | 20    |

### Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1583850000
```

## 🚨 Error Handling

### Error Format
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "amount",
      "reason": "must be positive"
    }
  }
}
```

### HTTP Status Codes

| Code | Beschreibung           |
|------|------------------------|
| 200  | Erfolg                |
| 201  | Erstellt              |
| 400  | Ungültige Anfrage     |
| 401  | Nicht authentifiziert |
| 403  | Keine Berechtigung    |
| 404  | Nicht gefunden        |
| 429  | Rate Limit erreicht   |
| 500  | Server Error          |

## 📝 Request/Response Examples

### Curl Examples

```bash
# Login
curl -X POST https://api.nextleveltraders.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Place Order
curl -X POST https://api.nextleveltraders.com/api/trading/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","type":"buy","amount":100}'
```

### TypeScript SDK

```typescript
import { NextLevelTradersAPI } from '@nextleveltraders/sdk';

const api = new NextLevelTradersAPI({
  token: 'your_token',
  environment: 'production'
});

// Place Order
const order = await api.trading.placeOrder({
  symbol: 'AAPL',
  type: 'buy',
  amount: 100
});

// Get Real-time Quotes
const quotes = await api.market.getQuotes(['AAPL', 'GOOGL']);
```

## 🔐 Security

### CORS
```typescript
// Allowed Origins
[
  "https://nextleveltraders.com",
  "https://app.nextleveltraders.com",
  "http://localhost:3000"
]
```

### Security Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
```

## 📚 SDKs & Tools

- [JavaScript/TypeScript SDK](https://github.com/nextleveltraders/js-sdk)
- [Python SDK](https://github.com/nextleveltraders/python-sdk)
- [Postman Collection](https://github.com/nextleveltraders/postman)
- [OpenAPI Spec](https://github.com/nextleveltraders/openapi)

## 📈 Monitoring

### Health Check
```typescript
GET /api/health

Response: 200 OK
{
  "status": "healthy",
  "version": "1.2.0",
  "timestamp": "2025-03-04T12:00:00Z"
}
```

### Metrics
```typescript
GET /api/metrics

Response: 200 OK
{
  "uptime": 1234567,
  "requests": {
    "total": 1000000,
    "success": 999000,
    "error": 1000
  },
  "latency": {
    "p50": 100,
    "p95": 200,
    "p99": 500
  }
}