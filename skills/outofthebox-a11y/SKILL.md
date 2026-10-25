---
name: outofthebox-a11y
description: "Out of the Box for accessibility: hunt whether real people with different eyes, hands, ears and attention can use every screen: keyboard only, screen readers, zoom, contrast, target size, focus that stays visible, motion, captions, errors they can understand. Covers WCAG 2.2 level AA. Load with the outofthebox core for any screen, form, component, email or document people use."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-a11y

> Out of the Box: relentless testing for AI agents. Accessibility skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Why this is a hunt, not a checkbox

An automated checker finds a fraction of accessibility problems: missing
alt text, low contrast, missing labels. It cannot tell whether the alt text
is meaningful, whether the focus order makes sense, or whether a screen
reader user can finish checkout. Those are found only by using the product
the way those people do (O-11). Run the checker first, because it is cheap,
then hunt.

## Who you are testing for

Name the person before the case (O-04). Each of these people meets a
different product:

| Person | How they use it | What breaks for them |
|---|---|---|
| Blind, screen reader user | Listens; moves by headings, landmarks, links, form fields | Unlabelled buttons, images without text, content that changes without being announced, custom controls with no role |
| Low vision | Zooms to 200 to 400%, large system text, high contrast mode | Text cut off, horizontal scrolling, content hidden behind fixed bars, low contrast |
| Colour blind | Sees most colours differently | Meaning carried only by colour (red for error, green for paid) |
| Keyboard only, motor impairment | Tab, Shift Tab, Enter, Space, arrows; sometimes a switch device | Traps, invisible focus, tiny targets, drag only actions, time limits |
| Tremor, large fingers, one hand | Touch, often imprecise | Targets under 24 by 24 CSS px, targets too close together |
| Deaf or hard of hearing | Reads | Video without captions, audio only alerts, phone only support |
| Cognitive, attention, memory, dyslexia | Reads slowly, gets interrupted, forgets steps | Jargon, long paragraphs, timeouts, re entering data, error messages that blame |
| Vestibular, motion sensitive | Reads, avoids animation | Parallax, auto playing motion, large transitions |
| Elderly first time user | Mixes all of the above | Everything above, often at once |

## The hunt, screen by screen

### 1. Keyboard only

Unplug the mouse in your head. From the address bar, press Tab through the
whole page.

- Can every interactive element be reached? Buttons built from `div`s
  usually cannot.
- Is the order logical: the order you read, not the order the code was
  written?
- Is the focus **always visible**? A focus ring removed by CSS is a fail.
- Is the focused element **not hidden** behind a sticky header, a sticky
  footer, a cookie banner or a chat bubble (WCAG 2.2, 2.4.11 Focus Not
  Obscured, level AA)?
- Can every dialog, menu, date picker, dropdown and carousel be opened,
  used and closed with the keyboard? Does Escape close it?
- When a dialog closes, does focus return to the control that opened it?
- Is there a keyboard trap anywhere: a place you can Tab into and never out
  of?
- Is there a "skip to content" link on pages with long navigation?
- Do actions that need dragging (sorting a list, a slider, a map) have a
  single pointer or keyboard alternative (2.5.7 Dragging Movements, AA)?

### 2. Screen reader

Use the reader on the platform your users use: VoiceOver on iPhone and Mac,
TalkBack on Android, NVDA with Firefox or Chrome on Windows.

- Does the page have one clear `h1` and a sensible heading outline?
- Do landmarks exist (header, nav, main, footer) so a user can jump?
- Does every button and link say what it does out of context? "Click here",
  "More" and an icon with no label are fails.
- Does every image that carries meaning have a text alternative that says
  the meaning, not the file name? Are decorative images hidden?
- Does every form field have a label that is read with it, and is required
  state announced?
- Are errors announced when they appear, and linked to their field?
- Are changes announced: "added to cart", "3 results", "payment failed",
  toasts, live prices, countdowns?
- Do custom controls expose a role, a name and a state (expanded,
  selected, checked, disabled)?
- Do tables have headers, so a cell is read with its column?
- Is the reading order the visual order?

### 3. Seeing

- Text contrast at least 4.5:1, large text at least 3:1; icons and input
  borders at least 3:1 against their background.
- Zoom the browser to 200%, then 400% at 1280 px wide: no horizontal page
  scroll, nothing cut off, nothing overlapping.
- Set the system font size to the largest: does text grow, and does the
  layout survive?
- Text spacing: increase line height and letter spacing; does text still fit?
- Is any meaning carried by colour alone (a red border for an error with no
  message, a green dot for "paid")? Add text or an icon.
- Dark mode and high contrast mode, if the platform offers them.

### 4. Touching

- Targets at least 24 by 24 CSS px, or spaced so a 24 px circle around each
  does not touch another (2.5.8 Target Size Minimum, AA). Primary actions
  should be bigger, around 44 px.
- Targets not crowded at the screen edge where a phone case covers them.
- No action that needs a precise gesture (pinch, multi finger swipe) without
  a simple alternative.

### 5. Hearing

- Every video with speech has captions; every audio has a transcript.
- No alert is sound only.
- Support is not phone only.

### 6. Understanding

- Labels and instructions in plain language, in the user's language.
- Error messages say what happened and how to fix it, next to the field, and
  never blame the user.
- Data the user already gave is not asked for again in the same process
  (3.3.7 Redundant Entry, level A).
- Signing in does not depend on remembering, transcribing or solving a puzzle
  when an alternative exists (3.3.8 Accessible Authentication Minimum, AA):
  allow paste, allow password managers, allow copy of one time codes.
- Help is found in the same place on every page (3.2.6 Consistent Help, A).
- Time limits can be extended or turned off, and the user is warned before
  a session expires with a way to continue.
- Nothing changes context on focus or on input alone (a select that
  navigates as soon as it changes).

### 7. Motion

- Respects "reduce motion": large animations and parallax stop.
- Anything that moves, blinks or scrolls for more than five seconds can be
  paused.
- Nothing flashes more than three times a second.

## Where accessibility bugs hide

- **States other than the default:** the error state, the loading state, the
  empty state, the disabled button (is it announced as disabled, and why?).
- **Components built in house:** date pickers, comboboxes, toggles, tabs,
  carousels, star ratings, steppers.
- **Overlays:** modals, bottom sheets, toasts, cookie banners, chat widgets.
- **Generated content:** emails, PDFs, receipts, invoices, exported reports.
- **Maps, charts and canvas:** they need a text equivalent.
- **Third party widgets:** payment forms, captchas, embedded videos.

## Tools (use, then go beyond them)

- Automated: axe DevTools or axe-core in tests, Lighthouse, WAVE,
  eslint-plugin-jsx-a11y or the framework's equivalent.
- Contrast: the browser's contrast picker, a contrast checker.
- Screen readers: VoiceOver, TalkBack, NVDA.
- Browser zoom, system font size, reduce motion and high contrast settings.

In automated tests, assert accessible names and roles, not class names:
query by role and label (`getByRole('button', { name: 'Pay now' })`),
so the test fails when the label disappears (O-15).

## Reporting an accessibility bug

Say who is blocked, on which screen, with which tool, and which WCAG
criterion. Severity follows impact (O-13): a user who **cannot finish** a
payment or booking is a broken flow at least, not a cosmetic issue.

```
Screen reader users cannot complete checkout.
Tool: VoiceOver, iOS 18, Safari. Screen: /checkout.
The "Pay" button is an icon with no accessible name; VoiceOver reads "button".
WCAG 4.1.2 Name, Role, Value (A). Severity: broken flow.
```

## Accessibility checklist

- [ ] Automated checker run on every changed screen and state
- [ ] Whole flow done with keyboard only; focus always visible, never hidden
- [ ] Whole flow done with a real screen reader
- [ ] 200% and 400% zoom, large system text, no horizontal scroll
- [ ] Contrast and no meaning by colour alone
- [ ] Targets at least 24 px or spaced; drag has an alternative
- [ ] Errors clear, announced, linked to fields; no redundant entry
- [ ] Sign in allows paste and password managers
- [ ] Reduced motion respected; captions present
- [ ] Each finding names the person blocked and the WCAG criterion
