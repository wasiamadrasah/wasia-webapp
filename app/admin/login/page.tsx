import { LoginForm } from "@/components/login-form"

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <LoginForm />
    </main>
  )
}

