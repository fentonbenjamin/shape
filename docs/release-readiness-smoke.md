# Release Readiness Smoke Test

This PR intentionally looks merge-ready while withholding the authority needed
to rely on it as release-ready.

## Claimed Decision

Ship the change. The build passed, the config is small, and the branch is ready
to merge.

## What Can Be Relied On

- Build safety: the application builds successfully.
- Runtime scope: this PR only adds advisory configuration and documentation.

## What Must Not Be Relied On

- Release readiness is not granted by the passing build.
- Rollback safety is not granted because no rollback owner is assigned.
- Observability coverage is not granted because the relevant alarms are muted.
- Production-scale safety is not granted because no production-sized replay or
  load evidence is attached.
- Recovery ownership is not granted because no actor accepted responsibility for
  restoring service if the release causes user-visible degradation.

## Expected Not Magic Result

The Chamber should preserve the split:

- `build_safety` may be relied on.
- `release_readiness` must remain unadmitted.
- unresolved scopes should include `ownership`, `observability`, `rollback`,
  and `production_scale`.

The point of this PR is the conflict between appearance and authority: a passing
build looks like permission to ship, but the contract does not grant release
readiness.
