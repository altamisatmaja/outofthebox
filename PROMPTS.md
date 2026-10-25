# Prompts to copy

Ready to paste into any agent that has outofthebox installed. Replace the
parts in angle brackets. Each prompt names the mode, so the agent does not
need to ask.

## Developers

### Build or fix with a hunt

```
outofthebox during, with outofthebox-dev.
<Describe the change: "Buyers can now gift a ticket to a friend by email.">
Before testing, list at least ten concrete cases out loud.
Prove every new check fails on the old code and quote the failure.
Run the full suite and give numbers. Drive the real product once.
End with the Delivery Gate.
```

### Before you open a pull request

```
outofthebox during. Hunt my uncommitted changes in <repo or folder>.
Start with where the test suite writes: stop if it resets a development database.
Then walk every atlas axis against the diff and report what you tested and what you did not.
```

### A bug report came in

```
outofthebox during, with outofthebox-dev.
Bug: <what the user saw, steps, account>.
Reproduce it first with a check that fails. Then find its neighbours: the same shape of bug
in sibling code paths. Then check whether existing data is already damaged, and how many rows.
```

### A migration

```
outofthebox during, with outofthebox-data.
Migration: <file>. Run it up, down and up on the engine production uses.
Check old rows read by the new code and the old release running during the migration.
```

## QA

### Run a QA flow

```
outofthebox during, with outofthebox-qa.
Here is the QA flow: <paste qa-flow.md or attach qa-flow.yaml>.
Ask me only about fields marked unknown. Expand every step into scripted and unexpected cases,
run them in <environment>, record evidence for each, and file bugs with the bug report template.
```

### Generate cases from a YAML flow

```
node skills/outofthebox-qa/scripts/expand-flow.mjs my-flow.yaml > cases.md
```

```
outofthebox during, with outofthebox-qa.
Rewrite every row in cases.md into a concrete case (actor, input, state, order) or delete it
with a reason. Then run them.
```

### Exploratory session

```
outofthebox during, with outofthebox-qa.
Run a 45 minute exploratory session on <feature> using the money tour and the bad data tour.
Write a charter first, then notes, bugs and questions as you go.
```

## Audits

### Audit finished work

```
outofthebox after, on <feature or folder>.
Write the findings file. Do not change anything until I pick numbers.
```

### Release check

```
outofthebox after, with outofthebox-flow and outofthebox-responsive.
Release candidate: <branch or build>. Walk every business journey that changed, at phone and
desktop widths, and give me a findings file ranked by impact.
```

## Specific concerns

```
outofthebox during, with outofthebox-a11y. Screen: <url>. Keyboard only, then a screen reader,
then 200% zoom. Name the person blocked and the WCAG criterion for each finding.
```

```
outofthebox during, with outofthebox-i18n. Walk <screens> in the pseudo locale and in <languages>.
Check every new key exists in every language file.
```

```
outofthebox during, with outofthebox-mobile. Interrupt every step of <flow> on <device>:
call, app switch, lock, rotate, process death, network switch.
```

```
outofthebox during, with outofthebox-ai. Feature: <assistant or summary>.
Write the contract, build a golden set of at least 50 cases across the kinds in the skill,
run each 5 times, and report pass rates per group.
```

```
outofthebox during, with outofthebox-docs. Document: <file>.
Recompute every number, open every link, follow every step as a newcomer, and list what you
could not verify.
```

## Set it once

```
npx outofthebox-ai --mode during
```

Or add a line to `CLAUDE.md` or `AGENTS.md`:

```
outofthebox: during
```
