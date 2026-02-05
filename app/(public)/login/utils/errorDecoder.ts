import { ERROR_MESSAGES } from "@/lib/constants";

export function decodeErrorMessage(error: string): string {
  const errorMessages = ERROR_MESSAGES.OAUTH;

  return errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;
}
