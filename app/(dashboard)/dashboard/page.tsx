import { Suspense } from "react";
import { HelpCircleIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SetupsModal } from "@/components/dashboard/setups-modal";

// Statische Daten für den Fall, dass die API-Anfrage fehlschlägt
const fallbackData = {
  spy: { change: 0, changesPercentage: 0, price: 0, symbol: 'SPY' },
  qqq: { change: 0, changesPercentage: 0, price: 0, symbol: 'QQQ' },
  vix: { change: 0, changesPercentage: 0, price: 0, symbol: 'VIX' },
  tlt: { change: 0, changesPercentage: 0, price: 0, symbol: 'TLT' },
  iwm: { change: 0, changesPercentage: 0, price: 0, symbol: 'IWM' },
  dxy: { change: 0, changesPercentage: 0, price: 0, symbol: 'DXY' },
  dji: { change: 0, changesPercentage: 0, price: 0, symbol: 'DIA' },
  watchlist: [],
  news: []
};

async function getMarketData() {
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
  
  try {
    // Direkter Zugriff auf die FMP API ohne den Umweg über die interne API
    console.log('Fetching market data directly from FMP API...');
    
    // Abrufen der Indexdaten
    const indicesResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/SPY,QQQ,VIX,TLT,IWM,DXY?apikey=${FMP_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    
    if (!indicesResponse.ok) {
      throw new Error(`Failed to fetch indices: ${indicesResponse.status}`);
    }
    
    const indicesData = await indicesResponse.json();
    
    // Watchlist-Daten abrufen
    const watchlistResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/AAPL,MSFT,AMZN,NVDA?apikey=${FMP_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    
    const watchlistData = await watchlistResponse.json();
    
    // Marktnachrichten abrufen
    const newsResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${FMP_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    
    const activesData = await newsResponse.json();
    
    // Nachrichten formatieren
    const newsData = Array.isArray(activesData) 
      ? activesData.slice(0, 5).map(item => ({
          title: `${item.symbol} - ${item.changesPercentage.toFixed(2)}%`,
          text: `Price: ${item.price.toFixed(2)} | Change: ${item.change.toFixed(2)} | Volume: ${item.volume}`,
          symbol: item.symbol,
          publishedDate: new Date().toISOString()
        }))
      : [];
    
    // Extrahieren der Indexwerte
    const data = {
      spy: indicesData.find(q => q.symbol === 'SPY') || fallbackData.spy,
      qqq: indicesData.find(q => q.symbol === 'QQQ') || fallbackData.qqq,
      vix: indicesData.find(q => q.symbol === 'VIX') || fallbackData.vix,
      tlt: indicesData.find(q => q.symbol === 'TLT') || fallbackData.tlt,
      iwm: indicesData.find(q => q.symbol === 'IWM') || fallbackData.iwm,
      dxy: indicesData.find(q => q.symbol === 'DXY') || fallbackData.dxy,
      watchlist: Array.isArray(watchlistData) ? watchlistData : [],
      news: newsData
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return fallbackData;
  }
}

export default async function DashboardPage() {
  const { spy, qqq, vix, tlt, iwm, dxy, watchlist, news } = await getMarketData();
  
  // Funktion zur Bestimmung der Textfarbe basierend auf Prozentänderung
  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Ihr Trading-Überblick und aktuelle Marktentwicklungen
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SPY</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${spy.changesPercentage > 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              S&P 500 ETF
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ${spy.price ? spy.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(spy.changesPercentage)}`}>
              {spy.changesPercentage > 0 ? '+' : ''}{spy.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">QQQ</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${qqq.changesPercentage > 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              Nasdaq 100 ETF
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ${qqq.price ? qqq.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(qqq.changesPercentage)}`}>
              {qqq.changesPercentage > 0 ? '+' : ''}{qqq.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VIX</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${vix.changesPercentage < 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              Volatilität
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {vix.price ? vix.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(vix.changesPercentage * -1)}`}>
              {vix.changesPercentage > 0 ? '+' : ''}{vix.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">TLT</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${tlt.changesPercentage > 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              US-Anleihen 20Y
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ${tlt.price ? tlt.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(tlt.changesPercentage)}`}>
              {tlt.changesPercentage > 0 ? '+' : ''}{tlt.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">IWM</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${iwm.changesPercentage > 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              Russell 2000
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ${iwm.price ? iwm.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(iwm.changesPercentage)}`}>
              {iwm.changesPercentage > 0 ? '+' : ''}{iwm.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">DXY</CardTitle>
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${dxy.changesPercentage < 0 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
              US Dollar Index
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {dxy.price ? dxy.price.toFixed(2) : '0.00'}
            </div>
            <p className={`text-sm font-medium ${getChangeColor(dxy.changesPercentage * -1)}`}>
              {dxy.changesPercentage > 0 ? '+' : ''}{dxy.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Client-Komponente für das Setups-Modal */}
        <SetupsModal setupsCount={12} newSetupsCount={3} />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Markt-Status</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(spy.changesPercentage + qqq.changesPercentage)/2 > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(spy.changesPercentage + qqq.changesPercentage)/2 > 1 ? 'Bullisch' : 
               (spy.changesPercentage + qqq.changesPercentage)/2 > 0 ? 'Leicht Bullisch' : 
               (spy.changesPercentage + qqq.changesPercentage)/2 > -1 ? 'Leicht Bärisch' : 'Bärisch'}
            </div>
            <p className="text-xs text-muted-foreground">
              SPY+QQQ Avg: {((spy.changesPercentage + qqq.changesPercentage)/2).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risiko-Indikatoren</CardTitle>
            <HelpCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${vix.price > 20 ? 'text-amber-600' : vix.price > 30 ? 'text-red-600' : 'text-green-600'}`}>
              {vix.price > 30 ? 'Hoch' : vix.price > 20 ? 'Mittel' : 'Niedrig'}
            </div>
            <p className="text-xs text-muted-foreground">
              VIX: {vix.price ? vix.price.toFixed(2) : '0.00'} | {vix.changesPercentage > 0 ? '+' : ''}{vix.changesPercentage.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Anstehende Ereignisse</CardTitle>
            <CardDescription>
              Wichtige Termine und wirtschaftliche Ereignisse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">FED Zinsentscheidung</p>
                  <p className="text-xs text-muted-foreground">Meeting der Federal Reserve zum Leitzins</p>
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 mr-2">Wichtig</div>
                  <p className="text-xs font-medium">13.12.2023</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">US CPI Daten</p>
                  <p className="text-xs text-muted-foreground">Inflationsdaten für den US-Markt</p>
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 mr-2">Wichtig</div>
                  <p className="text-xs font-medium">10.12.2023</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Arbeitsmarktbericht</p>
                  <p className="text-xs text-muted-foreground">US Non-Farm Payrolls</p>
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 mr-2">Mittel</div>
                  <p className="text-xs font-medium">05.12.2023</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-medium">Earnings Season</p>
                  <p className="text-xs text-muted-foreground">Beginn des nächsten Quartalszahlen-Zyklus</p>
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 mr-2">Info</div>
                  <p className="text-xs font-medium">15.01.2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Aktuelle News</CardTitle>
            <CardDescription>
              Wichtige Marktnachrichten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {news.slice(0, 2).map((article: any) => (
                <div key={article.title} className="space-y-2">
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {article.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(article.publishedDate).toLocaleString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>KI-Setup-Analyse</CardTitle>
            <CardDescription>
              Aktuelle KI-generierte Setups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">Long Setup</span>
              <p className="mt-2 font-medium">AAPL über DM R1</p>
              <p className="text-xs text-muted-foreground mt-1">2/3 Zeitrahmen bullisch</p>
            </div>
            <div className="rounded-lg p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">Short Setup</span>
              <p className="mt-2 font-medium">NFLX unter DM S1</p>
              <p className="text-xs text-muted-foreground mt-1">3/3 Zeitrahmen bärisch</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}