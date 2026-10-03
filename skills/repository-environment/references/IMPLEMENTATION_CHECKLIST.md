# Repository Environment Implementation Checklist

Select bounded or deep scope before Phase 1. A healthy local amendment uses the affected configuration and mandatory invariants; full inventory is for new contracts, drift, contradictions, missing evidence or material toolchain/service/platform/security changes. Load only the applicable phases and preserve unaffected valid artifacts/evidence.

## Phase 1 — Inventory

- [ ] Read README, CONTRIBUTING, AGENTS and relevant docs.
- [ ] Inspect runtime/package-manager manifests and lockfiles.
- [ ] Inspect Mise/asdf/Nix/Bazel/version files.
- [ ] Inspect Docker/Compose/Dev Container files.
- [ ] Inspect CI and quality commands.
- [ ] Inspect scripts/Make/Just/Task wrappers.
- [ ] Identify required environment variable names without reading secret values.
- [ ] Identify host prerequisites, services, ports, supported OS/architectures.
- [ ] Build the environment graph and record contradictions.

## Phase 2 — Decide ownership

- [ ] Choose the canonical toolchain/version source.
- [ ] Preserve an equivalent healthy existing environment system.
- [ ] Choose one intentional JS package-manager/runtime strategy where applicable.
- [ ] Preserve native dependency lockfiles.
- [ ] Decide whether Compose is needed for local services.
- [ ] Decide whether OS-level isolation justifies a Dev Container.
- [ ] Define how secrets/local-only values remain outside versioned state.
- [ ] Identify the canonical local/CI quality gate.

## Phase 3 — Minimal implementation

- [ ] Make only environment-related changes.
- [ ] Pin project-relevant tool versions or lock their resolution.
- [ ] Avoid adding unused workstation tools.
- [ ] Add/align only meaningful canonical tasks.
- [ ] Wrap existing scripts rather than duplicate complex logic.
- [ ] Make bootstrap idempotent, repo-scoped and non-destructive.
- [ ] Add/align a non-destructive doctor/preflight.
- [ ] Document host prerequisites and bootstrap.
- [ ] Add agent rules against global host workarounds.
- [ ] Align CI to the repository contract when authorized.

## Phase 4 — Validate

- [ ] Install/resolve declared toolchain only as required.
- [ ] Resolve executable and effective version in the actual child process.
- [ ] Reuse durable bootstrap/doctor evidence only with unchanged runtime/version, lockfile, service and platform invariants and no observed drift; rerun invalidated or missing checks.
- [ ] Run relevant test/lint/typecheck/build/quality gates.
- [ ] Start/validate/stop repository-owned services only when needed and safe.
- [ ] Compare effective versions with declared canonical sources.
- [ ] Confirm no secret value was printed or versioned.
- [ ] Confirm no host-global configuration was changed.
- [ ] Confirm no unrelated Docker data or repository state was modified.
- [ ] Check `git status`.

## Phase 5 — Report

- [ ] Environment graph and contradictions.
- [ ] Canonical sources selected with rationale.
- [ ] Files changed.
- [ ] Exact operating commands.
- [ ] Current validation evidence.
- [ ] Reusable, invalidated and fresh evidence; assumptions/inferences and selected path.
- [ ] Blocked/skipped checks.
- [ ] Remaining prerequisites/risks.
- [ ] Migration and rollback notes if existing behavior changed.
