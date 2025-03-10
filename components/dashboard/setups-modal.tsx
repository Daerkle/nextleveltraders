"use client";

import { useState } from "react";

interface SetupModalProps {
  setupsCount: number;
  newSetupsCount: number;
}

export function SetupsModal({ setupsCount, newSetupsCount }: SetupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Karte für Aktive Setups mit Öffnen-Button */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between p-6 pb-2">
          <h3 className="text-sm font-medium">Aktive Setups</h3>
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
            className="h-4 w-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">{setupsCount}</div>
          <p className="text-xs text-muted-foreground">
            {newSetupsCount} neue in den letzten 24h
          </p>
          <div className="mt-3">
            <button
              onClick={openModal}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
            >
              Alle Setups anzeigen →
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Aktive Trading-Setups</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                {/* Bullische Setups */}
                <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">AAPL</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Bullish
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Apple bricht über den wichtigen Widerstand bei $180 aus und
                    zeigt starkes Momentum. Volumen unterstützt die Bewegung.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $182.50</span>
                    <span>Stop-Loss: $178.30</span>
                    <span>Ziel: $190.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">MSFT</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Bullish
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Microsoft testet erfolgreich den 50-Tage-EMA als Support und
                    kehrt in den Aufwärtstrend zurück.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $365.20</span>
                    <span>Stop-Loss: $359.80</span>
                    <span>Ziel: $380.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">AMD</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Bullish
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    AMD bildet ein Cup-and-Handle Muster und steht vor einem
                    möglichen Ausbruch über $130.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $131.50</span>
                    <span>Stop-Loss: $126.80</span>
                    <span>Ziel: $145.00</span>
                  </div>
                </div>

                {/* Bärische Setups */}
                <div className="rounded-lg p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">NFLX</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                      Bärisch
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Netflix durchbricht den wichtigen Support bei $460 und
                    bildet ein Doppel-Top-Muster.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $455.00</span>
                    <span>Stop-Loss: $465.20</span>
                    <span>Ziel: $430.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">TSLA</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                      Bärisch
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Tesla kann den Widerstand bei $250 nicht durchbrechen und
                    bildet eine fallende Keilformation.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $240.50</span>
                    <span>Stop-Loss: $252.30</span>
                    <span>Ziel: $220.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">AMZN</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Bullish
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Amazon testet erfolgreich die Unterstützung bei $140 und
                    zeigt Divergenz im RSI.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $145.30</span>
                    <span>Stop-Loss: $139.80</span>
                    <span>Ziel: $155.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">META</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300">
                      Bärisch
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Meta durchbricht die wichtige Trendlinie und den
                    20-Tage-EMA nach unten, Volumen steigt.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $325.40</span>
                    <span>Stop-Loss: $335.60</span>
                    <span>Ziel: $310.00</span>
                  </div>
                </div>

                <div className="rounded-lg p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">NVDA</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                      Bullish
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Nvidia konsolidiert nach starkem Anstieg und bietet eine
                    Pullback-Gelegenheit an der 10-Tage-EMA.
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Einstieg: $485.30</span>
                    <span>Stop-Loss: $470.00</span>
                    <span>Ziel: $520.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}