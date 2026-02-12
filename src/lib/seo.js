const FALLBACK_SITE_URL = "https://bnsinfo.in";

export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXTAUTH_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "string") continue;
    const normalized = candidate.trim().replace(/\/+$/, "");
    if (!normalized) continue;
    try {
      return new URL(normalized).origin;
    } catch {
      continue;
    }
  }

  return FALLBACK_SITE_URL;
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
