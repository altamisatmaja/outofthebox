---
name: outofthebox-data
description: "Out of the Box for data: hunt migrations, imports, exports, pipelines and reports, and find the records the old version already damaged. Load with the outofthebox core for any schema change, backfill, import, ETL job, report or reconciliation."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-data

> Out of the Box: relentless testing for AI agents. Data skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Where it writes (O-01)

Before anything runs, name the database, bucket or sheet it writes to. A
migration, truncate or backfill is tested on a copy or a test database,
never on development data someone depends on, never on production.

## Migrations

- Run up, down, and up again. Run it on a database shaped like production
  (same engine and version), not only the test engine (O-12).
- Engine limits: identifier length, enum values, default values on large
  tables, locks held while it runs.
- The old release still serving while the migration runs: does old code
  break on the new column or table?
- New code reading rows the old code wrote: nulls, legacy values, rows that
  never had the new field.

## Imports and pipelines

- Encodings, delimiters, header changes, empty files, a partial file, a file
  twice. Is a rerun idempotent?
- Late data, out of order data, time zones of timestamps.
- Totals reconcile with the source: count rows and sum amounts on both sides.

## Damage already done (O-09)

When the bug wrote wrong data, write the query that finds every affected
row before fixing. Report the count. Repair locally; for production, report
the query and the count and ask before touching anything.

## Reports

Recompute one figure by hand from raw rows. A report that matches itself
proves nothing.

## Data checklist

- [ ] Target named before running, never production
- [ ] Migration up, down, up on the production engine
- [ ] Old rows read by new code
- [ ] Affected rows found and counted
- [ ] One figure recomputed by hand
