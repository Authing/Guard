// A successful send may reuse its completed user check for this form only.
export const createSentAccountCheck = () => {
  let sent: { value: string; expiresAt: number } | undefined
  return {
    mark: (value: string) => {
      sent = { value, expiresAt: Date.now() + 5 * 60 * 1000 }
    },
    matches: (value: string) =>
      !!sent && sent.value === value && sent.expiresAt > Date.now(),
    clear: () => {
      sent = undefined
    }
  }
}
