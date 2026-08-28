import logger from "@/lib/logger";

export function captureError(err: Error) {
  // Minimal monitoring hook: log and optionally forward to external service
  logger.error("captured error", { err: String(err) });
  // TODO: integrate with Sentry, Datadog, or another provider
}
