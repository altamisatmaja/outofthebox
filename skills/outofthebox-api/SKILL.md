---
name: outofthebox-api
description: "Out of the Box for APIs and integrations: hunt contract drift, provider responses, webhooks out of order, retries, signatures and idempotency. Load with the outofthebox core for any endpoint, SDK, webhook, queue consumer or third party integration."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-api

> Out of the Box: relentless testing for AI agents. API skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## The contract

- Compare the response shape against the released version: added, removed,
  renamed and retyped fields. A contract snapshot that changed must be
  re-recorded **on purpose**, with the reason, never to go green (O-05).
- Who calls this endpoint today (web, mobile, partners, cron)? Old clients
  keep sending old payloads.
- Null vs missing vs empty for every field.

## Every caller, every door

- No token, an expired token, another tenant's token, a lower role.
- Ids that exist in another tenant or another table.
- Rate limits, body size limits, wrong content type, malformed JSON.

## Outside providers

- Use the provider's real response shapes in fixtures, including its error
  bodies, not a simplified happy one (O-12).
- Map every provider status to an outcome; an unknown status must not
  become "success".
- Signature and timestamp checks: wrong key, old timestamp, body changed by
  one byte.
- Timeouts: what is written locally before the call, and is it still true
  when the call times out?

## Webhooks and queues

- Delivered twice, delivered late, delivered before the record exists,
  delivered after the record expired or was cancelled.
- Idempotency keys: the same key with a different body.
- Consumer crashes halfway: what is left half written?

## Real run (O-11)

Call the running server with curl, read the body, then read the stored
record. Simulate webhooks locally; never trigger real ones (O-02).

## API checklist

- [ ] Contract diff against the released version explained
- [ ] Every door tried with no, wrong and foreign credentials
- [ ] Provider fixtures use real shapes, unknown statuses handled
- [ ] Duplicate, late and out of order deliveries covered
