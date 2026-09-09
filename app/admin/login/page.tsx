import { LoginForm } from "@/components/login-form"
import { Outfit } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export default function AdminLoginPage() {
  return (
    <main className={`${outfit.className} flex min-h-dvh flex-col justify-center bg-muted/40 px-4 py-8 text-foreground sm:px-6 lg:px-8`}>
      <LoginForm />
    </main>
  )
}
