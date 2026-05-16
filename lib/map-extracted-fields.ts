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
  if (/oib|personal id/.test(label)) return fields.oib
  if (
    /id card number|broj osobne|ausweisnummer|document number|broj iskaznic/.test(
      label
    )
  ) {
    return fields.idCardNumber
  }
  if (/address|adresa|adresse|indirizzo|prebivalište|wohn/.test(label)) {
    return fields.address
  }
  if (/birth|rođen|geburt|nascita/.test(label)) {
    return fields.dateOfBirth
  }
  return undefined
}
