import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getQuotes } from '@/lib/fmp';

async function getPivotData(symbol: string = 'AAPL', type: string = 'standard', timeframe: string = 'daily') {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pivots/${symbol}?type=${type}&timeframe=${timeframe}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pivot data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching pivot data:', error);
    return null;
  }
}

export default async function PivotsPage() {
  const data = await getPivotData();
  if (!data) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Fehler beim Laden der Pivot-Daten</p>
      </div>
    );
  }

  const { symbol, quote, pivots } = data;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Pivot-Punkt-Analyse</h1>
        <p className="text-muted-foreground">
          Multiframe-Pivot-Berechnungen und -Analyse für präzise Trading-Levels
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AAPL - Pivot-Levels</CardTitle>
                  <CardDescription>Apple Inc. - NASDAQ</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <select className="rounded-md border p-1.5 text-sm">
                    <option value="standard">Standard Pivots</option>
                    <option value="demark">DeMark Pivots</option>
                  </select>
                  <select className="rounded-md border p-1.5 text-sm">
                    <option value="daily" selected>Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="monthly">Monatlich</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Level</TableHead>
                      <TableHead>Wert</TableHead>
                      <TableHead>Abstand</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Berührungen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pivots.map((level) => (
                      <TableRow key={level.level} className={level.level === 'PP' ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                        <TableCell className={`font-medium ${level.isAbove ? 'text-green-600' : 'text-red-600'}`}>
                          {level.level}
                        </TableCell>
                        <TableCell>${level.value.toFixed(2)}</TableCell>
                        <TableCell>{level.distance > 0 ? '+' : ''}{level.distance.toFixed(1)}%</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent 
                            ${level.level === 'PP' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                              level.isAbove ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {level.level === 'PP' ? 'Am Pivot' : level.isAbove ? 'Über Preis' : 'Unter Preis'}
                          </span>
                        </TableCell>
                        <TableCell>{level.touches}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium text-green-600">R4</TableCell>
                      <TableCell>$201.10</TableCell>
                      <TableCell>+4.3%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                          Über Preis
                        </span>
                      </TableCell>
                      <TableCell>Keine</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">R3</TableCell>
                      <TableCell>$197.95</TableCell>
                      <TableCell>+2.7%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                          Über Preis
                        </span>
                      </TableCell>
                      <TableCell>Keine</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">R2</TableCell>
                      <TableCell>$195.85</TableCell>
                      <TableCell>+1.6%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                          Über Preis
                        </span>
                      </TableCell>
                      <TableCell>Einmal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">R1</TableCell>
                      <TableCell>$194.20</TableCell>
                      <TableCell>+0.8%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
                          Über Preis
                        </span>
                      </TableCell>
                      <TableCell>Zweimal</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-50 dark:bg-green-950/20">
                      <TableCell className="font-bold">PP</TableCell>
                      <TableCell className="font-bold">$192.75</TableCell>
                      <TableCell className="font-bold">0.0%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Am Pivot
                        </span>
                      </TableCell>
                      <TableCell>Mehrmals</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">S1</TableCell>
                      <TableCell>$190.15</TableCell>
                      <TableCell>-1.3%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                          Unter Preis
                        </span>
                      </TableCell>
                      <TableCell>Dreimal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">S2</TableCell>
                      <TableCell>$188.50</TableCell>
                      <TableCell>-2.2%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                          Unter Preis
                        </span>
                      </TableCell>
                      <TableCell>Einmal</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">S3</TableCell>
                      <TableCell>$185.90</TableCell>
                      <TableCell>-3.6%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                          Unter Preis
                        </span>
                      </TableCell>
                      <TableCell>Keine</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">S4</TableCell>
                      <TableCell>$184.25</TableCell>
                      <TableCell>-4.4%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                          Unter Preis
                        </span>
                      </TableCell>
                      <TableCell>Keine</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-red-600">S5</TableCell>
                      <TableCell>$181.65</TableCell>
                      <TableCell>-5.8%</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-muted text-muted-foreground">
                          Unter Preis
                        </span>
                      </TableCell>
                      <TableCell>Keine</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pivot-Status</CardTitle>
                <CardDescription>
                  Aktueller Status in allen Zeitrahmen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tages-Status:</span>
                      <span className="text-sm font-medium text-green-600">Am Pivot (PP)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-green-600" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span>S1</span>
                      <span className="font-bold">PP</span>
                      <span>R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wochen-Status:</span>
                      <span className="text-sm font-medium text-green-600">Über Pivot (R1)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-green-600" style={{ width: '67%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span>S1</span>
                      <span>PP</span>
                      <span className="font-bold">R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monats-Status:</span>
                      <span className="text-sm font-medium text-red-600">Unter Pivot (S1)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-red-600" style={{ width: '33%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>S3</span>
                      <span>S2</span>
                      <span className="font-bold">S1</span>
                      <span>PP</span>
                      <span>R1</span>
                      <span>R2</span>
                      <span>R3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DeMark Pivot-Analyse</CardTitle>
                <CardDescription>
                  Status in allen Zeitrahmen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Tages DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Über DM R1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      DM R1: $193.50 | DM PP: $191.25 | DM S1: $189.00
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Wochen DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Über DM R1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      DM R1: $191.75 | DM PP: $190.25 | DM S1: $188.50
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Monats DM</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                        Unter DM S1
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      DM R1: $197.00 | DM PP: $195.25 | DM S1: $193.50
                    </p>
                  </div>
                  
                  <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Multiframe Status</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                        Long Setup Bestätigt
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      2/3 Zeitrahmen bullisch (über DM R1)
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600">SPY und QQQ Trend: Bullisch (ADX {'>'} 25)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jahres-Pivot R2 Analyse</CardTitle>
            <CardDescription>
              Langfristige Widerstandsniveaus und deren Erreichen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Aktueller Kurs</TableHead>
                    <TableHead>Jahres PP</TableHead>
                    <TableHead>Jahres R2</TableHead>
                    <TableHead>Abstand bis R2</TableHead>
                    <TableHead>Zeit bis Erreichen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">AAPL</TableCell>
                    <TableCell>$192.75</TableCell>
                    <TableCell>$175.50</TableCell>
                    <TableCell>$205.25</TableCell>
                    <TableCell>+6.5%</TableCell>
                    <TableCell>Schätzung: 23 Tage</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        Nähert sich
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">MSFT</TableCell>
                    <TableCell>$417.32</TableCell>
                    <TableCell>$350.75</TableCell>
                    <TableCell>$445.50</TableCell>
                    <TableCell>+6.8%</TableCell>
                    <TableCell>Schätzung: 18 Tage</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        Nähert sich
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NVDA</TableCell>
                    <TableCell>$924.79</TableCell>
                    <TableCell>$700.25</TableCell>
                    <TableCell>$925.00</TableCell>
                    <TableCell>+0.02%</TableCell>
                    <TableCell>Erreicht vor 2 Tagen</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Fast erreicht
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">AMZN</TableCell>
                    <TableCell>$182.05</TableCell>
                    <TableCell>$175.25</TableCell>
                    <TableCell>$210.50</TableCell>
                    <TableCell>+15.6%</TableCell>
                    <TableCell>Schätzung: 45 Tage</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Auf dem Weg
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}