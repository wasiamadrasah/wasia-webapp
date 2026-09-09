export default function ThemeAppearancePage() {
  return (
    <div className="w-full space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Theme & Appearance</h1>
        <p className="text-muted-foreground">
          Theme controls will be configured here. This section is ready for your next implementation step.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
        Planned options: color tokens, section backgrounds, typography scale, and reusable visual presets.
      </div>
    </div>
  )
}
