import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SplitFlow — Bureaucracy Copilot for Split",
  description:
    "AI-powered step-by-step guides for government processes in Split, Croatia.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
