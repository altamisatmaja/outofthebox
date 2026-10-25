# Contributing

The most useful contribution is a **missed case**: the agent hunted with
outofthebox and still missed something. Open a "Missed case" issue with the
actor, input, state and order of events, what it cost, and which atlas axis
should have caught it.

## Pull requests

A pull request carries:

1. **The case it catches.** A rule, atlas question or heuristic is added
   because a real case was missed, not because it sounds thorough.
2. **No renumbering.** Core rules keep their numbers (O-01 to O-16). New rules
   take the next number. Concern skills cite core rules by number and never
   copy their text.
3. **Both files of the atlas.** A new question goes in
   `references/edge-case-atlas.md` (for people) and `references/atlas.yaml`
   (for the expander), with an impact rank.
4. **Sources that hold up.** A claim in `references/research.md` cites the
   paper and states only what the paper or its abstract says.
5. **Green checks.** `npm test` passes. It runs the installer and YAML tests
   and `scripts/check-repo.mjs` (versions in sync, skill names match folders,
   cited rules exist, links resolve, no em or en dashes, `outofthebox.md`
   rebuilt).
6. **A new test proven on the old code.** For installer or script changes,
   say that the new test failed before your change.

## Releasing

```
node scripts/bump-version.mjs 0.2.0
npm test
```

Then add the release to `ROADMAP.md`.
