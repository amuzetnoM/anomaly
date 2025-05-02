import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reader Dashboard</h1>
        <Skeleton className="h-10 w-32" />
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="mb-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Progress Cards */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="pt-2">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notes Section Skeleton */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
