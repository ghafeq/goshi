# 0001 — Monorepo tooling: pnpm workspaces + Turborepo + Changesets

## Status

Accepted (stage 1 — foundations).

## Context

The `goshi` repository was essentially empty before this stage (a `README`,
`LICENSE`, and a generic Node `.gitignore` — no existing app code, no
package manager choice, no build tooling). Goshi needs to:

- host many small, independently-versionable packages (foundations, and two
  platform-specific package families for Consumer/Enterprise)
- keep a shared foundation layer buildable and testable in isolation from
  platform packages that depend on it
- support two very different runtime targets (React Native for Consumer,
  Next.js for Enterprise) from one repo
- be ready for CI/CD, without CI/CD existing yet
- support versioned package releases later

Since there was no existing tooling to preserve, this decision starts from
a clean slate rather than adapting an incumbent choice.

## Decision

- **pnpm** as the package manager, via Corepack (`packageManager` field in
  the root `package.json`). Strict, content-addressed `node_modules` avoids
  phantom dependencies across ~12 packages; the `workspace:*` protocol
  makes internal dependencies explicit and safe to publish (Changesets
  rewrites `workspace:*` to real version ranges on publish).
- **pnpm workspaces**, scoped to `packages/*/*` (leaf packages only — see
  below) and `tooling/*` (internal, unpublished build tooling).
- **Turborepo** for task orchestration (`build`, `typecheck`, `lint`,
  `test`, `tokens:build`), with a task graph declared once in
  `turbo.json`. This is what makes "shared foundations built before
  platform packages that alias them" an enforced ordering rather than a
  convention — see `turbo.json`'s `dependsOn: ["^build", ...]`.
- **Changesets** for versioning (`.changeset/config.json`), so each package
  (`@goshi/foundations-tokens`, `@goshi/consumer-tokens`, etc.) can cut
  independent semver releases once there's something worth publishing.
- **TypeScript per package** (`tsconfig.json` extending a shared
  `tsconfig.base.json`), each package builds its own `dist/` via `tsc -p`.
  Not using TS project references / composite builds yet — with ~12 small
  packages and no circular graph, plain per-package `tsc` plus Turbo's task
  graph is simpler to reason about. Revisit if build times become a
  problem.
- **GitHub Actions** CI skeleton (`.github/workflows/ci.yml`): install →
  lint → typecheck → test → build, on every PR and push to `main`. No
  publish/release job yet — that's a follow-up once Changesets has
  something to publish.

## Package layout: leaf packages, not folder-per-package

`packages/foundations`, `packages/consumer`, `packages/enterprise` are
**organisational folders, not packages** — they have no `package.json`.
Only their children do (`packages/foundations/tokens`,
`packages/consumer/react-native`, etc.), matched by the workspace glob
`packages/*/*`. This keeps the brief's suggested folder tree
(`foundations/colors/`, `consumer/tokens/`, …) while giving every
independently-buildable, independently-versionable unit its own
`package.json`, own `dist/`, and own place in the Turborepo task graph.

Spacing/sizing/radius/elevation/motion are **not** separate packages (unlike
the brief's illustrative tree, which shows them as sibling folders under
`foundations/`). They're pure data — Style Dictionary source files under
`packages/foundations/tokens/src/primitive/*.json`, built by one pipeline
into one `@goshi/foundations-tokens` package. Six near-empty packages for six
JSON files would add publishing/versioning overhead with no matching
independent-release need — nobody will ever want `spacing` at a different
version than `radius`. `icons` **is** its own package
(`@goshi/foundations-icons`) because it ships actual runtime logic and types
(the icon prop contract), not just data.

## Consequences

- Contributors need Node ≥22.13 and Corepack enabled (`corepack enable`) —
  documented in the root README. That floor comes from `pnpm@11.18.0` itself
  (pinned in `packageManager`), which uses the `node:sqlite` built-in and
  refuses to run below Node 22.13 — not from anything in this codebase.
- `pnpm install` at the repo root installs and links everything; no
  per-package installs.
- Adding a new package means adding it under `packages/<mode>/<name>` (or
  `packages/<mode>/components/<name>` once component work starts) with its
  own `package.json` — the workspace glob picks it up automatically.
- Turborepo's remote caching (e.g. Vercel Remote Cache) isn't configured —
  local/CI caching only for now. Worth adding once CI run times matter.
