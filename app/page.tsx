import { AppShell } from "@/components/app-shell"
import { LocaleProvider } from "@/components/locale-provider"

export default function HomePage() {
  return (
    <LocaleProvider>
      <AppShell />
    </LocaleProvider>
  )
}
