import { TodoApp } from "@/components/todo-app"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-start px-4 py-10 md:py-16">
      <div className="mb-8 text-center">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          MVP stack check
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          shadcn/ui + Supabase + Vercel — todos below are stored in your{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">todos</code>{" "}
          table.
        </p>
      </div>
      <TodoApp />
    </main>
  )
}
