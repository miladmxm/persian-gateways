export type Result<T> = [
  { message: string; code?: number | string } | null,
  T | null,
];

export type ResultRequestInit = Result<{ html: string; url: string }>;
