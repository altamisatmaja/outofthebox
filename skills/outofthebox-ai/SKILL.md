---
name: outofthebox-ai
description: "Out of the Box for AI and LLM features: hunt answers that are wrong but confident, answers that change between runs, missing refusals, made up facts and sources, tool calls with wrong arguments, cost and latency blowups, and quality that drifts after a model or prompt change. Builds golden sets, graded evals and regression runs. Load with the outofthebox core for any chatbot, assistant, summary, classifier, extraction, search answer, agent or RAG feature."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-ai

> Out of the Box: relentless testing for AI agents. AI features skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Why ordinary tests are not enough

An AI feature can return HTTP 200 with a confident, wrong answer while every
dashboard is green. The same input can give a different output tomorrow. An
exact string comparison fails on a correct answer phrased differently and
passes on a wrong one copied from the fixture. So the hunt needs three
things code tests rarely need: a **golden set** of cases, a **grader** that
judges meaning, and **repeated runs** that measure a pass rate.

## 1. Write down what "good" means

Before any test, write the feature's contract in plain sentences:

- What it must do ("answers questions about the user's own orders").
- What it must never do ("never states a price that is not in the data";
  "never answers about another user's order").
- When it must say "I don't know" or hand over to a person.
- The format of the output (JSON schema, length, language, tone).
- The latency and cost budget per request.

Each sentence becomes a group of cases. A sentence with no cases is untested
(O-16).

## 2. Build the golden set

A versioned file of inputs with the expected behaviour (not always an exact
output). Cover:

| Kind of case | Examples |
|---|---|
| Common | The ten questions real users ask most, from logs or support |
| Edge | Empty input, very long input, another language, typos, slang, mixed languages |
| Ambiguous | Questions with two reasonable readings; the right behaviour may be to ask back |
| Unanswerable | The data does not contain the answer; correct behaviour is to say so |
| Out of scope | Questions the feature must decline or redirect |
| Must refuse | Requests the product policy says no to |
| Grounding | Every fact must come from the provided data; check each claim against it |
| Numbers | Totals, dates, prices, counts; AI often gets arithmetic and dates wrong |
| Past bugs | Every bad answer found in production becomes a permanent case |

Treat the golden set like code: reviewed, versioned, and growing with every
incident.

## 3. Grade by meaning, then by rule

- **Deterministic checks first:** valid JSON, schema fields present,
  required words or ids present, forbidden content absent, length limits,
  language detected. Cheap and exact.
- **Grounding checks:** every factual claim (a price, a date, a name) found
  in the source data. A claim with no source is a made up fact.
- **Model graded checks** for meaning: a grader model with a written rubric
  scores correctness, completeness, tone. Calibrate the grader against human
  judgements on a sample first; do not trust it to gate releases until it
  agrees with people most of the time.
- **Human review** on a regular sample, especially for new kinds of cases.

## 4. Run it more than once

- Run each case several times (for example 5) and report the pass rate,
  not one result. A case that passes 3 of 5 times is a flaky feature, not a
  passing one (O-14 applies to the feature, not only the test).
- Lower temperature where the product allows it, but test at the settings
  production uses.
- Fix seeds where the provider supports them; still expect variation.
- Set a threshold per group ("grounding 100%, common 95%, tone 90%") and
  fail the run below it.

## 5. Tools and agents

When the model calls tools or acts:

- Wrong tool chosen; right tool with wrong arguments (a date in the wrong
  format, the wrong user id).
- A tool that fails or times out: does the model report it honestly or
  invent a result?
- A tool that returns nothing: does the model say so?
- Loops: the model calls the same tool again and again.
- Actions that change data are confirmed by the user and limited by the
  product's own permission checks, never by the prompt alone.
- Text that comes from outside (documents, emails, web pages, user uploads)
  is treated as data by the feature, and the product's permission checks
  still apply whatever that text says.

## 6. Regressions

Re-run the whole golden set when any of these change: the model or its
version, the prompt, the system instructions, the retrieval index or its
chunking, the tools, the temperature, the provider. Compare pass rates
against the previous run and investigate any drop, even a small one.

## 7. Cost and latency

- Measure tokens and time per request on the golden set; report p50 and p95.
- Very long inputs: is the context limit handled (truncation, refusal) and
  is the cost bounded?
- Retries on provider errors: bounded, with backoff, and not billing the
  user twice for one answer.
- Caching: the same question from two different users never returns one
  user's private answer to the other.

## 8. In production

- Sample live traffic for grading or review; trace input, retrieved
  context, output, latency and cost per request (without storing personal
  data you should not keep).
- Give users a way to flag a bad answer; every flag is a candidate golden
  case.
- Alert on drops in pass rate, spikes in refusals, cost or latency.

## Reporting (O-03)

Report numbers per group, with run counts:

```
Golden set v14, 180 cases, 5 runs each, model X at temperature 0.2.
Grounding: 178/180 (2 cases invented a delivery fee) FAIL, threshold 100%.
Common: 96% PASS. Unanswerable: 88% FAIL (says an order exists when none does).
p95 latency 2.8 s, mean cost $0.0031 per request.
Not tested: Arabic, voice input.
```

## AI checklist

- [ ] Contract written: must, must never, when to say "I don't know", format, budget
- [ ] Golden set covers common, edge, ambiguous, unanswerable, out of scope, numbers, past bugs
- [ ] Deterministic and grounding checks before model grading
- [ ] Grader calibrated against people before it gates anything
- [ ] Every case run several times; pass rate per group against a threshold
- [ ] Tool calls: wrong tool, wrong arguments, failures, loops
- [ ] Full regression on any model, prompt, retrieval or tool change
- [ ] Cost and latency measured; caching never mixes users
