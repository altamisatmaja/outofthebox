---
name: outofthebox-i18n
description: "Out of the Box for languages and regions: hunt missing translations, hardcoded text, broken plurals, text that grows and breaks layouts, right to left scripts, local formats for dates, times, numbers, money, names, addresses and phone numbers, time zones, and the tone each language expects. Load with the outofthebox core for any product used in more than one language, country or time zone."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-i18n

> Out of the Box: relentless testing for AI agents. Languages and regions skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Two different jobs

- **Internationalization (i18n):** the product *can* work in any language
  and region. No hardcoded text, formats from the locale, layouts that grow.
  An engineering property; test it with pseudo localization.
- **Localization (l10n):** the product *does* work in a specific language
  and region. Correct, natural, complete translations; local formats; local
  expectations. A content property; test it with real strings and a native
  reader.

Hunt both. A product can pass one and fail the other.

## Step 1: find every string a user can see

Before testing translations, list where text comes from:

- UI templates and components.
- Messages from the API (errors, validation, notifications). These are the
  ones most often left untranslated, because they live in another repo.
- Emails, SMS, WhatsApp templates, push notifications.
- PDFs, receipts, invoices, exported files.
- Images with text in them.
- Content from a CMS or the database (category names, product names).
- Third party widgets (payment pages, maps, captchas).
- Alt text, aria labels, page titles, meta descriptions.

Every source needs a translation path. A missing path is a finding even
before any string is wrong.

## Step 2: pseudo localization

Switch to a pseudo locale that makes every string longer, accented and
bracketed, for example `[Ƥàýàŕ ƀàĝîàñɱů ~~~~~~]`. Then walk every screen.

- Any text **without brackets** is hardcoded: it does not go through the
  translation system.
- Any text **cut off** where the bracket should close is truncated: the
  layout does not grow.
- Any sentence **split into pieces** (`[Only]` `[3]` `[seats left]`) is
  concatenated: it cannot be translated correctly because word order differs
  between languages.
- Any **broken character** (`Ã©` instead of `é`) is an encoding bug.

Run it in CI if the framework supports it; translation bugs return quietly.

## Step 3: every language you ship

For each locale the product supports:

### Completeness

- Every key exists in every language file. A missing key shows the raw key
  (`checkout.pay_now`) or silently falls back to another language.
- New keys added in this change exist everywhere (a check script is cheap).
- Placeholders survive translation: `:1`, `{name}`, `%s`, HTML tags. A
  translator who deletes a placeholder breaks the sentence; one who
  translates it breaks the code.
- Server and client agree on the placeholder style.

### Plurals

- English has two forms (one, other). Indonesian usually uses one. Arabic has
  six (zero, one, two, few, many, other). Polish and Russian use few and
  many.
- Test 0, 1, 2, 5, 11, 21, 101 for every pluralised string in every language
  that has plural forms.
- Never build plurals by appending "s" or by `count === 1 ? a : b` in code.
  Use the platform's plural rules (ICU MessageFormat or equivalent).

### Text length

- German and Finnish strings are often 30 to 40% longer than English; short
  labels can double. Chinese and Japanese are shorter but taller.
- Check the places that break first: buttons, tabs, table headers, badges,
  navigation, form labels, error messages, email subject lines, push
  notifications (which truncate early).

### Right to left (Arabic, Hebrew, Persian, Urdu)

- The whole layout mirrors: navigation, alignment, progress, back arrows,
  sliders, steppers.
- Things that do **not** mirror: phone numbers, product codes, media play
  buttons, clocks, logos, graphs with a time axis in some conventions.
- Mixed text: an English product name or a number inside an Arabic sentence
  keeps its own direction.
- Use logical CSS properties (`margin-inline-start`, not `margin-left`), so
  mirroring is automatic.
- Test with a real RTL locale, not only by flipping `dir`.

### Formats

| Thing | What varies | Example of a bug |
|---|---|---|
| Dates | Order, separators, month names, calendars | 03/04 read as March 4 or April 3 |
| Times | 12 vs 24 hour, AM/PM words | 00:30 shown as 12:30 AM in a 24 hour country |
| Week | First day (Monday, Sunday, Saturday) | Calendar starts on the wrong day |
| Numbers | Decimal and thousand separators | 1.234 is one thousand or one point two |
| Money | Symbol position, decimals, rounding | Two decimals shown for a currency that has none, such as JPY |
| Names | Order, number of parts, one name only | A user with a single name cannot sign up |
| Addresses | Fields, order, postcode format | A required "state" field in a country with none |
| Phone | Country code, length, formatting | A local number rejected because it lacks the country code |
| Sorting | Alphabet order, accents | Ö sorted after Z in German or Swedish |
| Case | Language specific case rules | Turkish dotted and dotless i in case insensitive search |

Format from the locale, store in a neutral form (ISO dates, minor units of
money, E.164 phone numbers), and test the round trip.

### Time zones

- Store instants in UTC; show them in the zone that matters to the reader.
  Decide which zone that is for each screen: the user's, the store's, or the
  event's.
- A ticket bought by someone in London for a concert in Lisbon: which clock does
  each screen show, and does the confirmation say so?
- Opening hours, deadlines and "today" are in the location's zone, not the
  server's.
- Daylight saving in the user's country even when your home country has
  none: the missing hour, the repeated hour.
- Server, database and test runner zones all set explicitly; a test that
  passes only in one zone is flaky (O-14).

### Tone and register

- The product's chosen register is used everywhere (for example informal
  "du" or formal "Sie" in German, "tu" or "vous" in French); mixing them in
  one screen is a bug.
- Honorifics, gendered forms and formal plural where the language needs
  them.
- Idioms and jokes that do not translate.
- Legal and payment wording reviewed by someone who knows the local rules.

## Step 4: a native reader

Machine checks find missing and broken strings. Only a person who reads the
language natively finds the wrong word, the stiff tone, or the sentence that
means something else. Before a launch in a new language, have one read every
changed screen, email and notification.

## Evidence (O-03)

- The pseudo locale screenshot of each changed screen.
- A key check output: "all 6 language files have 1,284 keys; 0 missing".
- For formats: the stored value and the shown value side by side.

## i18n checklist

- [ ] Every text source listed and translatable
- [ ] Pseudo locale walk: no hardcoded, truncated or concatenated text
- [ ] Every new key in every language file; placeholders intact
- [ ] Plurals tested at 0, 1, 2, 5, 11, 21, 101 where languages have forms
- [ ] Longest language checked on buttons, tabs, headers, notifications
- [ ] RTL checked with a real RTL locale, if shipped
- [ ] Dates, times, numbers, money, names, addresses, phones from the locale
- [ ] Time zone of every displayed time decided and shown
- [ ] Register consistent; native reader for new languages
