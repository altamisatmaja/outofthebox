import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const MODES = ['during', 'after']

export function settingsPath(env = process.env, platform = process.platform) {
  if (platform === 'win32' && env.APPDATA) return path.join(env.APPDATA, 'outofthebox', 'settings.json')
  const base = env.XDG_CONFIG_HOME || path.join(env.HOME || os.homedir(), '.config')
  return path.join(base, 'outofthebox', 'settings.json')
}

export function readMode(file = settingsPath()) {
  try {
    const mode = JSON.parse(fs.readFileSync(file, 'utf8')).mode
    return MODES.includes(mode) ? mode : null
  } catch {
    return null
  }
}

// "ask" removes the saved mode so every session asks again.
export function saveMode(mode, file = settingsPath()) {
  if (mode !== 'ask' && !MODES.includes(mode)) throw new Error(`mode must be during, after or ask, got "${mode}"`)
  let current = {}
  try {
    current = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {}
  if (mode === 'ask') delete current.mode
  else current.mode = mode
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n')
  return file
}
