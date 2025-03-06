import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Webhook-Secret aus den Umgebungsvariablen
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Webhook-Secret ist nicht konfiguriert');
  }

  try {
    // Request-Body als JSON abrufen
    const payload = await req.json();
    const evt = payload as WebhookEvent;

    if (!evt?.data?.id) {
      return new Response('Ungültige Event-Daten', { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    switch (eventType) {
      case 'user.created': {
        // Erstelle Standardeinstellungen für den neuen Benutzer
        await prisma.settings.create({
          data: {
            userId: id,
            theme: 'system',
            defaultSymbol: 'AAPL',
            showPivots: true,
            showNews: true,
          },
        });

        // Erstelle eine Standard-Watchlist für den Benutzer
        await prisma.watchlist.create({
          data: {
            name: 'Standard',
            userId: id,
            items: {
              create: [
                { symbol: 'AAPL' },
                { symbol: 'MSFT' },
                { symbol: 'GOOGL' },
              ],
            },
          },
        });

        console.log(`Benutzer ${id} wurde erfolgreich initialisiert`);
        break;
      }
      case 'user.deleted': {
        // Bereinige die Benutzerdaten
        await prisma.$transaction([
          prisma.settings.delete({
            where: { userId: id },
          }),
          prisma.watchlist.deleteMany({
            where: { userId: id },
          }),
          prisma.chatHistory.deleteMany({
            where: { userId: id },
          }),
          prisma.tradingSetup.deleteMany({
            where: { userId: id },
          }),
        ]);

        console.log(`Benutzerdaten für ${id} wurden erfolgreich bereinigt`);
        break;
      }
      default:
        console.log(`Unbehandeltes Event: ${eventType}`);
        break;
    }

    return new Response('Webhook verarbeitet', { status: 200 });
  } catch (error) {
    console.error('Fehler bei der Webhook-Verarbeitung:', error);
    return new Response('Interner Server-Fehler', { status: 500 });
  }
}