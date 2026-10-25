---
name: outofthebox-redblue
description: "Out of the Box red and blue team, defensive: an authorized adversarial review of your own product (threat model, abuse cases, do the controls hold) paired with a blue team check (would we see it, would we be alerted, could we respond). Load with the outofthebox core for a security review, a pre launch hardening pass, or an incident readiness check on systems you own."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-redblue

> Out of the Box: relentless testing for AI agents. Red and blue team, defensive.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

Scope: your own product and infrastructure, in a test or staging
environment, with written permission from whoever owns it. Never point any
of this at systems you do not own or are not authorized to assess (O-02).
Findings about secrets or exposure are reported privately, never pasted into
issues, chats or logs.

## Rules of engagement (before anything)

Write them down and get them approved by the system owner:
- what is in scope and what is not;
- which environment (test or staging, never production unless the owner
  explicitly approves a named, limited check);
- what is not allowed at all (denial of service, real customer data, social
  engineering of real people, anything destructive);
- who to call to stop the exercise, and when it ends.
No written approval, no exercise.

## Red: think like an abuser, test like a tester

1. **Threat model** the change with STRIDE: spoofing, tampering,
   repudiation, information disclosure, denial of service, elevation of
   privilege. For each, name who would want it and what they would gain.
2. **Abuse cases** in business terms, next to the use cases: "a customer
   pays with another customer's balance", "a partner sees another partner's
   orders", "a guest link is shared publicly". The security skill's actor by
   action matrix is the starting list.
3. **Check the controls hold** with ordinary tests in the test environment:
   the refusal is returned, the record is unchanged, nothing leaks
   (O-15). This skill does not cover exploit development or attacking
   systems you do not own.

## Blue: would we know?

For every red case, ask:
- **Detect:** is there a log line, metric or audit record when it is tried?
  Does it say who, what, when and from where, without secrets in it?
- **Alert:** does anyone get told, at the right urgency, without drowning in
  noise? Try it in the test environment and check the alert arrives.
- **Respond:** is there a runbook? Can we revoke a token, rotate a key,
  disable an account and restore data, today, and has it been practised?
- **Recover:** after the fix, can we find every record the old behaviour
  touched (O-09)?

## Pairing red and blue

Report each case as one row: the abuse case, did the control hold, was it
logged, was it alerted, is there a response step. A control that holds but
is never logged is still a finding: the next variant will not be seen.

| # | Abuse case | Control held | Logged | Alerted | Response ready |
|---|---|---|---|---|---|

## Red and blue checklist

- [ ] Rules of engagement written and approved
- [ ] STRIDE threat model for the change
- [ ] Abuse cases written beside the use cases
- [ ] Every control checked to hold, in the test environment
- [ ] Every case checked for logging, alerting and response
- [ ] Findings reported privately to the owner
