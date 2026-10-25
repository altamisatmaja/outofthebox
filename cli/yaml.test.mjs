import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseYaml } from '../skills/outofthebox/scripts/yaml-lite.mjs'
import { expand, toMarkdown } from '../skills/outofthebox-qa/scripts/expand-flow.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

test('maps, lists, lists of maps, inline lists and comments', () => {
  const doc = parseYaml(`
# comment
name: "a: b" # trailing comment
count: 3
on: true
none:
tags: [one, "two, three", 4]
items:
  - plain
  - key: v
    other: [x]
nested:
  deeper:
    - 1
url: http://localhost:3000
quote: 'it''s'
`)
  assert.deepEqual(doc, {
    name: 'a: b',
    count: 3,
    on: true,
    none: null,
    tags: ['one', 'two, three', 4],
    items: ['plain', { key: 'v', other: ['x'] }],
    nested: { deeper: [1] },
    url: 'http://localhost:3000',
    quote: "it's",
  })
})

test('a list written at the same indent as its key', () => {
  assert.deepEqual(parseYaml('steps:\n- a\n- b\nnext: 1\n'), { steps: ['a', 'b'], next: 1 })
})

test('a # inside a word or quotes is not a comment', () => {
  assert.deepEqual(parseYaml('a: C#\nb: "x # y"\n'), { a: 'C#', b: 'x # y' })
})

test('a bad line names its line number', () => {
  assert.throws(() => parseYaml('a: 1\n  b: 2\n'), /line 2/)
  assert.throws(() => parseYaml('a: 1\njust text\n'), /line 2/)
})

test('the shipped atlas and flow template parse', () => {
  const atlas = parseYaml(read('skills/outofthebox/references/atlas.yaml'))
  assert.ok(atlas.axes.length >= 9)
  for (const axis of atlas.axes) for (const q of axis.questions) assert.ok([1, 2, 3, 4].includes(q.impact), `${axis.id}: ${q.text}`)
  const flow = parseYaml(read('skills/outofthebox-qa/templates/qa-flow.yaml'))
  assert.equal(flow.steps.length, 3)
})

test('expanding a flow puts scripted cases first, then unexpected ones ranked by impact', () => {
  const atlas = parseYaml(read('skills/outofthebox/references/atlas.yaml'))
  const flow = parseYaml(read('skills/outofthebox-qa/templates/qa-flow.yaml'))
  const rows = expand(flow, atlas)
  assert.deepEqual(rows.slice(0, 3).map((r) => r.id), ['S1', 'S2', 'S3'])
  const impacts = rows.filter((r) => r.type === 'unexpected').map((r) => r.impact)
  assert.deepEqual(impacts, [...impacts].sort((a, b) => a - b))
  assert.ok(rows.some((r) => r.case.startsWith('known risk:')))
  assert.ok(rows.some((r) => r.case.startsWith('payments:')))
})

test('a pipe in a case does not break the table', () => {
  const md = toMarkdown({ feature: 'x' }, [{ id: 'S1', type: 'scripted', impact: 3, actor: 'a|b', case: 'c', expect: 'd' }])
  assert.match(md, /a\\\|b/)
})

test('a flow with no steps is refused', () => {
  assert.throws(() => expand({ steps: [] }, { axes: [] }), /no steps/)
})
