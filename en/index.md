---
layout: home

hero:
  name: LoopX Book
  text: From control-plane protocols to shippable development
  tagline: "A bilingual Dev Book for external developers: understand LoopX state, authority, and Turns, then connect an existing project or contribute to LoopX."
  actions:
    - theme: brand
      text: Start with foundations
      link: /en/chapters/01-from-session-to-loop
    - theme: alt
      text: Connect a project
      link: /en/chapters/05-connect-existing-project
    - theme: alt
      text: Make a contribution
      link: /en/chapters/source-protocol-map

features:
  - title: Control-plane foundations
    details: Learn sessions, durable state, work graphs, authority, governed Turns, recovery, and runtime boundaries.
  - title: Project onboarding
    details: Delegate onboarding to an Agent, verify Goal, identity, and Git boundaries, then start from Codex App or the visible Codex CLI TUI.
  - title: Developer contributions
    details: Choose the right protocol and owner across the Control Plane, Capabilities, Providers, Hosts, projections, and Extensions.
---

## What this book helps you do

A normal agent session is good at reasoning and execution inside one context. Real development work also
waits for CI, crosses sessions, changes owners, encounters approval gates, and reacts to external state.
LoopX keeps the goal, work queue, authority, evidence, and recovery conditions in a project-owned control
plane.

This book is not a copy of the LoopX CLI reference, and it does not assume that you want to contribute to
the Kernel. It gives external developers a stable path for deciding:

- whether a task needs only one session, a persistent Host goal, or a project-level control plane;
- when Todo, Gate, Evidence, Quota, monitor, and recovery contracts add real value;
- how to delegate project onboarding to an Agent without surrendering Goal, identity, authority, or Git boundaries;
- how to locate the right contribution owner, change an implementation, and validate it from protocols and
  invariants;
- how to decide whether a capability belongs in core, a Capability, a Provider, a Host, a projection, or an
  independently delivered Extension.

## Two independent practice paths

After the control-plane chapters, choose the path that matches your job:

1. **Connect an existing project:** begin with
   [Connect an existing Git project](./chapters/05-connect-existing-project.md).
2. **Make a developer contribution:** begin with the
   [Developer contribution map](./chapters/source-protocol-map.md).

The paths share the same foundations but are independent. Project onboarding does not require a LoopX
source change. Contributions are not limited to Kernel maintainers: you can work on the Control Plane,
Capabilities and Domain State, Providers, Host or Runner integration, projections, documentation and
fixtures, or Extension and package lifecycle. An Extension is one delivery choice for independently
versioned or optional functionality, not the default shape of every contribution.

## Current validation baseline

- Source format: Markdown
- Site generator: VitePress
- Hosting: GitHub Pages
- LoopX release anchor: `v0.4.1`

The official public protocols remain authoritative for protocol facts. Commands that change across
releases remain authoritative in the release you use, its current `--help`, and official documentation.
This book owns the learning path and explanatory model, not another complete command reference.
