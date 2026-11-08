import { useSyncExternalStore } from "react"

const KEY = "mj.saved"
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]")
  } catch {
    return []
  }
}

let snapshot = read()

function write(next: string[]) {
  snapshot = next
  localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

export function toggleSaved(id: string) {
  const has = snapshot.includes(id)
  write(has ? snapshot.filter((x) => x !== id) : [id, ...snapshot])
  return !has
}

export function useSaved() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => snapshot,
  )
}

export function useIsSaved(id: string) {
  return useSaved().includes(id)
}
