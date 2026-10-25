---
name: outofthebox-ui
description: "Out of the Box for interfaces: hunt every state, width, language and actor a screen can meet, and read every sentence as the user would. Load with the outofthebox core for any web, mobile or desktop screen, form, flow or component."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-ui

> Out of the Box: relentless testing for AI agents. Interface skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Every state, not the pretty one

For each screen, name and show: loading, empty, one item, many items, error,
offline, permission denied, expired, cancelled, partially done, done. For
each one ask what the screen **says** and what it **lets the user do**. A
button that works in a state where it must not is a security bug (O-13),
not a cosmetic one.

## Read it literally

- Is every sentence still true in this state, for this actor? A deadline
  shown after it passed, "paid" while an instalment is unpaid, "full" when the
  capacity is unknown.
- Does a number shown on screen equal the number stored and charged?
- Does the screen act on its own (opening the next step, auto submitting)
  in a way that startles the user?

## Widths, inputs and environments

- Phone width (360 to 390 px), tablet, desktop, and zoomed text. Nothing
  scrolls sideways; tap targets stay reachable; sticky bars do not cover the
  primary button.
- Keyboard only, screen reader labels, focus after a dialog closes.
- Every language the product ships: missing keys, long translations,
  formal and informal register, local date and money formats.
- Fresh tab vs a tab that restores yesterday's draft from storage.

## The other actor in the same browser

Open each link while signed in as someone else: the owner on a friend's
link, a guest on a member page, staff on a customer page. The screen must
show what that viewer may see and nothing more.

## Real run (O-11)

Drive the flow by hand: pick, type, press. Take a screenshot and look at it.
Assert in checks what the user sees and can do: text, disabled controls,
link targets, elements that must not exist (O-15).

## UI checklist

- [ ] Every state named, shown, and its words checked
- [ ] Phone width and desktop both driven
- [ ] Every language file has every new key
- [ ] Other actor in the same browser tried
- [ ] Screenshot looked at, not just taken
