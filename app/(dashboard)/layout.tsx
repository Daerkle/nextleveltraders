import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Seitenleiste */}
      <Sidebar />
      
      {/* Hauptbereich */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}