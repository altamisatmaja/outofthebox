# Reliable tests

A test is reliable when it fails for the bug, passes for the fix, and gives
the same answer tomorrow, on another machine, in any order.

## Prove it fails on the old code

A new test that has never failed proves nothing: it might pass on broken code.

1. Write the test against the new behaviour.
2. Run it with the **old** code in place and watch it fail **for the right
   reason** (read the assertion message: "expected 1000000, got 954250", not a
   typo or a missing import).
3. Restore the new code and watch it pass.

Ways to get the old code without losing work:

- Copy the changed file to a scratch folder, `git show HEAD:path > path`, run,
  then copy it back. Do not `git stash` in a repo that holds other people's
  stashes.
- When the file holds other uncommitted work, reverse only your change in a
  copy (a small script that undoes the exact edit), run, restore.
- Always restore, and rerun the suite after restoring.

Say it in the report: "both new tests fail on the old code, pass on the new".

## Determinism

- Freeze the clock. Pin it in UTC when the framework moves the default
  timezone with a zoned clock.
- Seed randomness; never assert on a random token's value.
- No sleeps to wait for async work: use fake timers or await the promise.
- Pin environment flags in the test (`vi.stubEnv`), never trust the local `.env`.
- Isolate data: transactions that roll back, or a dedicated test database.
  Packages that truncate shared tables must not run in parallel.
- Stub the network. A test that can reach a live service will, one day, publish
  to it.

## Assert the thing that matters

- Assert values, not just status codes. A 200 with the wrong amount is a bug.
- For money, assert both sides: the payer's balance and the record's state.
- For privacy, assert absence: `assertArrayNotHasKey('entry_qr', ...)`.
- For UI, assert what a user sees and can do: the text, the disabled button,
  the link target, the element that must not exist.
- Name the test after the behaviour and keep a one line comment with who asked
  for it and when, so nobody "simplifies" it away.

## Make the test hit the real failure mode

- Use the real response shapes of external services, not a simplified fixture.
- Use values the production database accepts (an enum value SQLite would also
  accept is not enough).
- Recreate corrupted data the old code left behind and check the fix copes.

## Before you run anything

- Which database will this suite use? Read `phpunit.xml`, `.env.testing`,
  `vitest.config`, the Makefile. If it resets tables and points at a dev or
  production database, stop and create a test database.
- Will it send mail, push, WhatsApp, or charge a card? Fake it first.

## Report numbers

"Full suite: 412/412 passed" or "2 failed, both pre-existing on main (names)".
Never "tests pass" without the count, and never hide a failure you did not cause:
name it and say it predates you.
