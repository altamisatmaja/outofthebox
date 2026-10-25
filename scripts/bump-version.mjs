#!/usr/bin/env node
// Sets one version everywhere it is written, then rebuilds outofthebox.md.
//
//   node scripts/bump-version.mjs 0.2.0
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MANIFESTS } from './check-repo.mjs'
import { buildSingle } from './build-single.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const next = process.argv[2]
if (!/^\d+\.\d+\.\d+$/.test(next || '')) {
  console.error('usage: bump-version.mjs <major.minor.patch>')
  process.exit(2)
}
fs.writeFileSync(path.join(root, 'VERSION'), next + '\n')
for (const file of MANIFESTS) {
  const p = path.join(root, file)
  const doc = JSON.parse(fs.readFileSync(p, 'utf8'))
  if ('version' in doc) doc.version = next
  for (const plugin of doc.plugins || []) if ('version' in plugin) plugin.version = next
  fs.writeFileSync(p, JSON.stringify(doc, null, 2) + '\n')
}
fs.writeFileSync(path.join(root, 'outofthebox.md'), buildSingle())
console.log(`version ${next} written to VERSION, ${MANIFESTS.length} manifests and outofthebox.md`)
