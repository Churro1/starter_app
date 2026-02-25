export function isSessionActive(expiresAt: number | null | undefined, nowInSeconds = Date.now() / 1000) {
  if (!expiresAt) {
    return false;
  }

  return expiresAt > nowInSeconds;
}
