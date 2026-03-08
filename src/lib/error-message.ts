import type { ApiErrorResponse } from "@/types/api";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as ApiErrorResponse;

    if (
      typeof maybeError.message === "string" &&
      maybeError.message.trim().length > 0
    ) {
      return maybeError.message;
    }
  }

  return "Something went wrong. Please try again.";
}
