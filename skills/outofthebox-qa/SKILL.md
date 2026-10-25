---
name: outofthebox-qa
description: "Out of the Box for QA: take a QA flow (from the template), expand it into scripted and unexpected cases, run them against the real product, and file reproducible bug reports. Load with the outofthebox core for any QA pass, acceptance test, regression pass or release check."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-qa

> Out of the Box: relentless testing for AI agents. QA skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds the QA workflow. It
> cites core rules and never renumbers them.

## Input: a QA flow

Work from a filled-in QA flow: [Markdown](templates/qa-flow.md) for people,
or [YAML](templates/qa-flow.yaml) for a repeatable run. If the user
gives a loose description instead, transcribe it into the template, show it,
and ask only for what is missing (environment, accounts, what "pass" means).
Never invent acceptance criteria; mark unknowns as **unknown** and ask.

The template names: the feature, the environment and its data, the actors,
the happy path steps, the expected result per step, what is out of scope, and
known risks.

## From flow to cases

Run scripted cases and exploratory charters together: studies comparing them
find similar defect detection, with different misses
([research](../outofthebox/references/research.md)). Pick charters from the
[tours](../outofthebox/references/heuristics.md).

1. **Scripted cases.** One per happy path step, with its expected result.
2. **Unexpected cases.** Walk every atlas axis against every step (O-08):
   - each actor, including the same person in two roles;
   - each boundary value of every input;
   - each state the record can be in when the step runs;
   - each order the events can arrive in, including twice and late;
   - each environment the flow ships to (phone, desktop, languages, zones);
   - what the user will actually do: back, refresh, two tabs, paste the link
     elsewhere, give up halfway, return tomorrow.
3. **Chatter the list** before running it (O-04): number every case, rank by
   impact (O-13). Aim for at least three unexpected cases per happy path step.

For a YAML flow, generate the starting table instead of writing it by hand:

```
node skills/outofthebox-qa/scripts/expand-flow.mjs my-flow.yaml > cases.md
```

It crosses every step with every atlas question and the flow's domain packs
and known risks, ranked by impact. The rows are prompts, not cases: rewrite
each one into a concrete case (actor, input, state, order) or delete it with
the reason. Never run a generated row as it stands.

Write the cases into the flow file's case table so the run is repeatable.

## Running

- Run against the environment the flow names, never production (O-02).
- One case at a time; record the actual result next to the expected one.
- Evidence for every result: screenshot, response body, stored record (O-03).
- A case that cannot run (no account, no device) is **blocked**, with the
  reason. Never "passed".

## Filing bugs

Use the [bug report template](templates/bug-report.md). A bug is ready when a
stranger can reproduce it from the report alone:

- exact steps, starting from a stated account and state;
- expected vs actual, in one line each;
- evidence attached;
- severity by impact (money or data loss, security or privacy, broken flow,
  cosmetic);
- whether existing data is already affected (O-09).

## Retest

After a fix: rerun the failing case, then its neighbours on the atlas, then
the full scripted path. A fix that breaks a neighbour reopens the bug.

## QA checklist (with the core Delivery Gate)

- [ ] Flow file filled, unknowns asked, not invented
- [ ] Every happy path step has scripted and unexpected cases
- [ ] Every case has actual result and evidence, or is marked blocked with a reason
- [ ] Every bug filed with the template and reproducible from the report alone
- [ ] Retest covered neighbours, not just the reported case
- [ ] Untested and blocked list stated (O-16)
