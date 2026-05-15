# HAND_HELD_ONBOARDING_CONTRACT — Site Clinic

Status: active operating rule as of 2026-05-15.

## Core rule

Site Clinic onboarding is not just documentation.

The website must guide each visitor from their current state to a prepared next step:

1. Identify the visitor's starting point.
2. Show the correct path.
3. Explain what is free, trial-backed, paid, or customer-owned.
4. Produce a practical handoff packet.
5. Send the visitor to the next action: trial monitoring, scoped website build, developer integration, or proof review.

The docs remain the reference layer. The Start Here flow is the guided layer.

## Supported starting states

| Starting state | Guided route | Endpoint |
|---|---|---|
| No website yet | Website build foundation | GitHub/repo, project folder, deployment path, DNS plan, content inputs, monitoring handoff |
| Existing website | Monitoring foundation | Trial-backed dashboard, baseline scans, priority findings, next growth loop |
| Developer or agency | Developer foundation | Entitlement-aware API/MCP/scheduler/Blog Writer path, credentials, logs, proof scope |
| Proof-first buyer | Proof review | Evidence reviewed, verified/unverified claims understood, next buying question answered |

## Handoff packet

Every route should leave the user with:

- Account owner and project owner identified.
- Domain/DNS status understood.
- Repository or local project folder path identified.
- Deployment path selected.
- Monitoring target named.
- Launch-day measurement plan understood.
- Commercial boundary understood.
- Next action selected.

The Start Here page should also generate a copyable packet with:

- selected route
- owner/contact
- business/project
- website or domain
- primary goal
- recommended endpoint
- first action
- guided sequence
- readiness checklist
- commercial boundary
- notes or constraints

## Commercial boundary

The onboarding flow must preserve the entitlement contract:

- Public setup guidance, docs, prompts, and education are free.
- The 30-day trial starts the recurring Site Clinic operating layer for monitoring.
- API keys, MCP tools, scheduler execution, Blog Writer automation, connected-data operations, managed proof work, and optimization loops require entitlement.
- Customer-owned domains, repos, delivered public pages, exported files, and downloaded reports are not clawed back if a subscription ends.

Canonical source: `docs/site-truth/ENTITLEMENT_CONTRACT.md`.

## UX requirement

The Start Here page should feel like a guided intake, not a documentation index.

It should answer:

- "Where am I starting?"
- "What do I do first?"
- "What do I need before the next step?"
- "What does Site Clinic do next?"
- "What is free, trial-backed, or paid?"

## Implementation rule

Onboarding route copy should live in shared structured data where practical, so docs, pages, and future intake tooling can stay aligned.

Current source:

- `src/lib/clientFoundation.ts`
- `src/components/StartHereWizard.tsx`
- `src/app/start-here/page.tsx`
