"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, createContext, useContext } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

import {
  AtomIcon,
  BarChart3Icon,
  BookOpenIcon,
  GlobeIcon,
  HomeIcon,
  MessageSquareIcon,
  PanelRightIcon,
  Settings2Icon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Charts", href: "/dashboard/charts", icon: BarChart3Icon },
  { name: "Pivot-Analysen", href: "/dashboard/pivots", icon: PanelRightIcon },
  { name: "KI-Analyse", href: "/dashboard/ki", icon: AtomIcon },
  { name: "News", href: "/dashboard/news", icon: GlobeIcon },
  { 
    name: "KI-Chat", 
    href: "/dashboard/chat", 
    icon: ({ className, isActive }: { className?: string, isActive?: boolean }) => (
      <>
        <img
          src="/nexus.png"
          alt="Nexus Logo"
          className={cn(
            "h-5 w-5 object-contain flex-shrink-0 dark:hidden",
            className,
            isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
          )}
        />
        <img
          src="/nexus_white.png"
          alt="Nexus Logo"
          className={cn(
            "h-5 w-5 object-contain flex-shrink-0 hidden dark:block",
            className,
            isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
          )}
        />
      </>
    )
  },
  { name: "Wissen", href: "/dashboard/knowledge", icon: BookOpenIcon },
  { name: "Einstellungen", href: "/dashboard/settings", icon: Settings2Icon },
];

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      <SidebarBody />
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.div
      className={cn(
        "h-screen sticky top-0 flex-shrink-0 hidden md:flex md:flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-width overflow-hidden",
        className
      )}
      animate={{
        width: animate ? (open ? "clamp(250px, 20vw, 400px)" : "clamp(64px, 5vw, 80px)") : "clamp(250px, 20vw, 400px)",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="px-6 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <>
            <Image
              src="/logo.png"
              alt="NextLevelTraders Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain hidden dark:block"
            />
            <Image
              src="/logo_weißbg.png"
              alt="NextLevelTraders Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain dark:hidden"
            />
          </>
          {open && (
            <div className="flex items-baseline">
              <span className="font-heading font-bold text-xl">Next</span>
              <span className="font-heading font-light text-xl">Level</span>
              <span className="font-heading font-bold text-xl">Traders</span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="flex flex-col gap-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {item.name === "KI-Chat" ? (
                  <>
                    <Image
                      src="/nexus.png"
                      alt="Nexus Logo"
                      width={20}
                      height={20}
                      className={cn(
                        "h-5 w-5 object-contain flex-shrink-0 dark:hidden",
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                      )}
                    />
                    <Image
                      src="/nexus_white.png"
                      alt="Nexus Logo"
                      width={20}
                      height={20}
                      className={cn(
                        "h-5 w-5 object-contain flex-shrink-0 hidden dark:block",
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                      )}
                    />
                  </>
                ) : (
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                    )}
                    aria-hidden="true"
                  />
                )}
                {open && (
                  <motion.span
                    animate={{
                      opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="whitespace-pre group-hover:translate-x-1 transition duration-150"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-sidebar text-sidebar-foreground w-full border-b",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="NextLevelTraders Logo"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
        <span className="text-lg font-semibold">
          NextLevelTraders
        </span>
      </div>
      <IconMenu2
        className="text-sidebar-foreground"
        onClick={() => setOpen(!open)}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-sidebar text-sidebar-foreground p-6 z-[100] flex flex-col",
              className
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <BarChart3Icon className="h-6 w-6 text-sidebar-primary" />
                <span>NextLevelTraders</span>
              </div>
              <IconX
                className="text-sidebar-foreground"
                onClick={() => setOpen(!open)}
              />
            </div>
            
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.name === "KI-Chat" ? (
                      <>
                        <Image
                          src="/nexus.png"
                          alt="Nexus Logo"
                          width={20}
                          height={20}
                          className={cn(
                            "h-5 w-5 object-contain flex-shrink-0 dark:hidden",
                            isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                          )}
                        />
                        <Image
                          src="/nexus_white.png"
                          alt="Nexus Logo"
                          width={20}
                          height={20}
                          className={cn(
                            "h-5 w-5 object-contain flex-shrink-0 hidden dark:block",
                            isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                          )}
                        />
                      </>
                    ) : (
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};