import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'week', 'month', 'year', 'all'

    // Datum für den Filter berechnen
    let dateFilter: Date | null = null;
    const now = new Date();

    switch (period) {
      case 'week':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        dateFilter = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        dateFilter = null;
    }

    // Alle abgeschlossenen Setups abrufen
    const completedSetups = await prisma.tradingSetup.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        ...(dateFilter && {
          updatedAt: {
            gte: dateFilter,
          },
        }),
      },
    });

    // Performance-Metriken berechnen
    const totalTrades = completedSetups.length;
    const profitableTrades = completedSetups.filter(setup => (setup.result || 0) > 0).length;
    const lossTrades = completedSetups.filter(setup => (setup.result || 0) < 0).length;
    const totalProfit = completedSetups.reduce((sum, setup) => sum + (setup.result || 0), 0);
    
    // Winning Rate berechnen
    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
    
    // Durchschnittliches Risk/Reward-Verhältnis berechnen
    const avgRiskReward = totalTrades > 0
      ? completedSetups.reduce((sum, setup) => {
          const risk = Math.abs(setup.entry - setup.stopLoss);
          const reward = Math.abs(setup.takeProfit - setup.entry);
          return sum + (reward / risk);
        }, 0) / totalTrades
      : 0;

    // Setups nach Symbolen gruppieren
    const setupsBySymbol = await prisma.tradingSetup.groupBy({
      by: ['symbol'],
      where: {
        userId,
        status: 'COMPLETED',
        ...(dateFilter && {
          updatedAt: {
            gte: dateFilter,
          },
        }),
      },
      _count: {
        symbol: true,
      },
      _sum: {
        result: true,
      },
    });

    // Beste und schlechteste Symbole finden
    const symbolStats = setupsBySymbol
      .map(stat => ({
        symbol: stat.symbol,
        trades: stat._count.symbol,
        totalProfit: stat._sum.result || 0,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);

    // Aktive Setups zählen
    const activeSetups = await prisma.tradingSetup.count({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      data: {
        period,
        overview: {
          totalTrades,
          profitableTrades,
          lossTrades,
          winRate: winRate.toFixed(2),
          totalProfit: totalProfit.toFixed(2),
          avgRiskReward: avgRiskReward.toFixed(2),
          activeSetups,
        },
        symbols: {
          best: symbolStats.slice(0, 3),
          worst: symbolStats.slice(-3).reverse(),
        },
        bySymbol: symbolStats,
      },
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Trading-Statistiken:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}