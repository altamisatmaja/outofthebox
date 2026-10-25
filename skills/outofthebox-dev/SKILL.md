---
name: outofthebox-dev
description: "Out of the Box for developers: turn every risk into a regression check that fails on the old code, fix it, and keep hunting. Load with the outofthebox core after any feature, fix, refactor or migration, before saying it is done."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-dev

> Out of the Box: relentless testing for AI agents. Developer skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what a builder does
> in each step. It cites core rules and never renumbers them.

## Before the first line of test

- **Find where the suite writes** (O-01). Read the test config (`phpunit.xml`,
  `.env.testing`, `vitest.config`, `pytest.ini`, the Makefile target) and the
  base test class. Resetting traits (`RefreshDatabase`, truncation, `migrate
  fresh`) on a development database is a stop. Rolled back transactions are
  fine.
- **Read the real schema**, not the test schema. Enums, lengths, index names,
  nullability: the production engine enforces what the test engine may not
  (O-12).
- **Read what the old code did.** You will need it to prove failure (O-07).

## Turning a case into a check

For every case on your chatter list:

1. Write the check against the behaviour you want, named after that behaviour,
   with a one line comment saying who asked and when.
2. Make the old code fail it:
   - Copy the changed file aside, put the old version back
     (`git show HEAD:path > path`, or reverse only your edit when the file holds
     other uncommitted work), run the check, read the failure message.
   - It must fail on the assertion that describes the bug, not on a missing
     import or a typo.
   - Restore the new file. Re-run the suite.
3. Prefer assertions a reviewer can read as the bug: "the payer's balance
   stays 1,000,000" beats "status is 200".

## Builder's unexpected list

Ask each of these about your own change, out loud:

- What does my code **infer** that it should **store**? (An owner guessed from
  who paid; a state guessed from a missing field.)
- What do I write **before** a call that can fail? Is it still true when the
  call fails?
- Which of my writes can run **twice** (retries, double taps, two workers)?
- Which reads can be **stale** by the time I write (check then act, no lock)?
- What does my endpoint reveal to someone holding a link meant for another
  person?
- What does the screen say in **every** state, and is each sentence still true?
- What did the old version leave in the database that my new code now reads?
- Which of my new messages, keys or labels must exist in every language file?
- Does my migration run while the old release still serves?

## Fixing

- Fix the cause, not the symptom the test happens to check.
- When the old behaviour damaged data, repair locally and say how many rows;
  for production, report and ask (O-02, O-09).
- After the fix, run the neighbours: the same bug shape in sibling code paths
  (the other controller, the v1 page, the mobile client).

## Developer checklist (with the core Delivery Gate)

- [ ] Test target checked before the first run (O-01)
- [ ] Every new check failed on the old code, message quoted (O-07)
- [ ] Full suite numbers for every repo touched (O-10)
- [ ] One real run of the changed flow, screenshot or response read (O-11)
- [ ] Data damaged by the old version found and handled (O-09)
- [ ] Temporary files, tokens and seeded rows cleaned up (O-06)
