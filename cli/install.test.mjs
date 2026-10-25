import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { START, END, install, installed, listSkills, removePointer, uninstall, writePointer } from './lib/install.mjs'
import { readMode, saveMode, settingsPath } from './lib/settings.mjs'

const source = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'outofthebox-'))
const count = (text, s) => text.split(s).length - 1

test('the core skill is listed first', () => {
  assert.equal(listSkills(source)[0], 'outofthebox')
})

test('installing keeps what the entry file already said', () => {
  const dir = tmp()
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# My project\n\nKeep this line.\n')
  install({ source, skills: ['outofthebox'], agents: ['claude'], dir })
  const text = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8')
  assert.match(text, /^# My project\n\nKeep this line\.\n\n<!-- outofthebox:start -->/)
  assert.ok(fs.existsSync(path.join(dir, '.claude/skills/outofthebox/SKILL.md')))
})

test('installing twice leaves one pointer, not two', () => {
  const dir = tmp()
  install({ source, skills: ['outofthebox'], agents: ['claude'], dir })
  install({ source, skills: ['outofthebox', 'outofthebox-qa'], agents: ['claude'], dir })
  const text = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8')
  assert.equal(count(text, START), 1)
  assert.match(text, /outofthebox-qa\/SKILL\.md/)
})

test('a reinstall drops files removed from a skill', () => {
  const dir = tmp()
  install({ source, skills: ['outofthebox'], agents: ['claude'], dir })
  const stale = path.join(dir, '.claude/skills/outofthebox/old.md')
  fs.writeFileSync(stale, 'gone in the new release')
  install({ source, skills: ['outofthebox'], agents: ['claude'], dir })
  assert.equal(fs.existsSync(stale), false)
})

test('uninstalling restores the entry file and removes a file that held only the pointer', () => {
  const dir = tmp()
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# Mine\n')
  install({ source, skills: ['outofthebox'], agents: ['claude', 'codex'], dir })
  uninstall({ agents: ['claude', 'codex'], dir, skills: listSkills(source) })
  assert.equal(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), '# Mine\n')
  assert.equal(fs.existsSync(path.join(dir, 'AGENTS.md')), false)
  assert.equal(fs.existsSync(path.join(dir, '.claude/skills/outofthebox')), false)
})

test('text after the pointer survives a rewrite and a removal', () => {
  const file = path.join(tmp(), 'AGENTS.md')
  fs.writeFileSync(file, `top\n\n${START}\nold\n${END}\n\nbottom\n`)
  writePointer(file, `${START}\nnew\n${END}`)
  assert.equal(fs.readFileSync(file, 'utf8'), `top\n\n${START}\nnew\n${END}\n\nbottom\n`)
  assert.equal(removePointer(file), true)
  assert.equal(fs.readFileSync(file, 'utf8'), 'top\nbottom\n')
})

test('a global install writes under home, not the project', () => {
  const dir = tmp()
  const home = tmp()
  install({ source, skills: ['outofthebox'], agents: ['claude'], scope: 'global', dir, home })
  assert.ok(fs.existsSync(path.join(home, '.claude/skills/outofthebox/SKILL.md')))
  assert.ok(fs.existsSync(path.join(home, '.claude/CLAUDE.md')))
  assert.deepEqual(fs.readdirSync(dir), [])
  assert.deepEqual(installed({ scope: 'global', dir, home }), ['claude'])
})

test('agents with no global install are skipped, not written somewhere odd', () => {
  const home = tmp()
  const [r] = install({ source, skills: ['outofthebox'], agents: ['cursor'], scope: 'global', home })
  assert.ok(r.skipped)
  assert.deepEqual(fs.readdirSync(home), [])
})

test('cursor gets an always-on rule file', () => {
  const dir = tmp()
  install({ source, skills: ['outofthebox'], agents: ['cursor'], dir })
  const rule = fs.readFileSync(path.join(dir, '.cursor/rules/outofthebox.mdc'), 'utf8')
  assert.match(rule, /^---\ndescription: .*\nglobs: \*\*\/\*\nalwaysApply: true\n---/)
})

test('an unknown agent is refused', () => {
  assert.throws(() => install({ source, skills: ['outofthebox'], agents: ['nope'], dir: tmp() }), /unknown agent/)
})

test('the saved mode round trips and "ask" clears it', () => {
  const file = path.join(tmp(), 'cfg/settings.json')
  saveMode('during', file)
  assert.equal(readMode(file), 'during')
  saveMode('ask', file)
  assert.equal(readMode(file), null)
  assert.throws(() => saveMode('sometimes', file), /mode must be/)
})

test('a broken settings file reads as no mode instead of crashing', () => {
  const file = path.join(tmp(), 'settings.json')
  fs.writeFileSync(file, '{not json')
  assert.equal(readMode(file), null)
})

test('settings live under XDG_CONFIG_HOME, or APPDATA on Windows', () => {
  assert.equal(settingsPath({ XDG_CONFIG_HOME: '/x' }, 'linux'), path.join('/x', 'outofthebox', 'settings.json'))
  assert.equal(settingsPath({ APPDATA: 'C:\\A' }, 'win32'), path.join('C:\\A', 'outofthebox', 'settings.json'))
})
