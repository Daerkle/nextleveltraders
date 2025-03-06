"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTest } from "@/hooks/use-test-context";
import type { TestMode, TestFeature } from "@/types/test";
import { 
  TEST_MODES,
  TEST_MODE_LABELS,
  TEST_FEATURES,
  TEST_FEATURE_LABELS,
  TEST_FEATURE_DESCRIPTIONS,
} from "@/lib/test/constants";
import { Settings, Info } from "lucide-react";

export function TestConfig() {
  const {
    mode,
    features,
    debug,
    setMode,
    toggleFeature,
    resetFeatures,
    toggleDebug,
  } = useTest();

  const handleModeChange = (value: string) => {
    const newMode = value as TestMode;
    setMode(newMode);
  };

  return (
    <Card className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">Test-Konfiguration</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFeatures}
          className="text-xs"
        >
          Zurücksetzen
        </Button>
      </div>

      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Modus</label>
          <Select
            value={mode}
            onValueChange={handleModeChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(TEST_MODES) as [string, TestMode][]).map(([, value]) => (
                <SelectItem key={value} value={value}>
                  {TEST_MODE_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Features</label>
          <div className="space-y-3">
            {(Object.entries(TEST_FEATURES) as [string, TestFeature][]).map(([, value]) => (
              <div key={value} className="flex items-start space-x-3">
                <Switch
                  checked={features.includes(value)}
                  onCheckedChange={() => toggleFeature(value)}
                />
                <div className="flex-1 space-y-1">
                  <div className="text-sm font-medium">
                    {TEST_FEATURE_LABELS[value]}
                  </div>
                  {TEST_FEATURE_DESCRIPTIONS[value] && (
                    <p className="text-xs text-muted-foreground">
                      {TEST_FEATURE_DESCRIPTIONS[value]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debug Mode */}
        <div className="pt-4 border-t">
          <div className="flex items-start space-x-3">
            <Switch
              checked={debug}
              onCheckedChange={toggleDebug}
            />
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium">Debug Modus</div>
              <p className="text-xs text-muted-foreground">
                Zeigt zusätzliche Debug-Informationen in der Konsole an
              </p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 pt-4 border-t">
          <Info className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            Diese Einstellungen werden lokal gespeichert und bleiben auch nach
            einem Seitenneuladen erhalten. Ein Zurücksetzen entfernt alle
            aktivierten Features.
          </p>
        </div>
      </div>
    </Card>
  );
}

interface TestConfigModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TestConfigModal({ open, onOpenChange }: TestConfigModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test-Konfiguration</DialogTitle>
          <DialogDescription>
            Verwalten Sie die Test-Einstellungen für die Entwicklungsumgebung.
          </DialogDescription>
        </DialogHeader>
        <TestConfig />
      </DialogContent>
    </Dialog>
  );
}

export function TestConfigButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={() => setOpen(true)}
      >
        <Settings className="w-4 h-4 mr-2" />
        Test-Einstellungen
      </Button>
      <TestConfigModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}