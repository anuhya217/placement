"use client";

import { useEffect, useState } from "react";

/** Avoid theme / Supabase UI flashes before mount. */
export function useSessionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
