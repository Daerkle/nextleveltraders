"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { WatchlistSidebar } from "@/components/watchlist-sidebar";
import { WatchlistProvider } from "@/components/providers/watchlist-provider";
import { useWatchlistStore } from "@/stores/use-watchlist-store";

// Client Component für die dynamische Layout-Anpassung
function DashboardContainer({ children }: { children: React.ReactNode }) {
  const { isOpen } = useWatchlistStore();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Linke Seitenleiste */}
      <Sidebar />
      
      {/* Hauptbereich mit anpassbarer Breite */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-200"
        style={{ 
          marginRight: '0',
          width: '100%'
        }}
      >
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </div>
      </div>

      {/* Rechte Watchlist-Sidebar ausgeblendet */}
    </div>
  );
}

// Layout-Komponente mit Provider
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WatchlistProvider>
      <DashboardContainer>{children}</DashboardContainer>
    </WatchlistProvider>
  );
}