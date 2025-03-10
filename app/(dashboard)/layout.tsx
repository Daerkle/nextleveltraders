"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { WatchlistSidebar } from "@/components/watchlist-sidebar";
import { WatchlistProvider } from "@/components/providers/watchlist-provider";
import { useWatchlistStore } from "@/stores/use-watchlist-store";

// Client Component für die dynamische Layout-Anpassung
function DashboardContainer({ children }: { children: React.ReactNode }) {
  const { isOpen } = useWatchlistStore();

  return (
    <div className="min-h-screen bg-background">
      <div
        className="flex transition-all duration-200"
        style={{
          paddingRight: isOpen ? '300px' : '48px'
        }}
      >
        {/* Linke Seitenleiste */}
        <Sidebar />
        
        {/* Hauptbereich */}
        <main className="flex-1 min-h-screen">
          <div className="flex-1">
            <div className="w-full py-6 px-6">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Rechte Watchlist-Sidebar */}
      <WatchlistSidebar />
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
