"use client";

import { Card } from "@/components/ui/card";

export default function AkronymePage() {
  return (
    <div className="py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">✨ Trading Akronyme ✨</h1>
        <p className="text-muted-foreground">
          Die wichtigsten Abkürzungen und Begriffe im Trading
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Trading Basics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Marktrichtung</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">b/o:</span> <span className="text-muted-foreground">Breakout</span></li>
                <li><span className="font-semibold">r/g:</span> <span className="text-muted-foreground">Red to green</span></li>
                <li><span className="font-semibold">g/r:</span> <span className="text-muted-foreground">Green to red</span></li>
                <li><span className="font-semibold">b/e:</span> <span className="text-muted-foreground">Breakeven</span></li>
                <li><span className="font-semibold">b/t:</span> <span className="text-muted-foreground">Backtest</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Preislevel</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">ATH:</span> <span className="text-muted-foreground">All time high</span></li>
                <li><span className="font-semibold">HOD:</span> <span className="text-muted-foreground">High of day</span></li>
                <li><span className="font-semibold">nHOD:</span> <span className="text-muted-foreground">New high of day</span></li>
                <li><span className="font-semibold">LOD:</span> <span className="text-muted-foreground">Low of day</span></li>
                <li><span className="font-semibold">nLOD:</span> <span className="text-muted-foreground">New low of day</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Handelszeiten</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">PM:</span> <span className="text-muted-foreground">Premarket</span></li>
                <li><span className="font-semibold">PH:</span> <span className="text-muted-foreground">Power hour</span></li>
                <li><span className="font-semibold">AH:</span> <span className="text-muted-foreground">After hours</span></li>
                <li><span className="font-semibold">moc:</span> <span className="text-muted-foreground">Market on close</span></li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Technische Analyse</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Chart-Patterns</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">HH:</span> <span className="text-muted-foreground">Higher High</span></li>
                <li><span className="font-semibold">HL:</span> <span className="text-muted-foreground">Higher Low</span></li>
                <li><span className="font-semibold">LH:</span> <span className="text-muted-foreground">Lower High</span></li>
                <li><span className="font-semibold">LL:</span> <span className="text-muted-foreground">Lower Low</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Analyse</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">PA:</span> <span className="text-muted-foreground">Price Action</span></li>
                <li><span className="font-semibold">PT:</span> <span className="text-muted-foreground">Price Target</span></li>
                <li><span className="font-semibold">DD:</span> <span className="text-muted-foreground">Due diligence</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Management</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">SL:</span> <span className="text-muted-foreground">Stop Loss</span></li>
                <li><span className="font-semibold">R/R:</span> <span className="text-muted-foreground">Risk/Reward</span></li>
                <li><span className="font-semibold">P/L:</span> <span className="text-muted-foreground">Profit/Loss</span></li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Optionen-spezifisch</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Die Griechen</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">Δ:</span> <span className="text-muted-foreground">Delta (Preisänderung)</span></li>
                <li><span className="font-semibold">Γ:</span> <span className="text-muted-foreground">Gamma (Delta-Änderung)</span></li>
                <li><span className="font-semibold">Θ:</span> <span className="text-muted-foreground">Theta (Zeitverfall)</span></li>
                <li><span className="font-semibold">V:</span> <span className="text-muted-foreground">Vega (Volatilität)</span></li>
                <li><span className="font-semibold">ρ:</span> <span className="text-muted-foreground">Rho (Zinsänderung)</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Position</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">ITM:</span> <span className="text-muted-foreground">In the money</span></li>
                <li><span className="font-semibold">ATM:</span> <span className="text-muted-foreground">At the money</span></li>
                <li><span className="font-semibold">OTM:</span> <span className="text-muted-foreground">Out of the money</span></li>
                <li><span className="font-semibold">IV:</span> <span className="text-muted-foreground">Implied Volatility</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Strategien</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">LEAPS:</span> <span className="text-muted-foreground">Long-term Equity AnticiPation Securities</span></li>
                <li><span className="font-semibold">PMCC:</span> <span className="text-muted-foreground">Poor Man&apos;s Covered Call</span></li>
                <li><span className="font-semibold">IC:</span> <span className="text-muted-foreground">Iron Condor</span></li>
                <li><span className="font-semibold">BF:</span> <span className="text-muted-foreground">Butterfly</span></li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Markt & News</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Indizes</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">SPX:</span> <span className="text-muted-foreground">S&P 500 Index</span></li>
                <li><span className="font-semibold">SPY:</span> <span className="text-muted-foreground">S&P 500 ETF</span></li>
                <li><span className="font-semibold">QQQ:</span> <span className="text-muted-foreground">Nasdaq 100 ETF</span></li>
                <li><span className="font-semibold">DIA:</span> <span className="text-muted-foreground">Dow Jones ETF</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Events</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">ER:</span> <span className="text-muted-foreground">Earnings Report</span></li>
                <li><span className="font-semibold">IPO:</span> <span className="text-muted-foreground">Initial Public Offering</span></li>
                <li><span className="font-semibold">FDA:</span> <span className="text-muted-foreground">Food & Drug Administration</span></li>
                <li><span className="font-semibold">FOMC:</span> <span className="text-muted-foreground">Federal Open Market Committee</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Trading</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="font-semibold">FOMO:</span> <span className="text-muted-foreground">Fear of missing out</span></li>
                <li><span className="font-semibold">PDT:</span> <span className="text-muted-foreground">Pattern Day Trader</span></li>
                <li><span className="font-semibold">T&S:</span> <span className="text-muted-foreground">Time & Sales</span></li>
                <li><span className="font-semibold">L2:</span> <span className="text-muted-foreground">Level 2 (Market Depth)</span></li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}