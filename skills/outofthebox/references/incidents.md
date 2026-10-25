# Real incidents, and the axis that would have caught them

Famous failures are useful because they are concrete. Each one below is a
case someone could have named in the chatter step (O-04). Use them to
explain to a team why a "rare" case deserves a check.

Details are as reported in public postmortems and widely cited accounts;
figures vary between sources, so the lesson matters more than the number.

## Engineering and space

### Ariane 5 flight 501 (1996)

- **What happened:** the rocket broke up about 40 seconds after launch.
  A module reused from Ariane 4 converted a 64 bit floating point value to a
  16 bit signed integer. Ariane 5 flew faster, the value no longer fit, the
  conversion overflowed, and the guidance system shut down.
- **Axis:** How much (one over the maximum) and Where (the environment that
  ships is not the one the code was tested in, O-12).
- **The check that would have caught it:** run the reused code with the new
  vehicle's real flight profile; test every conversion at its limits.

### Mars Climate Orbiter (1999)

- **What happened:** one team produced thruster data in pound force seconds;
  the other expected newton seconds. The orbiter came in far too low and
  was lost.
- **Axis:** Which input (units) and What else changes (an interface between
  two teams).
- **The check:** assert units at every interface; recompute one value by hand
  across the boundary.

### Therac-25 (1985 to 1987)

- **What happened:** a radiation therapy machine gave massive overdoses. A
  race between operator input and the machine's setup let it fire in the
  wrong mode, and the hardware interlocks of earlier models had been removed
  in favour of software checks.
- **Axis:** When (fast input, events out of order) and What state (a mode
  that was half set up).
- **The check:** drive the interface faster than the setup completes;
  keep an independent safety layer for anything that can hurt a person.

## Money

### Knight Capital (2012)

- **What happened:** a deployment reached seven of eight servers. On the
  eighth, a reused feature flag woke up old code that had not been used for
  years, which sent a flood of orders. The firm lost about 440 to 460
  million dollars in roughly 45 minutes.
- **Axis:** Where (one server different from the rest), What state (an old
  flag meaning something new).
- **The check:** verify every server runs the same version after a deploy;
  never reuse a flag name; test the old code path is truly gone.

## Time

### The 2012 leap second

- **What happened:** an extra second inserted on 30 June 2012 triggered a
  Linux kernel timer problem; services including Reddit and others had
  outages, and some systems spun at full CPU.
- **Axis:** When (a time that does not usually exist).
- **The check:** run the system with a clock that inserts or repeats a
  second, and across DST changes.

### Cloudflare DNS, 1 January 2017

- **What happened:** during the leap second, a value assumed never to be
  negative went negative, and part of Cloudflare's DNS service failed.
- **Axis:** How much (a value outside the range everyone assumed) and When.
- **The check:** assert the assumption in code and test the case that breaks
  it; time goes backwards on real machines.

## Data shown to the wrong people

### Cloudflare "Cloudbleed" (2017)

- **What happened:** a parser bug caused some responses to include memory
  from other customers' traffic for months; some of it was cached by search
  engines.
- **Axis:** Which input (malformed pages) and What else changes (caches
  outside your control keep the leak).
- **The check:** test the parser with malformed input; assume anything
  served may be cached by someone else.

### Shared cache serving one user's page to another

- **What happened (a pattern seen in several public incidents, for example
  a CDN configuration change at one hosting platform in 2026):** responses
  without explicit cache headers were cached at a shared layer and served to
  other users.
- **Axis:** Who (another viewer) and Where (a layer between you and the
  user).
- **The check:** every personalised response carries `Cache-Control:
  private` or `no-store`; a test fetches a personal page as user A and then
  as user B through the same cache path and asserts B never sees A's data.

## Spreadsheets

### Operational spreadsheets in general

- **What happened:** audits of real business spreadsheets have found errors
  in most of the ones examined; studies report a few percent of formula
  cells wrong, and self review finds only part of them.
- **Axis:** Which input, How much, and the documents pack.
- **The check:** the spreadsheet section of `outofthebox-docs`: separate
  inputs, consistent formulas, balance checks, an independent reviewer.

## How to use this file in a hunt

When someone says "that will never happen", find the closest incident here
and name it next to the case. It turns a debate into a check.
