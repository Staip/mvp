export type StepDocumentSnapshot = {
  stepId: string
  stepTitle: string
  documentName: string
  questions: Array<{ id: string; label: string }>
  answers: Record<string, string>
}

export type StepUploadSnapshot = {
  stepId: string
  stepTitle: string
  documentName: string
  fields: Record<string, string>
}

type Store = {
  processId: string | null
  documents: StepDocumentSnapshot[]
  uploads: StepUploadSnapshot[]
}

const KEY = "splitflow-application-data"

function emptyStore(): Store {
  return { processId: null, documents: [], uploads: [] }
}

export function loadApplicationData(): Store {
  if (typeof window === "undefined") return emptyStore()
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as Store
    return {
      processId: parsed.processId ?? null,
      documents: parsed.documents ?? [],
      uploads: parsed.uploads ?? [],
    }
  } catch {
    return emptyStore()
  }
}

function persist(store: Store) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(KEY, JSON.stringify(store))
}

export function clearApplicationData() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(KEY)
}

export function setApplicationProcessId(processId: string) {
  const store = loadApplicationData()
  if (store.processId === processId) return
  persist({ processId, documents: [], uploads: [] })
}

export function saveDocumentSnapshot(
  processId: string,
  snapshot: StepDocumentSnapshot
) {
  const store = loadApplicationData()
  const documents = store.processId === processId ? [...store.documents] : []
  const idx = documents.findIndex((d) => d.stepId === snapshot.stepId)
  if (idx >= 0) documents[idx] = snapshot
  else documents.push(snapshot)
  persist({ processId, documents, uploads: store.processId === processId ? store.uploads : [] })
}

export function saveUploadSnapshot(
  processId: string,
  snapshot: StepUploadSnapshot
) {
  const store = loadApplicationData()
  const uploads = store.processId === processId ? [...store.uploads] : []
  const idx = uploads.findIndex((u) => u.stepId === snapshot.stepId)
  if (idx >= 0) uploads[idx] = snapshot
  else uploads.push(snapshot)
  persist({
    processId,
    documents: store.processId === processId ? store.documents : [],
    uploads,
  })
}
