---
name: outofthebox-flow
description: "Out of the Box for business flows: hunt an end to end journey (order, booking, payment, refund, approval, onboarding) for broken invariants, wrong states, money that does not balance, and steps people actually skip or repeat. Load with the outofthebox core whenever a change touches a flow that makes or moves money, stock, bookings or approvals."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-flow

> Out of the Box: relentless testing for AI agents. Business flow skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Draw the flow first

Write the states and the moves between them, with who may make each move:

```
draft -> awaiting_payment -> paid -> in_progress -> done
            |                  |
         expired           cancelled -> refunded
```

Then hunt the moves that are **not** on the drawing: paid back to awaiting
payment, done to cancelled, expired to paid. Each one is a case.

## Write the invariants

Things that must be true in every state, checked after every step:

- Money: what was charged equals what is owed, instalments sum to the total,
  every refund matches a charge, discounts and points come back on reversal.
- Stock and capacity: what is held plus what is sold never exceeds what
  exists, per time window.
- Ownership: the record belongs to exactly one account, and nothing later
  changes that by accident.
- Visibility: what each state shows (an entry code, a receipt, a contact
  number) is right for that state and that viewer.

## Walk it as the business does

- The full journey for every actor: customer, partner, staff, support,
  finance. Each sees a different screen and report.
- The journey interrupted at every step, and resumed later.
- The same step twice, two people at once, steps out of order.
- The outside world: the payment that arrives late, the provider that
  answers twice, the partner who rejects after the customer paid.
- Month end and day end: reports, settlements and reconciliations add up
  against raw records (O-09).

## Real run (O-11)

Drive one journey end to end in the real product with sandbox money, then
read every record it touched: order, payment, ledger, notification, report.

## Flow checklist

- [ ] States and moves drawn, the moves not on the drawing tried
- [ ] Invariants written and checked after every step
- [ ] Every actor's view walked
- [ ] Interrupted, repeated and out of order journeys tried
- [ ] One journey driven end to end, every touched record read
