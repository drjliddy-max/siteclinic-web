# ENTITLEMENT_CONTRACT — Site Clinic

Status: canonical foundational rule for public copy, onboarding docs, terms, Site Monitor, API, MCP, scheduler, and Blog Writer.

## The Rule

The website can be portable. The operating system around the website is the subscription.

Site Clinic can help a customer create, improve, deploy, or monitor a website. Customer-owned static assets are not the paid product after delivery. The paid product is the continuing Site Clinic operating layer: monitoring, evidence, scans, connected data, API/MCP execution, scheduler workflows, Blog Writer operations, and managed proof.

## Not Gated / Not Revoked

- Public marketing pages, docs, and setup guides.
- Customer-owned domain and registrar account.
- Customer-owned GitHub repository or exported project files.
- Public pages already delivered to a customer-controlled host or repository.
- Customer-owned Vercel, Google, Stripe, analytics, or email accounts.
- Downloaded or exported reports, proofs, launch notes, and documentation already delivered.

## Trial-Included / Temporarily Entitled

- Account creation.
- First monitored site setup when offered by the plan or onboarding flow.
- Site Monitor dashboard access during the active trial.
- Initial public-data scan, baseline, prioritization, and proof view.
- Trial API, MCP, scheduler, or Blog Writer access only when the plan and entitlement state enable it.
- Demo or setup assistance only where explicitly offered.

## Paid / Gated / Revocable

- Site Monitor dashboards and live evidence history.
- Recurring scans, alerts, rescans, issue tracking, verification loops, and proof generation.
- Connected-data sections and syncs, including Search Console, GA4, AI visibility, citations, and integrations.
- API keys, API quotas, API explorer access, webhooks, and protected API execution.
- MCP tool authorization and execution, including crawler, scheduler, proof, remediation, and content operations.
- Scheduler-owned jobs and recurring workflows.
- Blog Writer future queue processing, publish dispatch, proof verification, and managed content workflows.
- Managed reports, briefs, proof artifacts, and future evidence generation.
- Site Clinic-hosted previews, managed environments, and future optimization loops.

## Cancellation / Failed Payment Enforcement

Stripe reports billing events. Site Clinic translates billing state into entitlement state. Protected services must check entitlement before execution.

Canonical entitlement states:

- `trialing`
- `active`
- `past_due`
- `canceled`
- `unpaid`
- `expired`

Protected execution must fail closed when entitlement is inactive, expired, over quota, or missing. The expected denial shape is `403 entitlement_required` or `403 subscription_inactive`, with a clear upgrade or billing recovery path.

## Architecture

Valuable local tools can be portable, but valuable execution must be permissioned.

- Downloaded docs and source files cannot be clawed back.
- API keys, MCP auth tokens, scheduler jobs, server-side crawler actions, Blog Writer dispatch, proof verification, and connected dashboard data can be revoked.
- Any local MCP, CLI, package, or agent helper that performs protected work must check in with Site Clinic before doing that work.
- High-value logic should remain server-side when possible.

## Implementation Invariant

Every protected surface must call a shared entitlement check before useful execution:

1. Is the account known?
2. Is the subscription state active or valid trial?
3. Is the site entitled?
4. Is the requested capability enabled for the plan?
5. Is quota available?
6. Is the action allowed for the current role and environment?

Public copy, Stripe billing state, account entitlement state, Site Monitor access, API/MCP execution, scheduler jobs, and Blog Writer operations must agree. A customer-visible mismatch is a trust failure.
