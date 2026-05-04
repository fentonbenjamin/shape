# Not Magic PR Smoke Conflict

This document is intentionally contradictory so the Not Magic GitHub integration
has a safe PR artifact to review.

## Claimed Decision

Ship this change as release-ready.

## Supporting Notes

- The UI build passes locally.
- The README-only config change should not affect runtime behavior.
- The PR is advisory and safe to merge from a build perspective.

## Unresolved Reliance

- Rollback ownership is not assigned.
- Observability is incomplete because the relevant alarms are muted.
- Production-scale behavior is unproven because the test used only a staging-sized sample.
- No owner has accepted responsibility for restoring service if the release causes user-visible degradation.

## Expected Not Magic Reading

The PR can rely on build safety, but it should not rely on release readiness.
The unresolved scopes should include ownership, observability, rollback, and production-scale evidence.
