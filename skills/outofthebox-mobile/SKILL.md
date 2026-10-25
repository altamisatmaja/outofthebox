---
name: outofthebox-mobile
description: "Out of the Box for mobile apps: hunt interruptions, backgrounding, process death, permissions, flaky networks, offline use, push notifications, deep links, app updates, store builds, device and OS fragmentation, battery and storage limits on iOS and Android, Flutter, React Native or native. Load with the outofthebox core for any change to a mobile app or a mobile web flow."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-mobile

> Out of the Box: relentless testing for AI agents. Mobile skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## The phone is not a small desktop

A desktop browser tab sits still. A phone app is interrupted, frozen, killed,
moved between networks, denied permissions, and restored from a snapshot,
all while the user expects it to remember where they were. Most mobile bugs
are not on the happy path but in the moments around it.

## 1. Interruptions and lifecycle

For each step of the flow you changed, do each of these in the middle of it,
then come back:

- Receive a call; answer it; hang up.
- Receive a notification and tap it (it opens another screen or app).
- Switch to another app for 10 seconds, then for 10 minutes.
- Lock the screen; unlock.
- Rotate the device (if rotation is allowed); split screen on tablets.
- Pull down the control centre or notification shade.
- Trigger the OS low battery warning, or plug in the charger.
- **Process death:** background the app, then let the OS kill it (Android
  "Don't keep activities" developer option; iOS memory pressure), and
  return. The app restarts from a saved state; is the form, the cart, the
  half done payment still right?

Ask after each: is the data the user entered still there? Is the screen the
same? Is any timer (OTP countdown, payment deadline) still correct? Was any
request sent twice?

## 2. Network

- Start the flow on Wi-Fi, finish it on mobile data; and the reverse.
- Airplane mode in the middle of a request; then back online.
- A slow 3G profile: what does the user see while waiting? Can they tap
  the button again? (See O-13: a double payment is money loss.)
- A captive portal (hotel Wi-Fi) that returns an HTML page instead of JSON.
- A request that succeeds on the server but whose response never arrives:
  does the app retry safely, and does it show the real outcome when it
  comes back?
- Offline use: what works, what is queued, what is refused with a clear
  message?

## 3. Permissions

For every permission the change uses (camera, photos, location, contacts,
notifications, microphone, Bluetooth, tracking):

- First request: is the reason clear before the OS prompt appears?
- Denied once; denied "don't ask again" (Android) or denied in Settings (iOS).
- Granted, then revoked in Settings while the app is in the background.
- "Only this time" and "approximate location" variants.
- Does the app still work, with a clear way to grant later, when denied?

## 4. Push notifications and deep links

- Notification received with the app in the foreground, background and
  killed. Each opens the right screen with the right data.
- Tapping an old notification for a record that has since changed or been
  deleted.
- A deep link or universal link opened when signed out, signed in as another
  account, or with the app not installed (does it fall back to the web?).
- Notification permission denied: is anything important lost?
- Push token rotation after reinstall or restore to a new phone.
- Notification text in the user's language, not the server's.

## 5. Devices and OS versions

- The oldest OS version you support and the newest (including the beta if a
  release is close).
- A small phone (around 360 by 640 dp), a large phone, a tablet, a foldable
  if your users have them.
- Notches, rounded corners, home indicators (safe areas).
- Android manufacturer skins that kill background work aggressively.
- Low end device: slow CPU, little memory; long lists and images.
- System font size at the largest; dark mode; reduced motion.
- Storage almost full: downloads, caches and photos.

## 6. Updates and builds

- Update from the previous store version with data in place: is anything
  lost or migrated wrongly? (Old local database, old cached tokens.)
- Fresh install vs update: both paths work.
- A forced update screen, if the API dropped support for old versions; and
  an old version talking to the new API without a forced update.
- The release build, not only the debug build: minification, obfuscation,
  different API keys, different signing, disabled logging.
- The store build's environment points at production, the staging build at
  staging, never mixed (O-02).

## 7. Input and text

- The on screen keyboard covers the focused field or the primary button.
- Number pads on number fields; email keyboards on email fields; one time
  code autofill on OTP fields.
- Paste from another app; autocorrect changing what was typed.
- Emoji and non Latin keyboards.

## 8. Money and time on a phone

- The device clock set wrong, or set to another time zone: deadlines,
  countdowns and "today" still come from the server.
- In app purchases: restore purchases, family sharing, refunds made in the
  store, a purchase completed while the app was killed.
- A payment opened in another app (e-wallet, bank) and the user returns by
  the back button instead of the return link.

## Evidence (O-03, O-16)

Say which devices were **real** and which were **emulated**, and which OS
versions. A flow verified only in a simulator is reported as such. Record a
short screen capture for interruption bugs: they are hard to describe.

## Mobile checklist

- [ ] Every changed step interrupted (call, switch, lock, rotate, process death)
- [ ] Network switch, airplane mode, slow profile, lost response
- [ ] Each permission denied, revoked and granted later
- [ ] Notifications and deep links in foreground, background, killed, signed out
- [ ] Oldest and newest OS, small and large screens, low end device
- [ ] Update from the previous store version with real data
- [ ] Release build tested, environments not mixed
- [ ] Real vs emulated stated
