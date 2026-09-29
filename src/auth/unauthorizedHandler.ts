// apiFetch (client.ts) is a plain function, not a component or hook, so
// it can't call useAuth().logout() directly when it sees a 401. This lets
// AuthProvider register its own logout as a callback apiFetch can reach
// for instead, without threading auth context through every API call.
let handler: (() => void) | null = null

export function setUnauthorizedHandler(fn: (() => void) | null): void {
  handler = fn
}

export function notifyUnauthorized(): void {
  handler?.()
}
