# Architecture decisions

Lightweight ADRs (Architecture Decision Records) for Goshi. Each one is
Context → Decision → Consequences. New decisions get a new numbered file;
existing ones aren't rewritten — if a decision changes, add a new ADR that
supersedes it and say so.

| # | Decision |
|---|---|
| [0001](0001-monorepo-tooling.md) | Monorepo tooling: pnpm workspaces + Turborepo + Changesets |
| [0002](0002-token-naming-convention.md) | Token naming convention (`con.*` / `ent.*`) |
| [0003](0003-token-pipeline-style-dictionary.md) | Token pipeline: Style Dictionary + a custom nested-output format |
| [0004](0004-figma-sync-status.md) | Figma sync status — why token values are placeholders, and how to replace them |
| [0005](0005-consumer-enterprise-sharing-model.md) | Consumer/Enterprise sharing & override model |
