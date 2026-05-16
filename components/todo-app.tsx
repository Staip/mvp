"use client"

import { useCallback, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type TodoRow = {
  id: string
  title: string
  done: boolean
  created_at: string
}

export function TodoApp() {
  const [items, setItems] = useState<TodoRow[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    const { data, error: err } = await supabase
      .from("todos")
      .select("id,title,done,created_at")
      .order("created_at", { ascending: false })

    if (err) {
      setError(err.message)
      setItems([])
    } else {
      setItems((data as TodoRow[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    setBusy(true)
    setError(null)
    const { data, error: err } = await supabase
      .from("todos")
      .insert({ title: trimmed, done: false })
      .select("id,title,done,created_at")
      .single()

    setBusy(false)

    if (err) {
      setError(err.message)
      return
    }

    if (data) {
      setItems((prev) => [data as TodoRow, ...prev])
      setTitle("")
    }
  }

  async function toggleDone(row: TodoRow) {
    setError(null)
    const next = !row.done
    setItems((prev) =>
      prev.map((t) => (t.id === row.id ? { ...t, done: next } : t))
    )

    const { error: err } = await supabase
      .from("todos")
      .update({ done: next })
      .eq("id", row.id)

    if (err) {
      setError(err.message)
      void load()
    }
  }

  async function remove(row: TodoRow) {
    setError(null)
    setItems((prev) => prev.filter((t) => t.id !== row.id))

    const { error: err } = await supabase.from("todos").delete().eq("id", row.id)

    if (err) {
      setError(err.message)
      void load()
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Todos</CardTitle>
        <CardDescription>
          Add items to verify Supabase persists data (check the Table Editor).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={addTodo} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task…"
            disabled={busy}
            autoComplete="off"
            className="flex-1"
          />
          <Button type="submit" disabled={busy || !title.trim()}>
            Add
          </Button>
        </form>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((row) => (
              <li
                key={row.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={row.done}
                  onChange={() => void toggleDone(row)}
                  className={cn(
                    "size-4 shrink-0 rounded border-input accent-primary"
                  )}
                  aria-label={row.done ? "Mark as not done" : "Mark as done"}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 text-sm",
                    row.done && "text-muted-foreground line-through"
                  )}
                >
                  {row.title}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => void remove(row)}
                  aria-label={`Delete ${row.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
