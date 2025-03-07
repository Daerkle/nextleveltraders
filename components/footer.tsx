"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Moon, Send, Sun } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import Link from "next/link"
import { useTheme } from "next-themes"

export function FooterSection() {
  const { theme, setTheme } = useTheme()

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <img src="/logo.png" alt="NextLevelTraders Logo" className="h-8 w-auto object-contain" />
              <div className="flex items-baseline">
                <span className="font-heading font-bold text-xl">Next</span>
                <span className="font-heading font-light text-xl">Level</span>
                <span className="font-heading font-bold text-xl">Traders</span>
              </div>
            </Link>
            <p className="mb-6 text-muted-foreground">
              Transform your trading with AI-powered analysis and real-time market data.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/dashboard" className="block transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/docs" className="block transition-colors hover:text-primary">
                Documentation
              </Link>
              <Link href="/support" className="block transition-colors hover:text-primary">
                Support
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/legal/privacy" className="block transition-colors hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="block transition-colors hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/legal/imprint" className="block transition-colors hover:text-primary">
                Legal Notice
              </Link>
            </nav>
          </div>

          {/* Social & Theme */}
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <FaXTwitter className="h-4 w-4" />
                      <span className="sr-only">X</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on X</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="https://discord.gg/6AGuBbsnFR" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <FaDiscord className="h-4 w-4" />
                        <span className="sr-only">Discord</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join us on Discord</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Next Level Traders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
