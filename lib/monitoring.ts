// Production error monitoring for Shape's critical paths.
//
// When SHAPE_MONITORING_DSN is configured, server-side errors in the
// Shape API route and engine are reported to the monitoring backend
// (Sentry-compatible payload). When the DSN is unset, this module
// is a no-op so local development and unauthenticated previews don't
// emit telemetry.
//
// Use reportShapeError(err, context, extra?) at every catch site that
// sits on a request path. Without it, model failures, JSON parse
// errors, and provider outages disappear into a 500 with no alerting.

const DSN = process.env.SHAPE_MONITORING_DSN || "";
const RELEASE = process.env.SHAPE_RELEASE || "dev";
const ENVIRONMENT = process.env.SHAPE_ENVIRONMENT || process.env.NODE_ENV || "unknown";

export function isMonitoringEnabled(): boolean {
  return DSN !== "";
}

export interface ShapeErrorContext {
  context: string;
  release: string;
  environment: string;
  message: string;
  stack?: string;
  timestamp: string;
  [key: string]: unknown;
}

/**
 * Send a structured error report to the monitoring backend.
 *
 * Fire-and-forget. Failures inside the monitor itself MUST NOT crash the
 * caller — a request path that depends on its own alerting being healthy
 * is its own outage source.
 */
export async function reportShapeError(
  error: unknown,
  context: string,
  additionalData?: Record<string, unknown>,
): Promise<void> {
  if (!isMonitoringEnabled()) {
    return;
  }
  const payload: ShapeErrorContext = {
    context,
    release: RELEASE,
    environment: ENVIRONMENT,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    ...(additionalData ?? {}),
  };
  try {
    await fetch(DSN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Monitoring egress failures should not break the request path.
    // The local console line below survives regardless of DSN state
    // so a developer tailing logs still sees the original error.
    console.error(`[shape:monitor:dropped] ${context}:`, error);
  }
}
