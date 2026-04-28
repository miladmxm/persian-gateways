export type Result<T> = [{ message: string; code?: number } | null, T | null];

export type ResultRequestInit = Result<{ html: string; url: string }>;
