import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RateLimitingDocsLoading() {
  return (
    <div className="container py-10 max-w-4xl space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>

      <Card className="p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-7 w-[150px]" />
          <Skeleton className="h-4 w-[600px]" />
        </div>

        {/* Rate Limits Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[180px]" />
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Headers Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[160px]" />
          <div className="border rounded-lg">
            <div className="p-4 border-b">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border-b last:border-0">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[140px]" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-[80%]" />
            ))}
          </div>
        </div>

        {/* Test Section Skeleton */}
        <div className="space-y-4 pt-6 border-t">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[400px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-[160px]" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </Card>

      {/* Error Handling Skeleton */}
      <Card className="p-6 bg-muted/50 space-y-4">
        <Skeleton className="h-6 w-[180px]" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-[500px]" />
          <div className="bg-card p-4 rounded-md border">
            <Skeleton className="h-[100px] w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}