import { AppShell } from "@/components/app-shell"
import { LocaleProvider } from "@/components/locale-provider"
import { UserDataProvider } from "@/components/user-data-provider"

export default function HomePage() {
  return (
    <LocaleProvider>
      <UserDataProvider>
        <AppShell />
      </UserDataProvider>
    </LocaleProvider>
  )
}
