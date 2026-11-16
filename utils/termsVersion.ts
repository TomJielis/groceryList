// Whether the terms must be accepted (again): the accepted version is older than the current one. A newer one counts
// as accepted too (accepted in a newer app while this site still has the old version): asking again would set it
// back. Something that isn't a version ("", "beta") is never accepted.
export function termsOutdated(accepted: string, current: string): boolean {
  if (accepted === current) return false;
  const parts = (v: string) => (/^\d+(\.\d+)*$/.test(v.trim()) ? v.trim().split('.').map(Number) : null);
  const have = parts(accepted);
  const need = parts(current);
  if (!have) return true;
  if (!need) return false;
  for (let i = 0; i < Math.max(have.length, need.length); i++) {
    const a = have[i] ?? 0;
    const b = need[i] ?? 0;
    if (a !== b) return a < b;
  }
  return false;
}
