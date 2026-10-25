# Roadmap

## 0.1.0 (2026-10-25)

First release.

- Core skill with the hunt loop, rules O-01 to O-16 in three tiers, DURING
  and AFTER modes, and the Delivery Gate.
- Sixteen concern skills: dev, QA, UI, responsive, accessibility, languages
  and regions, mobile, API, data, flow, auth, AI features, documents and
  spreadsheets, security, infra (defensive self audit), red and blue team
  (authorized).
- Prompts to copy (`PROMPTS.md`), a filled example hunt (`examples/`), and
  real incidents mapped to the atlas axes.
- Edge case atlas (Markdown and YAML), heuristics, research notes, reliable
  test and real run references.
- QA flow template in Markdown and YAML, bug report and findings templates,
  and `expand-flow.mjs`, which crosses a flow with the atlas.
- Installer `npx outofthebox-ai` for Claude Code, AGENTS.md readers (Codex,
  Amp, OpenCode, Copilot), Gemini CLI, Cursor and Cline, with a saved usage
  mode.
- Plugin doors: Claude Code, Codex, Cursor, Kimi Code, Cline, Oh My Pi, Pi.
- `outofthebox.md`, the single file version.

## Next

- Domain packs as their own YAML files, so a team can add one for its field.
- A findings to issues exporter (GitHub, Jira) for AFTER mode hunts.
- More missed cases from real hunts, each with the rule or question it added.
