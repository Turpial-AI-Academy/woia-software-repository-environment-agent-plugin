---
name: repository-environment
description: Audits and establishes reproducible repository development environments. Use when inspecting or standardizing toolchains, package managers, lockfiles, canonical tasks, local services, CI environment contracts, Dev Containers, environment drift, or onboarding without relying on accidental host configuration.
license: MIT
compatibility: Works with repositories on Windows, Linux, and macOS; validation depends on the target repository's actual tools and services.
metadata:
  author: Turpial AI Academy
  version: "0.5.1"
---

# repository-environment

## Operating flow

~~~text
DISCOVER -> DECIDE -> IMPLEMENT -> VALIDATE -> REPORT
~~~

## Purpose

Make a repository's development environment explicit, reproducible, portable, and operable by humans, agents, editors, and CI without depending on accidental host configuration.

The objective is reproducibility, not adoption of any particular tool.

## Non-negotiable rules

- Inspect the affected repository environment and CI contract before changing files; choose bounded or deep discovery from the evidence and risk below.
- Preserve a healthy existing reproducibility system. Do not introduce Mise, a new package manager, a Dev Container, or another layer merely for uniformity.
- Never change global PATH, shell profiles, global runtime defaults, global Git configuration, Docker Desktop configuration, or host-wide package managers to make the repository pass.
- Never read or print secret values. Work only with secret names, safe examples, and approved secret mechanisms.
- Never destroy persistent Docker volumes, unrelated containers, databases, or local state as part of bootstrap, diagnosis, or normal cleanup.
- Do not upgrade versions merely because newer versions exist.
- Prefer the smallest migration that creates one declared way to install, one canonical way to execute, one way to verify, and concise operating documentation.

## Discover

### Select scope and evidence

Use a bounded fast path for a local, understood amendment to a healthy existing environment graph, configuration or onboarding artifact. Anchor the repository, branch, source HEAD and changed surface; locate the authoritative version sources, canonical commands and durable bootstrap/doctor evidence. Inspect only the affected configuration and its required cross-cutting invariants. Preserve unrelated valid configuration and evidence.

Take the deep path for a new environment contract, missing durable required evidence, contradictory declarations, failed invariants or environment drift; runtime/toolchain/package-manager/version changes, lockfile resolution, services, OS/architecture or CI execution changes; public contracts, persisted data/migrations, secrets/auth/security, signing/trust or deployment/rollback/availability risk. A local documentation edit cannot exempt an affected invariant from validation.

Load [REPOSITORY_ENVIRONMENT_STANDARD.md](references/REPOSITORY_ENVIRONMENT_STANDARD.md) and [DECISION_MATRIX.md](references/DECISION_MATRIX.md) when a policy choice, migration, unhealthy convention or deep-path trigger requires them. Load the implementation checklist and assets only for the selected work. Detailed references remain authoritative; a healthy bounded amendment does not require replaying a whole-repository inventory.

For deep discovery, inventory, as applicable:

- README/CONTRIBUTING/AGENTS documentation;
- `mise.toml`, `mise.lock`, `.tool-versions`, `.nvmrc`, `.node-version`, `.python-version`, Rust toolchain files;
- `package.json` and JS package-manager lockfiles;
- `pyproject.toml`, `uv.lock`, Poetry/requirements files;
- `Cargo.toml`/`Cargo.lock`, `go.mod`/`go.sum`, Java/build tool manifests;
- Dockerfiles, Compose files, Dev Containers, Make/Just/Task files and scripts;
- CI workflows and version declarations;
- `.env.example` and names of required variables, without reading secret values;
- local services, required ports, native/host prerequisites, supported OS/architectures.

Build an internal environment graph:

~~~text
tool/runtime -> version source -> installer/manager -> lockfile -> canonical tasks -> services -> CI consumer
~~~

Record contradictions before editing.

## Decide

Use the decision matrix when canonical ownership or migration policy is affected; otherwise retain the established decision.

Choose canonical ownership deliberately:

- toolchain/CLI versions: the healthy existing system, or Mise when no equivalent standard already exists and it is appropriate;
- application dependencies: native ecosystem manifest + lockfile;
- local services: Docker Compose when appropriate;
- OS-level reproducibility: Dev Container only when native dependencies or OS parity justify the extra layer;
- secrets: external secret mechanism or ignored local file, never versioned values;
- CI: the same repository contract and quality gates whenever viable.

For an existing repository, preserve the working package manager/runtime strategy unless there is a documented technical reason to migrate.

For greenfield JavaScript repositories, choose one package-management/runtime strategy before implementation rather than starting with overlapping Node/pnpm/Bun contracts.

## Implement

Load [IMPLEMENTATION_CHECKLIST.md](references/IMPLEMENTATION_CHECKLIST.md) for implementation and apply only the phases invalidated by the selected change.

Make the smallest authorized change. Common outcomes may include:

- create or align a project-owned toolchain declaration;
- add/align a toolchain lock when reproducibility requires it;
- retain native dependency lockfiles;
- expose canonical tasks that wrap existing scripts instead of duplicating logic;
- add a non-destructive `doctor`/preflight;
- document host prerequisites and onboarding;
- align CI to the same canonical quality gate;
- add Compose task wrappers for repository-owned services;
- add a Dev Container only when the repository actually needs OS-level isolation;
- add agent instructions that prohibit host-global workarounds.

Assets under [assets/README.md](assets/README.md) are starting points, not universal files to copy blindly.

## Validate

Validate from a clean child process and use the repository's real contract. Resolve the actual executable and verify its effective version inside the process that runs the affected command; do not infer it from the parent shell, PATH or a previous session. Reuse durable bootstrap/doctor evidence only while its declared runtime/version, dependency lock, service and platform invariants remain unchanged and observed resolution shows no drift. Install or repeat setup only when prerequisites changed or evidence is missing/invalidated.

Select the existing canonical runner. For a repository that already uses Mise, applicable commands may include:

~~~text
mise install
mise run doctor
mise run quality
~~~

Run the affected service/test/build/CI-equivalent gates and all mandatory cross-cutting invariants. Classify evidence as reusable, invalidated, freshly executed/observed, or assumptions/inferences. Rerun invalidated checks; a prior PASS or prose recollection is not current execution proof. Deep changes still require all relevant validation.

Check `git status` afterward and verify that the work did not:

- alter host-global configuration;
- modify unrelated repositories;
- create/version secrets;
- destroy persistent data;
- silently migrate package managers;
- introduce contradictory version sources.

Do not report a skipped or unavailable check as passed.

## Report

Report:

1. environment graph discovered;
2. contradictions found;
3. canonical sources selected and why;
4. files changed;
5. exact bootstrap/development/quality/service commands;
6. validation actually executed and results;
7. checks skipped or blocked;
8. remaining host prerequisites or risks;
9. migration/rollback notes when an existing contract changed.
10. bounded/deep path selected, evidence reused or invalidated, fresh observations, and remaining uncertainty.

When satisfying ASPS `repository-environment/v1`, amend the existing `docs/project/10-REPOSITORY-ENVIRONMENT.md` and prove its environment gate. This optional interoperability output does not require ASPS to use the capability standalone.

## Detailed references

- [Repository Environment Standard](references/REPOSITORY_ENVIRONMENT_STANDARD.md)
- [Decision Matrix](references/DECISION_MATRIX.md)
- [Implementation Checklist](references/IMPLEMENTATION_CHECKLIST.md)
