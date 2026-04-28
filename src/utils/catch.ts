import type { Result } from "../modules/types.ts";

export const catchError = (error: unknown): Result<null> => {
  if (error instanceof Error) {
    return [{ message: error.message, code: 500 }, null];
  } else {
    return [{ message: "internal server error", code: 500 }, null];
  }
};
