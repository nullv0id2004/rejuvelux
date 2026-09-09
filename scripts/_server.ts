/**
 * Where the HTTP suites point, and a preflight that fails loudly.
 *
 * Two papercuts this exists to remove, both hit on 9 September 2026:
 *
 * 1. **The default was port 3315**, which is nobody's dev server. `npm run dev`
 *    serves 3000. Every suite had to be run with `BASE_URL=...` and it was not
 *    written down anywhere a reader would find it.
 *
 * 2. **An unreachable server produced no verdict.** `fetch` threw partway
 *    through, the script died on an unhandled rejection, and the run printed a
 *    stack trace with no "All checks passed" and no "N FAILED" line. Anything
 *    summarising a batch of suites by grepping for those words saw *nothing* —
 *    which reads as neither pass nor fail, and is the worst of the three.
 *
 * So: default to 3000, and refuse to start with one sentence when nothing
 * answers, rather than discovering it thirty checks later.
 */

export const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Confirm something is listening before any check runs.
 *
 * Exits 1 with an explanation rather than throwing, because a stack trace here
 * says "TypeError: fetch failed" and means "start the dev server".
 */
export async function requireServer(): Promise<void> {
  try {
    await fetch(BASE, { redirect: 'manual' });
  } catch {
    console.error(
      [
        '',
        `Nothing is answering on ${BASE}.`,
        '',
        '  Start it:      npm run dev',
        '  Or point here: BASE_URL=http://localhost:PORT npm run test:...',
        '',
      ].join('\n')
    );
    process.exit(1);
  }
}
