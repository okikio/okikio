---
description: Cross-project Markdown and long-form documentation style
applyTo: "**/*.md"
---

# Documentation Writing

## Core priority

Lead with user or maintainer benefit before internal mechanics.
When introducing a concept, prefer this narrative order:
1. what it is
2. what problem it solves
3. what the reader gets from it
4. how it works at a high level
5. examples, assumptions, edge cases, limitations, and deeper detail

Use this as a default shape, not a rigid template.

## Writing style

- Use plain English.
- Define technical terms the first time they matter.
- Ground abstract ideas in something concrete before or while naming them.
- Tie explanations to a real behavior, cost, failure mode, example, or downstream benefit.
- Keep a steady narrative flow.
- Prefer transition sentences over unnecessary headers.
- Use active voice.
- Use present tense where practical.
- Expand acronyms on first use.
- Avoid em dashes.

The goal is not just to swap jargon for simpler jargon.
The goal is to help the reader build a working mental model.

## Grounding abstract concepts

Before using a specialized term, or immediately after introducing it, connect it to at least one of these:
- a concrete input or output
- a real user or caller problem
- a visible behavior in the system
- a cost such as allocation, latency, or complexity
- a failure mode or edge case
- a downstream benefit for maintainers or consumers

If the reader would reasonably ask `So what does that mean here?`, answer that question in the prose.

## Header rules

Add a header only when it improves navigation more than a transition sentence would.
A useful header must mark a real subject shift, be specific about what follows, and still make sense in a document outline.

## Examples and visual aids

Use examples when they materially improve understanding.
Use ASCII diagrams when they clarify structure, flow, hierarchy, state transitions, or algorithm steps.
Always explain what the reader is looking at and why it matters.
Do not add diagrams just to decorate the prose.

## Specs and design notes

For specs, proposals, and design notes, prefer RFC-style structure:
- Problem
- Goals
- Non-goals
- Constraints
- Proposal
- Alternatives
- Risks
- Rollout
- Open questions

Keep decisions concrete. Make tradeoffs explicit. State assumptions plainly.

## Anti-patterns

- Do not bury the lede under prerequisites or implementation detail.
- Do not list features before explaining the problem they solve.
- Do not create many tiny headers that simply label the next paragraph.
- Do not replace one abstract phrase with another abstract phrase and call it clarity.
- Do not use diagrams or examples that overstate certainty beyond what the implementation actually guarantees.