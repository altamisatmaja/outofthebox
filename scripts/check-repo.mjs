#!/usr/bin/env node
// The rules outofthebox applies to other people's work, applied to this repo.
// Run before opening a pull request:
//
//   node scripts/check-repo.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseYaml } from '../skills/outofthebox/scripts/yaml-lite.mjs'
import { buildSingle } from './build-single.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

export const MANIFESTS = [
  'package.json',
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.codex-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
  '.kimi-plugin/plugin.json',
  '.omp-plugin/marketplace.json',
]

function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

export function check() {
  const problems = []
  const version = read('VERSION').trim()

  for (const file of MANIFESTS) {
    const doc = JSON.parse(read(file))
    const versions = ['version' in doc ? doc.version : null, ...(doc.plugins || []).map((p) => p.version)].filter((v) => v != null)
    for (const v of versions) if (v !== version) problems.push(`${file}: version ${v}, VERSION says ${version}`)
  }
  for (const file of ['.cursor-plugin/marketplace.json', '.agents/plugins/marketplace.json', 'plugin.json']) JSON.parse(read(file))

  const skills = fs.readdirSync(path.join(root, 'skills')).filter((d) => fs.existsSync(path.join(root, 'skills', d, 'SKILL.md')))
  const core = read('skills/outofthebox/SKILL.md')
  const defined = new Set([...core.matchAll(/^#### (O-\d\d):/gm)].map((m) => m[1]))
  if (defined.size === 0) problems.push('core defines no O-XX rules')

  for (const skill of skills) {
    const file = `skills/${skill}/SKILL.md`
    const text = read(file)
    const front = text.match(/^---\n([\s\S]*?)\n---\n/)
    if (!front) problems.push(`${file}: no frontmatter`)
    else {
      const name = front[1].match(/^name: (.+)$/m)?.[1]
      if (name !== skill) problems.push(`${file}: name "${name}" does not match its folder`)
      if (!/^description: .{40,}/m.test(front[1])) problems.push(`${file}: description missing or too short to match on`)
    }
    for (const rule of new Set([...text.matchAll(/\bO-\d\d\b/g)].map((m) => m[0]))) {
      if (!defined.has(rule) && !/O-XX|O-01 to O-\d\d/.test(rule)) problems.push(`${file}: cites ${rule}, which the core does not define`)
    }
    for (const rule of ['rules/outofthebox.md', 'rules/outofthebox.mdc']) {
      if (!read(rule).includes(`skills/${skill}/SKILL.md`)) problems.push(`${rule}: does not point at ${skill}`)
    }
  }

  for (const file of walk('.')) {
    if (!/\.(md|mdc|ya?ml|json|mjs|js)$/.test(file)) continue
    const text = read(file)
    if (/[\u2014\u2013]/.test(text)) problems.push(`${file}: contains an em or en dash`)
    if (file.endsWith('.md') && file.startsWith('skills')) {
      for (const [, link] of text.matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)) {
        if (/^[a-z]+:/.test(link)) continue
        if (!fs.existsSync(path.join(root, path.dirname(file), link))) problems.push(`${file}: broken link ${link}`)
      }
    }
    if (/\.ya?ml$/.test(file) && file.startsWith('skills')) {
      try {
        parseYaml(text)
      } catch (err) {
        problems.push(`${file}: ${err.message}`)
      }
    }
  }

  const single = path.join(root, 'outofthebox.md')
  if (!fs.existsSync(single) || fs.readFileSync(single, 'utf8') !== buildSingle()) {
    problems.push('outofthebox.md is stale; run node scripts/build-single.mjs')
  }
  return problems
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const problems = check()
  if (problems.length) {
    console.error(problems.map((p) => `FAIL ${p}`).join('\n'))
    process.exit(1)
  }
  console.log('check-repo: PASS')
}
