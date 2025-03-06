import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrainCircuitIcon, SendIcon } from "lucide-react";

"use client";

import { useState } from "react";
import { useSubscriptionContext } from "@/components/subscription/subscription-provider";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [symbol, setSymbol] = useState("");
  const { features } = useSubscriptionContext();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl">Trading-KI-Assistent</h1>
        <p className="text-muted-foreground">
          Fragen Sie unseren Trading-Assistenten für Setup-Analysen und Markteinblicke
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5">
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat mit TradingGPT</CardTitle>
              <CardDescription>
                Nutzen Sie unser KI-Modell für Trading-Analysen und Marktinformationen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6 space-y-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <BrainCircuitIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    Willkommen bei NextLevelTraders KI-Chat! Ich kann Ihnen bei Trading-Analysen, 
                    Pivot-Punkt-Berechnungen, technischen Indikatoren und Trading-Strategien helfen. 
                    Wie kann ich Ihnen heute behilflich sein?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">Sie</span>
                </div>
                <div className="flex-1 rounded-lg bg-secondary/20 p-3">
                  <p className="text-sm">
                    Wie funktionieren DeMark Pivots und wie unterscheiden sie sich von Standard-Pivots?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <BrainCircuitIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    <span className="font-medium">DeMark Pivot Punkte vs. Standard Pivot Punkte:</span>
                    <br/><br/>
                    <span className="font-medium">Standard Pivot Punkte:</span>
                    <br />
                    Die klassischen Pivot Punkte basieren auf dem Durchschnitt von Hoch, Tief und Schluss des vorherigen Zeitraums:
                    <br />
                    Pivot (PP) = (Hoch + Tief + Schluss) / 3
                    <br />
                    Darauf basieren dann R1, R2, S1, S2 usw.
                    <br /><br />
                    
                    <span className="font-medium">DeMark Pivot Punkte:</span>
                    <br />
                    DeMark Pivots verwenden eine bedingte Formel, die die Beziehung zwischen Eröffnungs- und Schlusskurs berücksichtigt:
                    <br /><br />
                    Wenn Schluss &lt; Eröffnung:
                    <br />
                    X = Hoch + (2 × Tief) + Schluss
                    <br /><br />
                    Wenn Schluss &gt; Eröffnung:
                    <br />
                    X = (2 × Hoch) + Tief + Schluss
                    <br /><br />
                    Der Pivot ist dann:
                    <br />
                    DeMark PP = X / 4
                    <br /><br />
                    DeMark Pivots reagieren stärker auf die Marktdynamik des letzten Zeitraums und können bei trendbehafteten Märkten genauere Unterstützungs- und Widerstandsniveaus liefern.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">Sie</span>
                </div>
                <div className="flex-1 rounded-lg bg-secondary/20 p-3">
                  <p className="text-sm">
                    Wie wird eine Multiframe-Bestätigung bei Trading-Setups durchgeführt?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <BrainCircuitIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    <span className="font-medium">Multiframe-Bestätigung bei Trading-Setups:</span>
                    <br /><br/>
                    Eine Multiframe-Bestätigung bedeutet, dass ein Trading-Setup in mehreren Zeitrahmen (Timeframes) bestätigt wird, was die Zuverlässigkeit des Signals erhöht.
                    <br /><br/>
                    <span className="font-medium">Wie man Multiframe-Bestätigung durchführt:</span>
                    <br/>
                    1. <span className="font-medium">Identifizieren Sie die relevanten Zeitrahmen:</span> Typischerweise drei Zeitrahmen - ein höherer (z.B. täglich/wöchentlich), ein mittlerer (z.B. 4h/1h) und ein niedrigerer (z.B. 15min/5min).
                    <br/><br/>
                    2. <span className="font-medium">Analysieren Sie den höheren Zeitrahmen zuerst:</span> Dieser gibt die Haupttrendrichtung an. Bei NextLevelTraders verwenden wir dafür oft die Monats- und Wochencharts.
                    <br/><br/>
                    3. <span className="font-medium">Bestätigung im mittleren Zeitrahmen:</span> Suchen Sie nach Setups, die mit dem übergeordneten Trend übereinstimmen. Bei uns sind das typischerweise die Tagesdaten und 1h-Charts.
                    <br/><br/>
                    4. <span className="font-medium">Eintritt im niedrigeren Zeitrahmen:</span> Der niedrigere Zeitrahmen (10min, 5min) dient zur präzisen Bestimmung des Einstiegspunkts.
                    <br/><br/>
                    5. <span className="font-medium">Anwendung von Indikatoren:</span> Bei NextLevelTraders verwenden wir EMA-Clouds in mehreren Zeitrahmen sowie Pivot-Punkte. Ein Setup gilt als bestätigt, wenn in mindestens 2 von 3 Zeitrahmen ein übereinstimmendes Signal vorliegt.
                    <br/><br/>
                    Beispiel: Ein bullisches Setup wird bestätigt, wenn der Kurs in mindestens 2 von 3 Zeitrahmen (Tag, Woche, Monat) über dem DM R1 liegt. Diese Multiframe-Bestätigung erhöht die Erfolgswahrscheinlichkeit erheblich.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex w-full items-center space-x-2">
                {features.canAccessRealTimeData && (
                  <Input 
                    placeholder="Symbol (z.B. AAPL)" 
                    className="w-24" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  />
                )}
                <Input 
                  placeholder="Stellen Sie eine Frage zu Trading oder Marktanalyse..." 
                  className="flex-1" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && message.trim()) {
                      e.preventDefault();
                      // Handle message submission
                      fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message, symbol: symbol || undefined })
                      });
                      setMessage("");
                    }
                  }}
                />
                <Button 
                  size="icon"
                  onClick={() => {
                    if (message.trim()) {
                      fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message, symbol: symbol || undefined })
                      });
                      setMessage("");
                    }
                  }}
                >
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Nachricht senden</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vorgeschlagene Fragen</CardTitle>
                <CardDescription>
                  Beginnen Sie mit diesen Beispielen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  Wie interpretiere ich EMA-Cloud-Crossovers?
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  Was sind ADX-Werte und wie nutze ich sie?
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  Erklären Sie die Best Practices für Pivot-Trading
                </Button>
                <Button variant="outline" className="w-full justify-start text-left h-auto py-2">
                  Was ist ein gutes Risk-Reward-Verhältnis?
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>KI-Funktionen</CardTitle>
                <CardDescription>
                  Möglichkeiten der Trading-KI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Setup-Analyse und Bewertung
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Technische Indikator-Erklärungen
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Trading-Strategie-Entwicklung
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Markttrend-Einschätzungen
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}