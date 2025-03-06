# Datenbank-Dokumentation

## 📊 Schema-Übersicht

### User Management
```prisma
// Schema für Benutzer und Authentifizierung
model User {
  id            String         @id @default(cuid())
  email         String        @unique
  name          String?
  auth          Auth?         @relation
  subscription  Subscription?
  profile       Profile?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Auth {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  provider      String    @default("email")
  providerId    String?
  passwordHash  String?
  lastLogin     DateTime?
}

model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  bio          String?
  avatarUrl    String?
  settings     Json?
  preferences  Json?
}
```

### Subscriptions & Billing
```prisma
model Subscription {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  planId        String
  status        String
  stripeId      String?   @unique
  startDate     DateTime  @default(now())
  endDate       DateTime?
  cancelAt      DateTime?
  trialEnd      DateTime?
}

model SubscriptionHistory {
  id            String    @id @default(cuid())
  userId        String
  planId        String
  status        String
  amount        Float
  currency      String
  createdAt     DateTime  @default(now())
}
```

### Trading & Orders
```prisma
model Order {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  symbol        String
  type          String    // buy, sell
  amount        Float
  price         Float
  status        String
  executedAt    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Position {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  symbol        String
  amount        Float
  averagePrice  Float
  updatedAt     DateTime  @updatedAt
}
```

### Watchlists & Analytics
```prisma
model Watchlist {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  name          String
  symbols       String[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Analytics {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  type          String
  data          Json
  createdAt     DateTime  @default(now())
}
```

## 🔄 Migrations

### Migration erstellen
```bash
# Generiere Migration aus Schema-Änderungen
npx prisma migrate dev --name add_user_preferences

# Migration anwenden
npx prisma migrate deploy
```

### Migration-Beispiel
```sql
-- Migration: add_user_preferences
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
```

## 📈 Indizes & Performance

### Indizes
```sql
-- Primärschlüssel
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "Order_userId_symbol_idx" ON "Order"("userId", "symbol");
CREATE INDEX "Position_userId_symbol_idx" ON "Position"("userId", "symbol");

-- Zeitbasierte Indizes
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Analytics_createdAt_idx" ON "Analytics"("createdAt");
```

### Partitionierung
```sql
-- Partitionierung nach Datum
CREATE TABLE "OrderHistory" (
    LIKE "Order" INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Monatliche Partitionen
CREATE TABLE "OrderHistory_2025_03" 
    PARTITION OF "OrderHistory"
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');
```

## 🔒 Datenbank-Sicherheit

### Row Level Security
```sql
-- Policy für User-Daten
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_isolation_policy" ON "User"
    USING (id = current_user_id());

-- Policy für Orders
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_isolation_policy" ON "Order"
    USING (userId = current_user_id());
```

### Backup & Recovery
```bash
# Daily Backups
pg_dump -Fc nextleveltraders > backup_$(date +%Y%m%d).dump

# Point-in-Time Recovery
pg_restore -d nextleveltraders backup_20250304.dump
```

## 📊 Query Optimierung

### Beispiel-Queries

```typescript
// Effiziente User-Abfrage mit Relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    profile: true,
    subscription: {
      select: {
        status: true,
        planId: true,
      },
    },
  },
});

// Aggregierte Order-Daten
const orderStats = await prisma.order.groupBy({
  by: ["status"],
  _count: true,
  where: {
    userId,
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
  },
});
```

### Performance-Tipps

1. **Selektive Includes**
```typescript
// ✅ Gut
const user = await prisma.user.findUnique({
  select: {
    id: true,
    email: true,
  },
});

// ❌ Schlecht
const user = await prisma.user.findUnique({
  include: { everything: true },
});
```

2. **Batch Operations**
```typescript
// ✅ Gut
await prisma.order.createMany({
  data: orders,
});

// ❌ Schlecht
for (const order of orders) {
  await prisma.order.create({
    data: order,
  });
}
```

## 🔍 Monitoring

### Query Performance
```sql
-- Langsame Queries identifizieren
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### Connection Pooling
```typescript
// Database URL mit Pooling
DATABASE_URL="postgresql://user:password@localhost:5432/db?pool_timeout=30&pool_max=20"
```

## 📈 Skalierung

### Read Replicas
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.READ_REPLICA_URL,
    },
  },
});
```

### Sharding
```typescript
function getShardConnection(userId: string) {
  const shardId = hashUserId(userId) % TOTAL_SHARDS;
  return `postgresql://user:pass@shard-${shardId}/db`;
}
```

## 🔄 Data Migration

### Export/Import
```bash
# Daten exportieren
prisma db export --schema=schema.prisma

# Daten importieren
prisma db push --schema=schema.prisma --force-reset
```

### Seed Data
```typescript
// prisma/seed.ts
async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: "test@example.com",
        name: "Test User",
      },
      // ...
    ],
  });
}
```

## 📋 Maintenance

### Health Checks
```sql
-- Database Status
SELECT pg_is_in_recovery(), pg_postmaster_start_time();

-- Table Sizes
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### Cleanup Jobs
```typescript
// Alte Daten bereinigen
async function cleanupOldData() {
  const threshold = subMonths(new Date(), 6);
  
  await prisma.analytics.deleteMany({
    where: {
      createdAt: {
        lt: threshold,
      },
    },
  });
}