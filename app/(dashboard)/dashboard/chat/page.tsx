"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useChat } from "@/lib/hooks/use-chat";
import { Message as ChatMessage } from "@/lib/types/chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageProps {
  content: string;
  isUser: boolean;
  userImage?: string;
}

function Message({ content, isUser, userImage }: MessageProps) {
  return (
    <div className="flex gap-3">
      <div className={`h-8 w-8 rounded-full ${isUser ? 'bg-secondary/20' : 'bg-primary/20'} flex items-center justify-center overflow-hidden ${!isUser ? 'p-1.5' : ''}`}>
        {isUser ? (
          userImage ? (
            <Image
              src={userImage}
              alt="Profilbild"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium">Sie</span>
          )
        ) : (
          <Image
            src="/nexus_white.png"
            alt="Nexus Logo"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        )}
      </div>
      <div className={`flex-1 rounded-lg ${isUser ? 'bg-secondary/20' : 'bg-muted'} p-3`}>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useUser();
  const { messages, isLoading, error, sendMessage } = useChat();

  const welcomeMessage: ChatMessage = {
    role: 'assistant',
    content: 'Willkommen, ich bin NeXus! Ich kann Ihnen mit Marktanalysen, Finanzdaten und Trading-Strategien helfen.'
  };

  const templates = [
    // Daytrader Templates
    {
      category: 'Daytrader: Pivot-Analyse',
      text: 'Berechne die Intraday-Pivot-Punkte für AAPL und zeige die wichtigsten Preiszonen für heute'
    },
    {
      category: 'Daytrader: Volumen-Analyse',
      text: 'Analysiere das Volumen-Profil von TSLA und identifiziere die Value-Areas'
    },
    {
      category: 'Daytrader: News-Impact',
      text: 'Welche wichtigen News-Events stehen heute für MSFT an und wie könnten sie den Kurs beeinflussen?'
    },

    // Swing Trader Templates
    {
      category: 'Swing Trader: Chart-Patterns',
      text: 'Finde aktuelle Chart-Patterns in GOOGL und analysiere die Erfolgswahrscheinlichkeiten'
    },
    {
      category: 'Swing Trader: Momentum',
      text: 'Erstelle eine Watchlist der stärksten Momentum-Aktien für die nächste Woche'
    },
    {
      category: 'Swing Trader: Sektoranalyse',
      text: 'Welcher Sektor zeigt aktuell die beste relative Stärke für Swing-Trades?'
    },

    // Investoren Templates
    {
      category: 'Investor: Fundamentalanalyse',
      text: 'Führe eine detaillierte Fundamentalanalyse von MSFT durch (KGV, KBV, Dividenden, Wachstum)'
    },
    {
      category: 'Investor: Branchen-Research',
      text: 'Analysiere die Wachstumschancen im KI-Sektor und identifiziere die Top 5 Unternehmen'
    },
    {
      category: 'Investor: Risiko-Analyse',
      text: 'Bewerte die makroökonomischen Risiken für ein langfristiges Investment in AAPL'
    }
  ];

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputValue.trim();

    if (message && !isLoading) {
      setInputValue('');
      await sendMessage(message);
    }
  };

  const handleTemplateClick = (template: string) => {
    setInputValue(template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">KI-Chat</h2>
        <p className="text-muted-foreground">
          Nutzen Sie unseren KI-Assistenten für Trading-Analysen und Marktinformationen
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Card className="h-[calc(100vh-220px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat mit NeXus</CardTitle>
              <CardDescription>
                Nutzen Sie unser KI-Modell für Trading-Analysen und Marktinformationen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6 space-y-4">
              <Message
                content={welcomeMessage.content}
                isUser={false}
              />
              {messages.map((msg, index) => (
                <Message
                  key={index}
                  content={msg.content}
                  isUser={msg.role === 'user'}
                  userImage={msg.role === 'user' ? user?.imageUrl : undefined}
                />
              ))}
              {isLoading && (
                <div className="text-sm text-muted-foreground">
                  NeXus schreibt...
                </div>
              )}
              {error && (
                <div className="text-sm text-destructive">
                  Fehler: {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-2">
              <form
                onSubmit={handleSubmit}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  id="message"
                  name="message"
                  placeholder="Schreiben Sie eine Nachricht..."
                  className="flex-1"
                  autoComplete="off"
                  disabled={isLoading}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Nachricht senden</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
        <div className="hidden md:block md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading & Investment Vorlagen</CardTitle>
              <CardDescription>
                Wählen Sie Ihren Trading-Stil für passende Vorlagen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daytrader" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="daytrader" className="flex-1">Daytrader</TabsTrigger>
                  <TabsTrigger value="swingtrader" className="flex-1">Swing Trader</TabsTrigger>
                  <TabsTrigger value="investor" className="flex-1">Investoren</TabsTrigger>
                </TabsList>

                <TabsContent value="daytrader" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Analysiere die Intraday-Bewegung von [SYMBOL] mit VWAP, RSI und Volumen-Profil.")}>
                      <p className="text-sm font-medium mb-1">Technische Analyse</p>
                      <p className="text-sm text-muted-foreground">Intraday-Indikatoren und Volumen-Profile für präzises Timing</p>
                    </div>
                    
                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Zeige mir die wichtigsten Pivot-Punkte und Unterstützungs-/Widerstandszonen für [SYMBOL].")}>
                      <p className="text-sm font-medium mb-1">Support & Resistance</p>
                      <p className="text-sm text-muted-foreground">Pivot-Punkte und wichtige Preis-Levels für den Handel</p>
                    </div>

                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Was sind die wichtigsten News und Events heute für [SYMBOL]? Gibt es Earnings oder andere Market-Moving Events?")}>
                      <p className="text-sm font-medium mb-1">News & Events</p>
                      <p className="text-sm text-muted-foreground">Aktuelle News, Earnings und wichtige Markt-Events</p>
                    </div>

                    {templates
                      .filter(template => template.category.startsWith('Daytrader'))
                      .map((template, index) => (
                        <div 
                          key={`daytrader-${index}`}
                          className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleTemplateClick(template.text)}
                        >
                          <p className="text-sm font-medium mb-1">{template.category.replace('Daytrader: ', '')}</p>
                          <p className="text-sm text-muted-foreground">{template.text}</p>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="swingtrader" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Identifiziere die wichtigsten Chart-Patterns und Trendlinien für [SYMBOL] auf dem Daily Chart.")}>
                      <p className="text-sm font-medium mb-1">Chart Patterns</p>
                      <p className="text-sm text-muted-foreground">Technische Muster und Trendlinien für mehrtägige Setups</p>
                    </div>

                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Analysiere die relative Stärke von [SYMBOL] im Vergleich zum Sektor und berechne den RSI auf verschiedenen Timeframes.")}>
                      <p className="text-sm font-medium mb-1">Momentum & Stärke</p>
                      <p className="text-sm text-muted-foreground">Relative Stärke, Momentum und Sektorvergleich</p>
                    </div>

                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Berechne optimale Position-Size und Stop-Loss-Levels für [SYMBOL] basierend auf der aktuellen Volatilität.")}>
                      <p className="text-sm font-medium mb-1">Risiko-Management</p>
                      <p className="text-sm text-muted-foreground">Position-Sizing und Stop-Loss-Strategien</p>
                    </div>

                    {templates
                      .filter(template => template.category.startsWith('Swing Trader'))
                      .map((template, index) => (
                        <div 
                          key={`swingtrader-${index}`}
                          className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleTemplateClick(template.text)}
                        >
                          <p className="text-sm font-medium mb-1">{template.category.replace('Swing Trader: ', '')}</p>
                          <p className="text-sm text-muted-foreground">{template.text}</p>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="investor" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Analysiere die wichtigsten Fundamentaldaten von [SYMBOL]: KGV, KBV, Dividendenrendite und Wachstumsraten.")}>
                      <p className="text-sm font-medium mb-1">Fundamentalanalyse</p>
                      <p className="text-sm text-muted-foreground">Bewertungskennzahlen und Wachstumsmetriken</p>
                    </div>

                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Gib mir eine detaillierte Analyse der Branche und Wettbewerber von [SYMBOL]. Wie ist die Marktposition?")}>
                      <p className="text-sm font-medium mb-1">Branchen-Research</p>
                      <p className="text-sm text-muted-foreground">Wettbewerbsanalyse und Marktposition</p>
                    </div>

                    <div 
                      className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleTemplateClick("Wie wird [SYMBOL] von aktuellen makroökonomischen Faktoren beeinflusst? (Zinsen, Inflation, Wirtschaftsdaten)")}>
                      <p className="text-sm font-medium mb-1">Makro-Einflüsse</p>
                      <p className="text-sm text-muted-foreground">Einfluss von Wirtschaftsdaten und globalen Faktoren</p>
                    </div>

                    {templates
                      .filter(template => template.category.startsWith('Investor'))
                      .map((template, index) => (
                        <div 
                          key={`investor-${index}`}
                          className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleTemplateClick(template.text)}
                        >
                          <p className="text-sm font-medium mb-1">{template.category.replace('Investor: ', '')}</p>
                          <p className="text-sm text-muted-foreground">{template.text}</p>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}