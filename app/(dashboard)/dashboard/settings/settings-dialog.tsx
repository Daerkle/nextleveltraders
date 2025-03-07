'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none">Darstellung</h4>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="compact-mode" className="flex flex-col space-y-1">
                  <span>Kompakter Modus</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Reduziert die Größe der UI-Elemente
                  </span>
                </Label>
                <Switch id="compact-mode" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="animations" className="flex flex-col space-y-1">
                  <span>Animationen</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Aktiviert oder deaktiviert UI-Animationen
                  </span>
                </Label>
                <Switch id="animations" defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none">Benachrichtigungen</h4>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="price-alerts" className="flex flex-col space-y-1">
                  <span>Preis-Alerts</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Benachrichtigungen bei Preisänderungen
                  </span>
                </Label>
                <Switch id="price-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="news-alerts" className="flex flex-col space-y-1">
                  <span>News-Alerts</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Benachrichtigungen bei wichtigen News
                  </span>
                </Label>
                <Switch id="news-alerts" defaultChecked />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium leading-none">Account Einstellungen</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                    <span>E-Mail Benachrichtigungen</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Erhalte wichtige Updates per E-Mail
                    </span>
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="public-profile" className="flex flex-col space-y-1">
                    <span>Öffentliches Profil</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Mache dein Profil für andere sichtbar
                    </span>
                  </Label>
                  <Switch id="public-profile" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
