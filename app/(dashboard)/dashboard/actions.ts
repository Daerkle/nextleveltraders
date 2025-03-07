'use server';

import { revalidatePath } from 'next/cache';

export async function addToWatchlist(symbol: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlists/default/symbols`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol }),
    });

    if (!res.ok) throw new Error('Failed to add symbol');
    revalidatePath('/dashboard');
  } catch (error) {
    throw new Error('Failed to add symbol to watchlist');
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlists/default/symbols/${symbol}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to remove symbol');
    revalidatePath('/dashboard');
  } catch (error) {
    throw new Error('Failed to remove symbol from watchlist');
  }
}
