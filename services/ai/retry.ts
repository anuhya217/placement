export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delayMs?: number } = {}
): Promise<T> {
  const retries = options.retries ?? 3;
  const delayMs = options.delayMs ?? 400;
  let last: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw last;
}
