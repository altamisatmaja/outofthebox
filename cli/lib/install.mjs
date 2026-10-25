import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const START = '<!-- outofthebox:start -->'
export const END = '<!-- outofthebox:end -->'

// Where each agent reads skills and its session entry file. Project paths are
// relative to the project; global paths are relative to the home folder.
export const AGENTS = {
  claude: { label: 'Claude Code', project: { skills: '.claude/skills', entry: 'CLAUDE.md' }, global: { skills: '.claude/skills', entry: '.claude/CLAUDE.md' } },
  codex: { label: 'Codex, Amp, OpenCode, Copilot and other AGENTS.md readers', project: { skills: '.agents/skills', entry: 'AGENTS.md' }, global: { skills: '.codex/skills', entry: '.codex/AGENTS.md' } },
  gemini: { label: 'Gemini CLI', project: { skills: '.gemini/skills', entry: 'GEMINI.md' }, global: { skills: '.gemini/skills', entry: '.gemini/GEMINI.md' } },
  cursor: { label: 'Cursor', project: { skills: '.cursor/skills', rule: '.cursor/rules/outofthebox.mdc' }, global: null },
  cline: { label: 'Cline', project: { skills: '.cline/skills', rule: '.clinerules/outofthebox.md' }, global: null },
}

export function listSkills(source) {
  return fs
    .readdirSync(path.join(source, 'skills'), { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(source, 'skills', e.name, 'SKILL.md')))
    .map((e) => e.name)
    .sort((a, b) => (a === 'outofthebox' ? -1 : b === 'outofthebox' ? 1 : a.localeCompare(b)))
}

export function pointerBlock(skillsDir, skills) {
  const lines = skills.map((s) => `- ${s}: ${skillsDir}/${s}/SKILL.md`)
  return [
    START,
    'You use outofthebox (Out of the Box: relentless testing for AI agents). Before calling any work done, and whenever asked to test, check, verify or QA, load the core skill and hunt: name concrete cases out loud, prove each check fails on the old version, drive the real product once, and stop only when a full round finds nothing new.',
    'Load the matching skill before starting (read its SKILL.md):',
    ...lines,
    'Resolve the usage mode as the core says: session instruction, then project preference, then global preference, then ask.',
    END,
  ].join('\n')
}

// Replaces an existing outofthebox block, or appends one. Never touches the
// rest of the file.
export function writePointer(file, block) {
  let text = ''
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {}
  const at = text.indexOf(START)
  const end = text.indexOf(END)
  let next
  if (at >= 0 && end > at) next = text.slice(0, at) + block + text.slice(end + END.length)
  else next = text + (text === '' || text.endsWith('\n\n') ? '' : text.endsWith('\n') ? '\n' : '\n\n') + block + '\n'
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, next)
}

export function removePointer(file) {
  let text
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {
    return false
  }
  const at = text.indexOf(START)
  const end = text.indexOf(END)
  if (at < 0 || end < at) return false
  const next = (text.slice(0, at).replace(/\n+$/, '\n') + text.slice(end + END.length).replace(/^\n+/, '')).replace(/^\n+$/, '')
  // A file that held only the pointer was ours; remove it rather than leave it empty.
  if (next.trim() === '') fs.rmSync(file)
  else fs.writeFileSync(file, next)
  return true
}

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true })
  fs.cpSync(from, to, { recursive: true })
}

// Copies the skills, then writes the pointer. Returns what it touched so the
// caller can report it.
export function install({ source, skills, agents, scope = 'project', dir = process.cwd(), home = os.homedir() }) {
  const base = scope === 'global' ? home : dir
  const done = []
  for (const name of agents) {
    const agent = AGENTS[name]
    if (!agent) throw new Error(`unknown agent "${name}"; choose from ${Object.keys(AGENTS).join(', ')}`)
    const target = agent[scope]
    if (!target) {
      done.push({ agent: name, skipped: `${agent.label} has no ${scope} install; use a project install` })
      continue
    }
    const skillsRoot = path.join(base, target.skills)
    for (const skill of skills) copyDir(path.join(source, 'skills', skill), path.join(skillsRoot, skill))
    const shown = scope === 'global' ? path.join('~', target.skills) : target.skills
    const block = pointerBlock(shown, skills)
    if (target.entry) writePointer(path.join(base, target.entry), block)
    if (target.rule) {
      const head = target.rule.endsWith('.mdc')
        ? '---\ndescription: Always-on outofthebox pointer.\nglobs: **/*\nalwaysApply: true\n---\n\n'
        : ''
      fs.mkdirSync(path.dirname(path.join(base, target.rule)), { recursive: true })
      fs.writeFileSync(path.join(base, target.rule), head + block + '\n')
    }
    done.push({ agent: name, skills: skillsRoot, entry: target.entry || target.rule })
  }
  return done
}

export function uninstall({ agents, scope = 'project', dir = process.cwd(), home = os.homedir(), skills }) {
  const base = scope === 'global' ? home : dir
  const done = []
  for (const name of agents) {
    const target = AGENTS[name]?.[scope]
    if (!target) continue
    for (const skill of skills) fs.rmSync(path.join(base, target.skills, skill), { recursive: true, force: true })
    if (target.entry) removePointer(path.join(base, target.entry))
    if (target.rule) fs.rmSync(path.join(base, target.rule), { force: true })
    done.push(name)
  }
  return done
}

// Agents that already hold an outofthebox install in this scope, for --update.
export function installed({ scope = 'project', dir = process.cwd(), home = os.homedir() }) {
  const base = scope === 'global' ? home : dir
  return Object.entries(AGENTS)
    .filter(([, a]) => a[scope] && fs.existsSync(path.join(base, a[scope].skills, 'outofthebox', 'SKILL.md')))
    .map(([name]) => name)
}
