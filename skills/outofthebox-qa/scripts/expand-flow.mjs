#!/usr/bin/env node
// Crosses a QA flow's steps with the atlas questions and prints a numbered,
// ranked case table in Markdown. The agent then rewrites each generic row
// into a concrete case (actor, input, state, order) or deletes it with a reason.
//
//   node expand-flow.mjs <qa-flow.yaml> [--atlas <atlas.yaml>]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseYaml } from '../../outofthebox/scripts/yaml-lite.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const IMPACT = { 1: 'money or data loss', 2: 'security or privacy', 3: 'broken flow', 4: 'cosmetic' }

export function expand(flow, atlas) {
  const steps = Array.isArray(flow.steps) ? flow.steps : []
  if (steps.length === 0) throw new Error('the flow has no steps')
  const rows = []
  steps.forEach((step, s) => {
    rows.push({ id: `S${s + 1}`, type: 'scripted', actor: step.actor, case: step.do, expect: step.expect, impact: 3 })
  })
  for (const axis of atlas.axes) {
    for (const q of axis.questions) {
      steps.forEach((step, s) => {
        rows.push({ type: 'unexpected', actor: step.actor, case: `${axis.name}: ${q.text} (step ${s + 1}: ${step.do})`, expect: 'unknown', impact: q.impact })
      })
    }
  }
  for (const pack of flow.packs || []) {
    for (const item of atlas.packs?.[pack] || []) {
      rows.push({ type: 'unexpected', actor: 'any', case: `${pack}: ${item}`, expect: 'unknown', impact: 1 })
    }
  }
  for (const risk of flow.risks || []) {
    rows.push({ type: 'unexpected', actor: 'any', case: `known risk: ${risk}`, expect: 'unknown', impact: 1 })
  }
  const unexpected = rows.filter((r) => r.type === 'unexpected').sort((a, b) => a.impact - b.impact)
  unexpected.forEach((r, n) => (r.id = `U${n + 1}`))
  return [...rows.filter((r) => r.type === 'scripted'), ...unexpected]
}

const cell = (v) => String(v ?? '').replace(/\|/g, '\\|')

export function toMarkdown(flow, rows) {
  const out = [
    `# Cases: ${flow.feature ?? 'unnamed feature'}`,
    '',
    'Generated from the QA flow and the atlas. Rewrite each unexpected row into a concrete case or delete it with a reason (O-04, O-08).',
    '',
    '| # | Type | Impact | Actor | Case | Expected | Actual | Evidence | Status |',
    '|---|---|---|---|---|---|---|---|---|',
  ]
  for (const r of rows) {
    out.push(`| ${r.id} | ${r.type} | ${IMPACT[r.impact]} | ${cell(r.actor)} | ${cell(r.case)} | ${cell(r.expect)} | | | |`)
  }
  return out.join('\n') + '\n'
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2)
  const flowPath = args.find((a) => !a.startsWith('--'))
  const atlasAt = args.indexOf('--atlas')
  const atlasPath = atlasAt >= 0 ? args[atlasAt + 1] : path.join(here, '../../outofthebox/references/atlas.yaml')
  if (!flowPath) {
    console.error('usage: expand-flow.mjs <qa-flow.yaml> [--atlas <atlas.yaml>]')
    process.exit(2)
  }
  const flow = parseYaml(fs.readFileSync(flowPath, 'utf8'))
  const atlas = parseYaml(fs.readFileSync(atlasPath, 'utf8'))
  process.stdout.write(toMarkdown(flow, expand(flow, atlas)))
}
