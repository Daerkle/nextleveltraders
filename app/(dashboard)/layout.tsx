import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen">
      {/* Seitenleiste */}
      <Sidebar />
      
      {/* Hauptbereich */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                }
              }}
              afterSignOutUrl="/"
            />
          </div>
        </header>
        
        {/* Hauptinhalt */}
        <div className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}