#!/usr/bin/env node
// outofthebox installer. Copies the skills into the agents you use and writes
// the pointer that loads them every session.
//
//   npx outofthebox-ai                      ask which skills, scope and agents
//   npx outofthebox-ai --yes                all skills, this project, Claude Code and AGENTS.md readers
//   npx outofthebox-ai --skills outofthebox,outofthebox-qa --agents claude,cursor
//   npx outofthebox-ai --global             install under your home folder
//   npx outofthebox-ai --update             refresh every install found here and at home
//   npx outofthebox-ai --uninstall          remove the skills and the pointer
//   npx outofthebox-ai --mode during|after|ask   save or clear the usage mode; --mode alone shows it
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { AGENTS, install, installed, listSkills, uninstall } from './lib/install.mjs'
import { readMode, saveMode, settingsPath } from './lib/settings.mjs'

const source = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const version = fs.readFileSync(path.join(source, 'VERSION'), 'utf8').trim()

function parseArgs(argv) {
  const opts = { flags: new Set() }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (['--skills', '--agents', '--dir'].includes(a)) opts[a.slice(2)] = argv[++i]
    else if (a === '--mode') opts.mode = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : ''
    else if (a.startsWith('--')) opts.flags.add(a.slice(2))
    else throw new Error(`unknown argument "${a}"`)
  }
  return opts
}

async function ask(rl, question, fallback) {
  const answer = (await rl.question(`${question} [${fallback}] `)).trim()
  return answer === '' ? fallback : answer
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const all = listSkills(source)
  const dir = path.resolve(opts.dir || process.cwd())
  const home = os.homedir()
  console.log(`outofthebox ${version}`)

  if (opts.flags.has('help')) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).join('\n').replace(/^\/\/ ?/gm, ''))
    return
  }

  if (opts.mode !== undefined) {
    if (opts.mode === '') console.log(`mode: ${readMode() ?? 'ask (nothing saved)'} (${settingsPath()})`)
    else console.log(`saved mode ${opts.mode} to ${saveMode(opts.mode)}`)
    return
  }

  if (opts.flags.has('update')) {
    let count = 0
    for (const scope of ['project', 'global']) {
      const agents = installed({ scope, dir, home })
      if (agents.length === 0) continue
      for (const r of install({ source, skills: all, agents, scope, dir, home })) {
        if (r.skills) console.log(`updated ${AGENTS[r.agent].label} (${scope}): ${r.skills}`)
        count++
      }
    }
    if (count === 0) console.log('no outofthebox install found here or in your home folder')
    return
  }

  const interactive = !opts.flags.has('yes') && process.stdin.isTTY && !opts.skills && !opts.agents
  let skills = opts.skills && opts.skills !== 'all' ? opts.skills.split(',') : all
  let agents = opts.agents ? opts.agents.split(',') : ['claude', 'codex']
  let scope = opts.flags.has('global') ? 'global' : 'project'

  if (interactive) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    console.log('\nSkills:')
    all.forEach((s, n) => console.log(`  ${n + 1}. ${s}`))
    const pick = await ask(rl, 'Which skills? numbers separated by commas, or all', 'all')
    if (pick !== 'all') skills = pick.split(',').map((n) => all[Number(n.trim()) - 1]).filter(Boolean)
    scope = (await ask(rl, 'Install for this project or globally? project/global', scope)) === 'global' ? 'global' : 'project'
    console.log('\nAgents:')
    Object.entries(AGENTS).forEach(([k, a]) => console.log(`  ${k}: ${a.label}`))
    agents = (await ask(rl, 'Which agents? names separated by commas', agents.join(','))).split(',').map((s) => s.trim())
    rl.close()
  }

  const unknown = skills.filter((s) => !all.includes(s))
  if (unknown.length) throw new Error(`unknown skill ${unknown.join(', ')}; choose from ${all.join(', ')}`)
  if (!skills.includes('outofthebox')) skills = ['outofthebox', ...skills]

  if (opts.flags.has('uninstall')) {
    const removed = uninstall({ agents, scope, dir, home, skills: all })
    console.log(`removed outofthebox from ${removed.join(', ') || 'nothing'} (${scope})`)
    return
  }

  for (const r of install({ source, skills, agents, scope, dir, home })) {
    if (r.skipped) console.log(`skipped ${r.agent}: ${r.skipped}`)
    else console.log(`installed ${skills.length} skills for ${AGENTS[r.agent].label}: ${r.skills}, pointer in ${r.entry}`)
  }
  console.log('Start a new agent session so the skills load.')
}

main().catch((err) => {
  console.error(`outofthebox: ${err.message}`)
  process.exit(1)
})
