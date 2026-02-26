import { Skeleton } from "@/components/ui/skeleton";

export default function BecomePartnerLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-black py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-3/4 max-w-2xl bg-gray-800" />
          <Skeleton className="mx-auto h-6 w-1/2 max-w-xl bg-gray-800" />
        </div>
      </div>

      {/* Form section */}
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Progress steps */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  {i < 3 && <Skeleton className="h-1 w-16" />}
                </div>
              ))}
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-24 w-full rounded-lg border-2 border-dashed" />
            </div>

            <div className="flex justify-end gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
