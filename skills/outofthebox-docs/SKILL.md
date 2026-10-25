---
name: outofthebox-docs
description: "Out of the Box for work that is not code: hunt documents, plans, proposals, reports, spreadsheets, financial models, pitch decks, SOPs and business processes for claims without sources, numbers that do not add up, steps a newcomer cannot follow, broken links, stale facts and spreadsheet formula errors. Load with the outofthebox core before a document, model or process is sent to anyone."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-docs

> Out of the Box: relentless testing for AI agents. Documents, models and processes skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## The same discipline, different material

A document can have bugs: a number that is wrong, a step that cannot be
followed, a claim that is not true. A spreadsheet is a program written by
someone who never tested it. A process is a flow with people as the
functions. The hunt loop works unchanged; only the checks look different.

Mapping the core rules onto documents:

| Rule | In code | In a document or model |
|---|---|---|
| O-03 no guess as a result | evidence for every PASS | a source for every claim, a calculation for every number |
| O-07 fails on the old version | the check fails before the fix | the error is shown in the old draft before it is corrected |
| O-09 damage already done | existing records wrong | the old version was already sent, presented or used in a decision |
| O-10 run the whole thing | the full suite | recompute every total, open every link, follow every step |
| O-11 use the real thing | drive the product | follow the process as a newcomer, present the deck aloud |
| O-16 say what was not tested | the untested list | the claims you could not verify, said plainly |

## Documents (reports, proposals, plans, READMEs, policies)

### Claims

- Every factual claim has a source a reader can open, or is marked as the
  author's estimate.
- Every number in the text matches its source and the table it comes from.
- Dates, versions, prices and names are current; anything that changes
  (prices, model names, regulations) says "as of" with a date.
- Quotes are exact and attributed.
- Nothing contradicts another part of the same document (the summary says
  12 weeks, the timeline says 10).

### Numbers

- Recompute every total, percentage and average from its parts.
- Units and currencies are stated and consistent (EUR vs USD, per month vs
  per year, thousands vs millions).
- Percentages are of the right base; "up 50%" says from what.
- Rounding: displayed parts may not sum to the displayed total; say so or
  fix it.
- Exchange rates and assumptions are written down where they are used.

### Steps (how-to guides, SOPs, onboarding)

- Follow every step as written, in a clean environment or as someone new,
  without filling gaps from memory (O-11). Every place you had to guess is a
  finding.
- Each step says who does it, what they need before starting, and how they
  know it worked.
- Each step says what to do when it fails.
- Commands are copy-pasteable and actually run; paths and names exist.
- Screenshots match the current product.

### Structure and reading

- The reader can tell in the first paragraph what this is, who it is for,
  and what they must do.
- Headings match their content; the table of contents links work.
- Every link resolves; internal anchors exist.
- Terms are defined before they are used, and used consistently.
- The language and register fit the reader (an investor, a partner, an
  engineer, a regulator).

## Spreadsheets and financial models

Field audits of operational spreadsheets have repeatedly found errors in a
large majority of them, and studies report that developers leave errors in a
few percent of formula cells; self review finds only part of them (see
[research](../outofthebox/references/research.md)). Treat a model as code.

### Structure

- Inputs, calculations and outputs are separated, and inputs are marked
  (one colour, one sheet).
- No hardcoded numbers inside formulas (`=B4*1.11` where 1.11 is a tax rate
  should reference an input cell).
- Each assumption has a label, a unit and a source.

### Formulas

- Every formula in a row or column is the same pattern; a single cell that
  differs is either intended (and commented) or a bug. Use the spreadsheet's
  "show formulas" view to scan.
- Ranges cover all rows: a `SUM(B2:B20)` that stops one row before the new
  data.
- Absolute and relative references are right when the formula was copied.
- Lookups (`VLOOKUP`, `XLOOKUP`, `INDEX/MATCH`) use exact match unless an
  approximate match is intended; missing keys handled.
- Error values (`#N/A`, `#REF!`, `#DIV/0!`) are not hidden by `IFERROR` in a
  way that turns a real problem into a zero.
- Circular references are intended or absent.
- Dates are real dates, not text that looks like dates.

### Checks inside the model

- Balance checks: assets equal liabilities plus equity; sources equal uses;
  the sum of monthly figures equals the annual figure.
- Cross checks against an independent calculation of one key number.
- Sensitivity: change one input by 10% and see whether outputs move in the
  direction and size you expect. A model that does not react, or reacts
  wildly, has a broken link.
- Boundary inputs: zero customers, zero price, a 100% churn month.

### Review

- Someone other than the author reviews it (self review misses much).
- The review is recorded: what was checked, what was found, what changed.

## Decks and presentations

- Every chart has its source and date; axes start where they should and
  are labelled with units.
- Numbers on slides match the model and the written document.
- Claims about competitors and the market are sourced and current.
- Presenting it aloud once, timed, finds the slide that does not make sense.

## Business processes (SOPs, operations, support, finance)

Draw the process as a flow: who does what, in what order, with what input
and output. Then hunt it like a business flow:

- What happens when a step's input is missing, late, wrong or duplicated?
- Who does the step when the usual person is away?
- Where is a hand off between people or teams, and how does the receiver
  know the hand off happened?
- What is the escalation when a step fails, and is the contact current?
- Where could money, data or a customer be lost between two steps?
- What is the record that proves each step was done (an audit trail)?

Walk one real case through it end to end with the people who do it.

## Evidence (O-03)

- For numbers: the recomputation, with the formula or the working.
- For steps: the run log or notes from following them.
- For links: the result of opening them.
- For a model: the balance checks' results and the sensitivity table.

## Documents checklist

- [ ] Every claim sourced or marked as an estimate; "as of" dates on things that change
- [ ] Every number recomputed; units and bases stated
- [ ] Every step followed as a newcomer; failure paths written
- [ ] Every link opened
- [ ] Spreadsheet: inputs separated, no hardcoded constants, formula patterns consistent
- [ ] Model: balance checks, cross check, sensitivity, boundary inputs
- [ ] Reviewed by someone other than the author
- [ ] Unverified claims listed plainly
