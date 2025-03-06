import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Info } from "lucide-react";

export function TestEnvironmentInfoLoading() {
  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">System Status</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-medium">Features</h4>
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="grid gap-1.5 text-sm">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-4 p-2 bg-background/50 rounded-sm flex items-start gap-2">
          <Info className="w-3 h-3 mt-0.5 shrink-0" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </Card>
  );
}

export function TestEnvironmentInfoSkeleton() {
  return (
    <div className="animate-pulse">
      <TestEnvironmentInfoLoading />
    </div>
  );
}