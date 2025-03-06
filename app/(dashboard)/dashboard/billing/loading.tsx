import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      {/* Subscription Status Card */}
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-24" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Card */}
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-3 items-center gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-32" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-56" /></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </CardContent>
      </Card>
    </div>
  );
}