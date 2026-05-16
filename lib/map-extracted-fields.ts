import type { StepQuestion } from "@/lib/types"

/** Map ID scan fields onto form question ids (by id or label heuristics). */
export function valueForQuestion(
  q: StepQuestion,
  fields: Record<string, string>
): string | undefined {
  if (fields[q.id]?.trim()) return fields[q.id]

  const label = q.label.toLowerCase()
  if (/full.?name|ime i prezime|vollständig|nome completo/.test(label)) {
    return fields.fullName
  }
  if (
    /id card number|broj osobne|ausweisnummer|document number|broj iskaznic/.test(
      label
    )
  ) {
    return fields.idCardNumber
  }
  if (/birth|rođen|geburt|nascita/.test(label)) {
    return fields.dateOfBirth
  }
  if (/nationalit|državljan|staatsangeh|cittadin/.test(label)) {
    return fields.nationality
  }
  return undefined
}
