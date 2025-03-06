import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TestContainer } from "@/components/test/test-container";

export default function TestLoadingPage() {
  return (
    <TestContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-6 w-[400px]" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 h-full">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton
                      key={j}
                      className="h-6 w-16 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card className="p-6 bg-muted/50">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TestContainer>
  );
}