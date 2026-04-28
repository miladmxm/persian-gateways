export const mergeURL = (base: string, path: string): URL =>
  new URL(path, base);
