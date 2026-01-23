export function toFileUrl(p: string) {
  return p.startsWith("http") ? p : p;
}

export function isLocalFile() {
  return window.location.protocol === "file:";
}

export function getAdjustedBaseUrl(): string {
  const { origin, pathname } = window.location;

  // Case: serving an HTML file directly (e.g., /report/index.html)
  if (pathname.endsWith(".html")) {
    const directoryPath = pathname.substring(0, pathname.lastIndexOf("/"));
    return `${origin}${directoryPath}`;
  }

  // Case: already a directory path (e.g., /report/ or /)
  if (pathname.endsWith("/")) {
    return `${origin}${pathname.slice(0, -1)}`; // strip trailing slash
  }

  // Fallback: just return origin + pathname
  return `${origin}${pathname}`;
}
