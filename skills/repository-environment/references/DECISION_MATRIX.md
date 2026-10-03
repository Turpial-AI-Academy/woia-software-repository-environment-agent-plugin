# Repository Environment Decision Matrix

Use this after discovery. Evidence from the repository wins over cosmetic uniformity.

## 1. Existing environment manager

| Situation | Default decision |
|---|---|
| Healthy Nix flake/devShell, Bazel toolchain, integral Dev Container, asdf, or equivalent corporate system | Preserve it; fix inconsistencies inside the existing standard. Do not add Mise as a second manager. |
| Existing Mise contract is healthy | Preserve and align it. |
| No reproducible toolchain contract exists and project-level tool/version management is needed | Consider Mise as the default cross-platform toolchain/task layer. |
| Only one trivial runtime version needs declaration | Prefer the smallest adequate solution; do not add heavy OS isolation. |

## 2. JavaScript runtime/package manager

| Repository evidence | Default decision |
|---|---|
| Existing pnpm repository works correctly | Preserve Node + pnpm; align versions/lockfiles/tasks. |
| Existing Bun repository works correctly | Preserve Bun; align versions/lockfiles/tasks. |
| Existing npm/yarn repository is healthy | Do not migrate merely to conform to Turpial preferences; preserve unless a technical reason justifies change. |
| Greenfield JS/TS, compatibility/maturity prioritized | Consider Mise + Node + pnpm. |
| Greenfield JS/TS, integrated Bun workflow deliberately chosen and dependencies verified | Consider Mise + Bun. |
| Node + pnpm + Bun overlap with no explicit reason | Resolve to one intentional application dependency/runtime strategy. |

Technical reasons for migration may include material simplification, relevant performance improvement, removal of redundant tooling, better CI, or an explicit architecture decision. Record the reason.

## 3. Other ecosystems

- Python: preserve the adopted reproducible mechanism, e.g. `pyproject.toml` plus `uv.lock`/Poetry lock; do not migrate package managers casually.
- Rust: preserve `Cargo.toml`, `Cargo.lock`, and required official toolchain descriptors.
- Go: preserve `go.mod` and `go.sum`.
- Java/other ecosystems: preserve native dependency/build contracts and declare only project-relevant external toolchain requirements.

## 4. Services

Use Docker Compose for project-owned databases, queues, emulators, object stores, and similar local services when containerization is appropriate.

Require safe defaults:
- predictable project scope/names when useful;
- healthchecks where practical;
- documented persistent volumes;
- no destructive volume/system pruning;
- ephemeral test services separated from persistent development state when needed.

## 5. Dev Container

Add a Dev Container only when OS-level reproducibility materially helps, such as:
- difficult native dependencies;
- strong Linux coupling;
- recurring Windows/macOS/Linux drift;
- complex onboarding;
- heterogeneous teams;
- need for stronger host isolation.

Do not add a Dev Container merely to pin Node or Python.

## 6. Secrets and environment values

- deterministic public values may live in repository configuration;
- non-secret local values may use an ignored local mechanism;
- secret values remain external/ignored;
- version only names and safe empty examples such as `.env.example`.

## 7. Canonical task surface

Evaluate, do not blindly create:

~~~text
bootstrap
doctor
install
dev
test
test:local
lint
format
typecheck
build
quality
quality:ci
services:up
services:down
services:status
~~~

Prefer stable outer commands that invoke existing implementation rather than duplicate it.
