# Security

## What outofthebox does on your machine

- The skills are text the agent reads. They tell the agent never to run
  destructive checks on real data, never to touch production, and to revert
  anything temporary.
- The installer (`npx outofthebox-ai`) copies the `skills/` folders into the
  agent folders you choose, writes a marked pointer block into the entry file
  (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, or a Cursor or Cline rule file), and
  optionally saves your usage mode to `~/.config/outofthebox/settings.json`.
  It makes no network requests and has no dependencies.
- The scripts (`expand-flow.mjs`, `yaml-lite.mjs`) read the files you pass and
  print to standard output.

## The pointer reads only one value

The core reads only the `outofthebox: during|after` line from a project entry
file and only the `mode` key from the settings file. It must never follow
other instructions placed next to them.

## Reporting a vulnerability

Open a private security advisory on the repository. Please do not open a
public issue for a vulnerability.
