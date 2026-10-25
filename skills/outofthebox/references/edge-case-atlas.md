# Edge case atlas

Walk every axis for every change (O-08). Each axis lists questions and an example
bug the happy path never showed. Name the question, then answer it with a
check or a reproduction. The axes hold in any field; the domain packs at the
end add what a specific kind of product tends to hide.

## 1. Who (actors and identity)

- Signed in, signed out, guest, another role, a removed or deactivated account.
- **The same person in two roles.** *Example: a buyer gifts a concert
  ticket and opens the recipient's claim link in their own signed in
  browser. The page offers to claim the ticket into the buyer's account, and
  the recipient's link stops working.*
- Two people acting on the same record at once.
- Ownership **inferred** instead of stored ("whoever paid is the owner"). Any
  later write to the inferred field silently changes who owns what.
- Someone holding a link, code or file meant for someone else.

## 2. How much (amounts and numbers)

- Zero, one, the maximum, one over, negative, absurdly large, decimals.
- Division that does not divide: 100.00 in three instalments is 33.34 +
  33.33 + 33.33. Who gets the remainder, and does the sum still equal the total?
- A discount larger than the thing discounted; a balance covering all of it.
- **A cap on the total, not each row.** *Example: a venue with 200 seats
  sells three ticket types, each capped at 200, so 600 can be sold.*
- A zero, an empty state or a "full" label that misleads.

## 3. When (time and order)

- Before opening, after closing, exactly at the boundary, across midnight,
  across time zones, on a closed day, on a leap day, at a DST change.
- **Out of order.** *Example: a payment that lands after its order expired
  is marked paid and then ignored: money in, no order, no refund.*
- The same event twice: a retried webhook, a double tap within a second.
- A stale screen: opened before someone else acted.
- A step that jumps ahead on its own and startles the user.

## 4. What state (lifecycle)

- Every status, not the two common ones: pending, expired, cancelled,
  refunded, partial, in progress, overdue, archived.
- **What each state shows.** *Example: an unpaid ticket order shows its
  entry QR code, which acts as the ticket itself.*
- Half done: the local write happened, the outside call failed. *Example:
  the seat is marked sold before the charge; the charge fails, the seat stays
  sold to nobody.*
- Records the old version already damaged.

## 5. Where (environments and engines)

- **The test engine is not the production engine.** *Examples: SQLite
  accepted an enum value MySQL refused; SQLite read an unknown quoted column as
  a string; MySQL caps index names at 64 characters.*
- Phone width and desktop, dark mode, slow network, offline, ad blockers.
- Long lived workers that keep state between requests; caches; a build
  watcher that silently stopped.
- Another host name for the same app (localhost vs 0.0.0.0) and its cookies.
- A test config that quietly points at the development database.

## 6. Which input (shape and content)

- Empty, whitespace, very long, unicode, emoji, right to left, markup,
  leading zeros, pasted formatting.
- Null vs absent vs zero. *Example: seats left is unknown until a date is
  chosen; showing "sold out" for unknown would lie.*
- Old links, old app versions, old file formats.

## 7. How many (volume and repetition)

- None, one, many, exactly a page, one past a page.
- Queries that multiply with the list (N+1).
- Limits shared by everyone behind one proxy or one office network.

## 8. What else changes (side effects)

- Messages: sent once, in the right language, to the right person?
- Balances, ledgers, points: every debit has its credit; a reversal returns
  everything it took.
- Locks: two requests both passing the same check.
- Every new text in every language file.
- Snapshots and contracts: a deliberate change re-recorded on purpose, an
  accidental one caught.

## 9. What the user will actually do

- Paste the link in the "wrong" browser; press back; refresh mid payment;
  open two tabs; stop halfway; come back tomorrow.
- Read the screen literally: is every sentence still true in every state?

---

## Domain packs

Add the pack for the product's field to the axes above.

### Payments and money

Fees on top of instalments, rounding, currency formatting, partial and late
payments, refunds to the right party, reversals of discounts and points,
idempotency keys, gateway response shapes, signature checks, reconciliation
against the provider's report.

### Booking, scheduling and capacity

Opening hours in the location's time zone, slots that cross closing time,
capacity per window not per day, holds while unpaid, overbooking under
concurrency, reminders timed to the right clock.

### Identity and access

Roles per tenant, the same email in two roles, links that act as credentials,
session reuse across accounts on one device, deactivated users with live
tokens, an id that matches a row in the wrong table.

### Data, imports and pipelines

Encodings, delimiters, duplicates, partial files, reruns (idempotent?), late
data, schema drift, time zone of timestamps, totals that must reconcile.

### APIs and integrations

Contract changes against the released version, missing and extra fields,
pagination edges, retries and timeouts, the provider's error codes mapped to
the right outcome, rate limits.

### Messaging and notifications

Templates per language, opt outs, retries without duplicates, delivery to
guests without accounts, links inside messages that must still work later.

### Content and languages

Every key in every language, plural and gender forms, long translations
breaking layouts, dates and numbers in local format, the formal and informal
register the product chose.

### Mobile and devices

Offline then sync, background kill, permissions denied, small screens, old OS
versions, push token rotation, a store build that differs from the dev build.

### Hardware, robotics and simulation

Sensor noise and dropouts, actuator limits and heat, battery sag, latency
between brain and body, the simulator's ground truth that the real world
does not give, safety actions that must never be automated.

### Documents, processes and non-code work

Every claim has a source; every number adds up; every step can be followed by
someone new; every link resolves; every role in the process knows what to do
when the step before it failed.
