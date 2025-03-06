import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 Sekunde

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    errorFormat: "pretty",
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const connectWithRetry = async (retryCount = 0) => {
  try {
    await prisma.$connect();
    console.log('Erfolgreich mit der Datenbank verbunden');
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const backoff = INITIAL_BACKOFF * Math.pow(2, retryCount);
      console.warn(`Verbindungsversuch ${retryCount + 1} fehlgeschlagen. Neuer Versuch in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return connectWithRetry(retryCount + 1);
    }
    console.error('Verbindung zur Datenbank nach mehreren Versuchen fehlgeschlagen:', error);
    throw error;
  }
};

// Initialisiere Verbindung mit Retry-Logik
connectWithRetry().catch((error) => {
  console.error('Schwerwiegender Datenbankverbindungsfehler:', error);
  process.exit(1);
});

// Verbindung beim Beenden der Anwendung schließen
// Änderung: Event-Listener direkt an process anstatt an prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Datenbankverbindung geschlossen');
});