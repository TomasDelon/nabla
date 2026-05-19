export function createSlug(text: string): string {
  return text
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function deduplicateSlugs(slugs: string[]): string[] {
  const counts = new Map<string, number>();
  return slugs.map((slug) => {
    const count = (counts.get(slug) ?? 0) + 1;
    counts.set(slug, count);
    return count === 1 ? slug : `${slug}-${count}`;
  });
}
