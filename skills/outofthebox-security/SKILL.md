---
name: outofthebox-security
description: "Out of the Box for security and privacy: hunt who can see or do what, links that act as credentials, the same person in two roles, and data shown to the wrong viewer. Load with the outofthebox core for any auth, permission, sharing, payment or personal data change. For authorized testing of your own product only."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-security

> Out of the Box: relentless testing for AI agents. Security skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

Scope: your own product, in your own test environment. Never probe systems
you are not authorized to test (O-02).

## Who may do what

Write the matrix: every actor (guest, each role, owner, staff, another
tenant, a deactivated account) against every action. Test the cells that
must say **no**; those are where bugs live.

## Ownership must be stored

Find every place ownership or permission is **inferred** (from who paid,
who created, who holds the link). Ask what later write could change the
inferred field, and who would gain from it.

## Links and codes as credentials

- Tokens in links: guessable, reused, expiring, revocable?
- What a link holder sees when signed in as someone else.
- Codes and QR that unlock goods or money: hidden until they are valid?

## Privacy

- Assert absence: fields that must not be in a response, logs, analytics
  or error reports (O-15).
- Personal data in URLs, query strings or third party scripts.
- Another tenant's records through ids, search, exports or caches.

## Money and abuse

- Pay with someone else's balance, discount or points.
- Replay a request, race two requests, change the amount client side.
- Refunds and reversals going to the right party.

## Security checklist

- [ ] Actor by action matrix written, the "no" cells tested
- [ ] Every inferred ownership found and challenged
- [ ] Every link and code checked as a credential
- [ ] Absence asserted for private fields
- [ ] Replays and races tried on money paths
