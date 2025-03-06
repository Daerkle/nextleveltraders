"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  BookOpenIcon,
  BrainCircuitIcon,
  GlobeIcon,
  HomeIcon,
  ListOrderedIcon,
  MessageSquareIcon,
  PanelRightIcon,
  Settings2Icon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Charts", href: "/dashboard/charts", icon: BarChart3Icon },
  { name: "Pivot-Analysen", href: "/dashboard/pivots", icon: PanelRightIcon },
  { name: "KI-Analyse", href: "/dashboard/ai-analysis", icon: BrainCircuitIcon },
  { name: "Watchlisten", href: "/dashboard/watchlists", icon: ListOrderedIcon },
  { name: "News", href: "/dashboard/news", icon: GlobeIcon },
  { name: "KI-Chat", href: "/dashboard/chat", icon: MessageSquareIcon },
  { name: "Wissen", href: "/dashboard/knowledge", icon: BookOpenIcon },
  { name: "Einstellungen", href: "/dashboard/settings", icon: Settings2Icon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-w-[220px] flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="p-6 pb-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <BarChart3Icon className="h-6 w-6 text-sidebar-primary" />
          <span>NextLevelTraders</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="flex flex-col gap-1 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}