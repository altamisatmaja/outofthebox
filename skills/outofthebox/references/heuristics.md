# Heuristics for finding the next case

Use these in the chatter step when the atlas alone runs dry. Each one is a
way to generate concrete cases, not a box to tick.

## Boundaries and partitions

- **Boundary values:** for every limit test min minus one, min, min plus one,
  max minus one, max, max plus one. A 255 character field gets 254, 255, 256.
- **Equivalence partitions:** one value per class plus its edges. Age 0 to
  150: a negative, 0, 35, 150, 151.
- Apply boundaries to dates, strings, collections, file sizes, money, and
  counts per page, not only to numbers.

## Combinations

- **Pairwise:** cross every pair of axes at least once: each actor in each
  state, each state at each time, each input on each environment. Most
  failures need few interacting conditions (see research.md, Kuhn et al.).

## Relations instead of expected values

- **Metamorphic:** when the exact answer is unknown, assert how it must
  change. Instalments sum to the total; a narrower filter never returns more;
  sorting twice equals sorting once; the same request with a retry key
  returns the same result.
- **Properties:** state a rule for all inputs and generate inputs for it.

## Failure, not just function

- **Error handlers:** for every outside call, force it to fail, time out and
  return garbage. What was written before the call? Is it still true?
  Handlers that only log, catch everything, or say TODO are cases.
- **Order and repetition:** the same event twice, late, early, interleaved
  with another actor's event.
- **Dependencies down:** the payment provider, email, storage, the
  provider's provider.

## Exploratory tours (after Whittaker)

| Tour | Mission |
|---|---|
| Money | Follow every path that moves money or value; check both sides |
| Landmark | Jump between key screens in unusual orders |
| Bad data | Feed every field the worst value you can think of |
| Back alley | Use the least used features and settings |
| Configuration | Change every setting, then repeat the main flow |
| Garbage collector | Visit every screen and state once, quickly, looking for breakage |
| Saboteur | Remove what the feature depends on: network, permission, storage |
| Supermodel | Look only at what is shown: every word, number and state |

## What to vary (after Bach's SFDIPOT)

- **Structure:** the parts it is built of.
- **Function:** what it does.
- **Data:** what it takes in and puts out.
- **Interfaces:** how people and systems talk to it.
- **Platform:** what it runs on and depends on.
- **Operations:** how it will actually be used, by whom, how often.
- **Time:** when, how long, in what order, how often.

## Is it a problem? (oracles, after Bolton's HICCUPPS)

A result is suspicious when it is inconsistent with:
History (the old version), Image (the brand and its promises), Comparable
products, Claims (docs, the screen's own words), User expectations, the
Product itself (other parts of it), Purpose, Statutes and standards, and
Familiar failure patterns.

## Personas

Run the flow as: a first time user, a power user in a hurry, an elder on a
small phone, someone on a slow network, a user in another language, a
malicious user, staff acting for a customer, and the same person in two
roles.

## "What if" prompts

- What if this is done twice? By two people? Out of order?
- What if the call before this one failed halfway?
- What if the person holding this link is not the person it was for?
- What if the value is missing rather than zero?
- What if the clock is in another time zone?
- What if the data was written by the old version?
- What if the copy on the child row disagrees with the one on the parent?
- What if every order of these events happens? When the list is too long
  to test by hand, model it (`outofthebox-formal`).
- What does the screen say now, and is it true?
