import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocsLoading() {
  return (
    <div className="container py-10 max-w-5xl">
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-4 w-[600px]" />
      </div>

      <div className="grid gap-6 mt-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 w-[180px] mb-2" />
            <Skeleton className="h-4 w-[400px] mb-6" />
            <div className="grid gap-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-4" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <Skeleton className="h-8 w-[200px] mb-4" />
        <Card className="p-6 bg-muted/50">
          <Skeleton className="h-4 w-[450px] mb-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}