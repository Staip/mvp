export function getNextWeekdays(count: number): Date[] {
  const days: Date[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (days.length < count) {
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

export function formatDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Mock available slots — some marked busy for demo realism */
export function getTimeSlots(intervalMinutes: number): string[] {
  const step =
    intervalMinutes > 0 && intervalMinutes <= 60 ? intervalMinutes : 30
  const slots: string[] = []
  for (let hour = 8; hour < 16; hour++) {
    for (let min = 0; min < 60; min += step) {
      const h = String(hour).padStart(2, "0")
      const m = String(min).padStart(2, "0")
      slots.push(`${h}:${m}`)
    }
  }
  return slots.filter((_, index) => index % 4 !== 2)
}
