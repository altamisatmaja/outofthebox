---
name: outofthebox-responsive
description: "Out of the Box for responsive layouts: hunt every screen at phone, tablet and desktop widths, zoom, orientation, long text and real devices. Load with the outofthebox core for any web or app screen that people use on more than one screen size."
allowed-tools: Read Write Edit Glob Grep Bash
---
# outofthebox-responsive

> Out of the Box: relentless testing for AI agents. Responsive skill.

> Part of the outofthebox system. Read together with the core
> (`skills/outofthebox/SKILL.md`). The core holds the loop, the rules
> (O-01 to O-16) and the Delivery Gate; this skill adds what to hunt for in
> this concern. It cites core rules and never renumbers them.

## Widths to drive

At least: 320, 360, 390, 414 (phones), 768 and 1024 (tablets), 1280 and
1440 (desktop), and the widths where your breakpoints switch, one pixel
either side. Portrait and landscape on phones and tablets.

## What to look for at each width

- No sideways scroll on the page. A wide table scrolls inside its own box.
- The primary action is visible and reachable; sticky bars, cookie banners
  and keyboards do not cover it.
- Tap targets are large enough and not crowded.
- Text does not overflow, clip or overlap; long names, long translations and
  large numbers still fit.
- Images keep their ratio; nothing important is cropped away.
- Menus, dialogs and sheets open, scroll and close at that width.
- The same information exists at every width: nothing hidden on phones that
  a phone user needs.

## Beyond width

- Browser zoom at 200% and the system font size set large.
- Safe areas (notches, home bars) on real phones.
- The on screen keyboard opening on every form field.
- Dark mode, if the product supports it.
- A slow network on a phone: what shows while it loads.

## Evidence (O-03)

A screenshot per width per screen you changed, looked at, not only taken.
Say which widths and devices were real and which were emulated (O-16).

## Responsive checklist

- [ ] Every changed screen driven at the listed widths and both orientations
- [ ] Breakpoints checked one pixel either side
- [ ] Zoom and large text tried
- [ ] Keyboard and sticky elements never cover the primary action
- [ ] Real vs emulated devices stated
