import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentSettingsComingSoonPage() {
  return (
    <div className="w-full space-y-6 pb-12">
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle>Student Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-12 text-center">
          <h2 className="text-xl font-semibold text-foreground">Coming Soon</h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
            Student specific configuration settings are currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
