# outofthebox guide

Everything you need to install, use, update and remove outofthebox, for each
agent.

## 1. What gets installed

Each skill is a folder with a `SKILL.md`:

| Skill | Load it when |
|---|---|
| `outofthebox` | Always. The loop, rules O-01 to O-16, modes, the Delivery Gate, atlas, heuristics and research live here. |
| `outofthebox-dev` | The agent builds or fixes code and must prove each check on the old version. |
| `outofthebox-qa` | Someone runs a QA pass from a flow, scripted and exploratory. |
| `outofthebox-ui` | Screens and flows: states, widths, languages, other viewers. |
| `outofthebox-api` | Endpoints, webhooks, providers, retries. |
| `outofthebox-data` | Migrations, imports, pipelines, reports. |
| `outofthebox-security` | Access, sharing, links, money, personal data. |
| `outofthebox-auth` | Sign up, sign in, reset, MFA, sessions, tokens. |
| `outofthebox-flow` | End to end business journeys and their invariants. |
| `outofthebox-responsive` | Screens at every width, zoom and device. |
| `outofthebox-infra` | A defensive self audit of your own infrastructure for exposure. |
| `outofthebox-a11y` | Screens, forms, emails and documents people with disabilities must use. |
| `outofthebox-i18n` | More than one language, country or time zone. |
| `outofthebox-mobile` | Mobile apps and mobile web flows. |
| `outofthebox-ai` | Features built on a language model. |
| `outofthebox-docs` | Documents, spreadsheets, decks and processes. |
| `outofthebox-redblue` | Authorized abuse cases paired with detection, alerting and response checks. |

The installer also writes a **pointer block** between
`<!-- outofthebox:start -->` and `<!-- outofthebox:end -->` in the agent's
entry file, so the skills load every session. Nothing outside the block is
touched.

## 2. Where each agent reads it

| Agent | Project skills | Project pointer | Global skills | Global pointer |
|---|---|---|---|---|
| Claude Code | `.claude/skills/` | `CLAUDE.md` | `~/.claude/skills/` | `~/.claude/CLAUDE.md` |
| Codex, Amp, OpenCode, Copilot (`codex`) | `.agents/skills/` | `AGENTS.md` | `~/.codex/skills/` | `~/.codex/AGENTS.md` |
| Gemini CLI | `.gemini/skills/` | `GEMINI.md` | `~/.gemini/skills/` | `~/.gemini/GEMINI.md` |
| Cursor | `.cursor/skills/` | `.cursor/rules/outofthebox.mdc` | none | none |
| Cline | `.cline/skills/` | `.clinerules/outofthebox.md` | none | none |

## 3. Install

### Installer

```
npx outofthebox-ai                 # prompts
npx outofthebox-ai --yes           # all skills, this project, claude + codex
npx outofthebox-ai --skills outofthebox,outofthebox-dev --agents claude
npx outofthebox-ai --global --agents claude,codex,gemini
npx outofthebox-ai --dir ../other-project --yes
```

The core is always included, even when you leave it out of `--skills`.

### Plugins

| Agent | Command |
|---|---|
| Claude Code | `/plugin marketplace add https://github.com/altamisatmaja/outofthebox` then `/plugin install outofthebox@outofthebox` |
| Codex | `codex plugin marketplace add altamisatmaja/outofthebox` then `codex plugin add outofthebox@outofthebox` |
| Cursor | `agent plugin marketplace add https://github.com/altamisatmaja/outofthebox`, then Customize, Install |
| Kimi Code | `/plugins install https://github.com/altamisatmaja/outofthebox` |
| Cline CLI | `cline plugin install https://github.com/altamisatmaja/outofthebox.git` |
| Oh My Pi | `omp plugin marketplace add altamisatmaja/outofthebox` then `omp plugin install outofthebox@outofthebox` |
| Pi | `pi install git:github.com/altamisatmaja/outofthebox` |

Plugin manifests live in `.claude-plugin/`, `.codex-plugin/` and
`.agents/plugins/`, `.cursor-plugin/`, `.kimi-plugin/`, `.cline-plugin/` with
the `cline` key in `package.json`, `.omp-plugin/`, and the `pi` key in
`package.json`.

### By hand

Copy `skills/` into your agent's skills folder and paste the contents of
`rules/outofthebox.md` into its entry file. Or use the single file
`outofthebox.md` alone.

## 4. Choose a mode

```
npx outofthebox-ai --mode during   # save
npx outofthebox-ai --mode after
npx outofthebox-ai --mode ask      # clear, ask every session again
npx outofthebox-ai --mode          # show
```

Saved in `~/.config/outofthebox/settings.json` (or `$XDG_CONFIG_HOME`, or
`%APPDATA%\outofthebox\settings.json` on Windows). Order of precedence: what
you say in the chat, then an `outofthebox: during|after` line in the project
entry file, then the saved mode, then the agent asks.

## 5. Use it

### As a developer

> "Add gifting a ticket to a friend. outofthebox during."

Expect: a numbered risk list before any test; each check run on the old code
with its failure message quoted; the fix; the full suite with numbers; one
real run; the Delivery Gate with PASS/FAIL per line.

### As QA

1. Copy `skills/outofthebox-qa/templates/qa-flow.yaml` and fill it in.
2. `node skills/outofthebox-qa/scripts/expand-flow.mjs my-flow.yaml > cases.md`
3. Ask the agent: "Run this QA flow with outofthebox-qa." It turns the
   generated rows into concrete cases, runs them, and files bugs with
   `templates/bug-report.md`.

### As an auditor

> "outofthebox after, on the checkout module."

It writes `outofthebox/hunt-001-YYYY-MM-DD.md` from `templates/findings.md`.
Reply with the numbers to fix.

## 6. Update

```
npx outofthebox-ai --update
```

Refreshes every install found in the current project and under your home
folder. Plugins update through their own agent. Start a new session after.

## 7. Remove

```
npx outofthebox-ai --uninstall --agents claude,codex
npx outofthebox-ai --uninstall --global --agents claude
```

Removes the skill folders and the pointer block. An entry file that held only
the pointer is deleted; anything else in it is kept.

## 8. Develop outofthebox itself

```
npm test                              # installer and YAML tests, then check-repo
node scripts/build-single.mjs         # rebuild outofthebox.md
node scripts/bump-version.mjs 0.2.0   # one version everywhere
```

See [CONTRIBUTING.md](CONTRIBUTING.md).
