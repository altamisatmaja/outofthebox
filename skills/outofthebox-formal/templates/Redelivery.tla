---------------------------- MODULE Redelivery ----------------------------
\* A queue delivers one payment message at least once. The consumer charges
\* the customer. NextBuggy charges on every delivery; NextFixed checks an
\* idempotency record first. The invariant says the customer is charged at
\* most once. TLC finds the duplicate charge in NextBuggy in four states.
EXTENDS Naturals

CONSTANT MaxCopies          \* how many copies the broker may hold at once

VARIABLES inbox,            \* copies of the message waiting to be consumed
          charges,          \* how many times the customer was charged
          seen              \* the idempotency record: processed already?

vars == <<inbox, charges, seen>>

TypeOK == inbox \in 0..MaxCopies /\ charges \in Nat /\ seen \in BOOLEAN

Init == inbox = 1 /\ charges = 0 /\ seen = FALSE

\* Each action is a bulleted /\ list. The bullets delimit every conjunct, so
\* an IF/THEN/ELSE inside one cannot swallow the next line.

\* The broker redelivers: a timeout, a rebalance, a crash before the ack.
Redeliver ==
    /\ inbox > 0
    /\ inbox < MaxCopies
    /\ inbox' = inbox + 1
    /\ UNCHANGED <<charges, seen>>

ConsumeBuggy ==
    /\ inbox > 0
    /\ inbox' = inbox - 1
    /\ charges' = charges + 1
    /\ seen' = TRUE

ConsumeFixed ==
    /\ inbox > 0
    /\ inbox' = inbox - 1
    /\ charges' = (IF seen THEN charges ELSE charges + 1)
    /\ seen' = TRUE

\* Stop once everything is consumed, so TLC does not report a deadlock.
Done == inbox = 0 /\ UNCHANGED vars

NextBuggy == Redeliver \/ ConsumeBuggy \/ Done
NextFixed == Redeliver \/ ConsumeFixed \/ Done

AtMostOnce == charges <= 1
=============================================================================
