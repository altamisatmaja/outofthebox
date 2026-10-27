---
name: outofthebox-formal
description: "Out of the Box with formal specification: model a design in TLA+ or PlusCal and let the TLC model checker walk every interleaving of concurrent workers, retries, redeliveries, crashes and out of order events, then turn each counterexample into a regression test. Load with the outofthebox core for queues, consumers, locks, sagas, distributed state, idempotency or any ordering that a handful of hand picked tests cannot cover."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-formal

> Out of the Box: relentless testing for AI agents. Formal specification skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## When it earns its cost

A test checks the orders of events you thought of. A model checker checks
every order of events in a small model. Reach for TLA+ when the risk is in
the interleaving, not in one input:

- At least once delivery, retries, republishing a failed message.
- Two workers, two requests or two replicas acting on the same record.
- Check then act: a lock, a stock count, a status guard read before a write.
- Multi step flows that can stop halfway (sagas, outbox, two writes and a
  publish).
- Anything someone defends with "that order can never happen".

Skip it for pure input validation, layout, wording or a single threaded
calculation. Use the other concern skills there.

## The tools (check, do not assume)

- **TLA+** is the specification language. **PlusCal** is a code like
  language that translates into TLA+.
- **TLC** is the explicit state model checker shipped in `tla2tools.jar`
  from the `tlaplus/tlaplus` GitHub releases. Run it with Java:

```
java -cp tla2tools.jar tlc2.TLC -config Spec.cfg Spec.tla
java -cp tla2tools.jar pcal.trans Spec.tla      # PlusCal to TLA+ first
```

- Before writing a flag into a report or a script, run the tool's own help
  (`java -cp tla2tools.jar tlc2.TLC -h`) on the installed version. Flags and
  defaults change between releases; never quote one from memory (O-03).
- The TLA+ Toolbox and the VS Code TLA+ extension run the same checker.

## Traps that look right and are not

- **An IF, CASE or LET swallows the next line.** `IF c THEN a ELSE b` reaches
  as far right as it can. Inside an inline chain (`x > 0 /\ y' = ... /\
  z' = ...`) the ELSE takes the rest of the chain with it, and TLC stops with
  an evaluation error instead of checking anything. Write each action as a
  bulleted `/\` list, one conjunct per bullet, and put parentheses around
  any IF. This exact mistake was in the first draft of the example below.
- **An error is not a pass, and a pass is not a proof.** "Error: The error
  occurred when TLC was evaluating" means the model never ran its checks.
  Only "Model checking completed. No error has been found." with a
  plausible state count is a pass.

## The loop, in TLA+ terms

1. **Map to a small model (core step 1).** Variables are the state that
   matters: the queue, the record, the lock, the counter. Leave out
   everything else. Keep constants tiny (2 workers, 2 copies, 3 items). Most
   design bugs show up at the smallest sizes.
2. **Write the actions, including the failures (O-04, O-08).** Every move a
   real component can make is an action: deliver, redeliver, consume, crash
   before the ack, time out, retry, publish, read stale. An action you leave
   out is an order of events TLC never tries. Name each one as a concrete
   case out loud.
3. **Write the invariants (O-15).** What must hold in every state: charged at
   most once, held plus sold never above stock, a status never moves back.
   Add a `TypeOK` invariant so a typo does not pass as a proof. Liveness
   ("eventually processed") needs fairness; state it explicitly or do not
   claim it.
4. **Prove the spec can fail (O-07).** Model the old behaviour first, or
   break the fix on purpose, and run TLC. It must report the invariant as
   violated, with a trace that matches the bug you meant. A spec that has
   never failed proves nothing, exactly like a test.
5. **Model the fix and run again.** TLC must finish with no error. Read the
   number of distinct states it reports: a tiny count often means an action
   is never enabled and the model is checking less than you think.
6. **Turn each trace into a test (core step 4).** A counterexample is an
   ordered list of states. Replay that order in a real test (a redelivered
   message, a second worker started between read and write) and prove it
   fails on the old code (O-07) and passes on the fix.
7. **State the gap (O-12, O-16).** The model is not the code. Write down what
   the model leaves out (sizes beyond the constants, the real broker, the
   real database isolation level) and what still needs the real run (O-11).

## Example in this folder

[templates/Redelivery.tla](templates/Redelivery.tla) models a payment
message delivered at least once. `NextBuggy` charges on every delivery;
`NextFixed` checks an idempotency record first. The invariant `AtMostOnce`
says the customer is charged at most once.

```
java -cp tla2tools.jar tlc2.TLC -config Redelivery-buggy.cfg Redelivery.tla
java -cp tla2tools.jar tlc2.TLC -config Redelivery-fixed.cfg Redelivery.tla
```

Checked with `tla2tools.jar` v1.7.4 and `MaxCopies = 2`: the buggy config
reports `Invariant AtMostOnce is violated` with a four state trace (start, a
redelivery, two consumes, `charges = 2`); the fixed config reports `Model
checking completed. No error has been found.` with 5 distinct states. On
another version, run both yourself and quote your own output (O-03).

## Reliable model checking (O-14)

- Pin the `tla2tools.jar` version in the repo or the CI job, and record it in
  the report.
- Keep the `.tla` and `.cfg` files next to the code they model and run them
  in CI, so a design change that breaks an invariant fails the build.
- TLC writes its run data (a `states/` folder) next to the spec on every
  run. Ignore it in git and in any package, so a model check never ships
  its own leftovers. This happened while this skill was being written.
- Model checking is exhaustive only inside the constants you set. Say the
  constants in every result: "no violation for 2 workers, 2 copies".

## Formal checklist

- [ ] Risk is in the interleaving, so a model is worth it
- [ ] Every real move modelled as an action, failures included
- [ ] Invariants written, `TypeOK` included, liveness only with fairness
- [ ] Spec shown to fail on the old behaviour, with a matching trace
- [ ] Fix checked with no error, state count read and plausible
- [ ] Each counterexample replayed as a real test, failing on the old code
- [ ] Tool version, constants and what the model leaves out stated
