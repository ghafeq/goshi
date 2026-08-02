# @goshi/foundations-icons

Shared icon **contract**: size tokens, stroke-width tokens (1px / 1.5px / 2px,
per the design requirement), and the `IconTokenProps` shape both platforms
implement. This package has **no dependency on Lucide** — it only defines the
tokens and TypeScript types.

Concrete `<Icon />` components live in:

- [`@goshi/consumer-react-native`](../../consumer/react-native) — wraps `lucide-react-native`
- [`@goshi/enterprise-nextjs`](../../enterprise/nextjs) — wraps `lucide-react`

Both consume `iconSize`, `iconStrokeWidth`, and `IconTokenProps` from here so
the two platforms expose an identical prop API even though the underlying
Lucide packages differ.
