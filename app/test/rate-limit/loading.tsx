import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RateLimitTestLoading() {
  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Rate Limit Status Skeleton */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          {/* Response Skeletons */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/5"
            >
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}