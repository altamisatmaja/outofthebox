// A small YAML reader for the outofthebox data files, so the scripts run with
// no install. It reads block maps, block lists, scalars, quoted strings,
// inline [a, b] lists and # comments. Anchors, multi documents and | blocks
// are not supported; write those files as plain lists instead.

function scalar(raw) {
  const v = raw.trim()
  if (v === '' || v === '~' || v === 'null') return null
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    const inner = v.slice(1, -1)
    return v[0] === '"' ? inner.replace(/\\"/g, '"').replace(/\\n/g, '\n') : inner.replace(/''/g, "'")
  }
  if (v.startsWith('[') && v.endsWith(']')) {
    const body = v.slice(1, -1).trim()
    return body === '' ? [] : splitInline(body).map(scalar)
  }
  return v
}

function splitInline(body) {
  const out = []
  let cur = ''
  let quote = null
  for (const ch of body) {
    if (quote) {
      cur += ch
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") {
      quote = ch
      cur += ch
    } else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

function stripComment(line) {
  let quote = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") quote = ch
    else if (ch === '#' && (i === 0 || line[i - 1] === ' ')) return line.slice(0, i)
  }
  return line
}

// Splits "key: value" on the first colon followed by a space or the line end,
// outside quotes. Returns null when the line is not a key.
function keyValue(text) {
  let quote = null
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") quote = ch
    else if (ch === ':' && (i === text.length - 1 || text[i + 1] === ' ')) {
      return [scalar(text.slice(0, i)), text.slice(i + 1).trim()]
    }
  }
  return null
}

export function parseYaml(source) {
  const lines = source
    .split(/\r?\n/)
    .map((raw, n) => ({ n: n + 1, text: stripComment(raw).replace(/\s+$/, '') }))
    .filter((l) => l.text.trim() !== '')
    .map((l) => ({ ...l, indent: l.text.length - l.text.trimStart().length, body: l.text.trim() }))
  let i = 0

  function block(indent) {
    if (i >= lines.length) return null
    return lines[i].body.startsWith('- ') || lines[i].body === '-' ? list(indent) : map(indent)
  }

  function list(indent) {
    const out = []
    while (i < lines.length && lines[i].indent === indent && (lines[i].body.startsWith('- ') || lines[i].body === '-')) {
      const line = lines[i]
      const rest = line.body === '-' ? '' : line.body.slice(2)
      i++
      if (rest === '') {
        out.push(i < lines.length && lines[i].indent > indent ? block(lines[i].indent) : null)
      } else if (keyValue(rest)) {
        // "- key: value" opens a map whose keys sit two spaces deeper.
        const inner = indent + 2
        lines.splice(i, 0, { n: line.n, indent: inner, body: rest })
        out.push(map(inner))
      } else {
        out.push(scalar(rest))
      }
    }
    return out
  }

  function map(indent) {
    const out = {}
    while (i < lines.length && lines[i].indent === indent && !lines[i].body.startsWith('- ')) {
      const line = lines[i]
      const kv = keyValue(line.body)
      if (!kv) throw new Error(`line ${line.n}: expected "key: value", got "${line.body}"`)
      const [key, value] = kv
      i++
      if (value !== '') out[key] = scalar(value)
      else if (i < lines.length && lines[i].indent > indent) out[key] = block(lines[i].indent)
      else if (i < lines.length && lines[i].indent === indent && lines[i].body.startsWith('- ')) out[key] = list(indent)
      else out[key] = null
    }
    if (i < lines.length && lines[i].indent > indent) {
      throw new Error(`line ${lines[i].n}: unexpected indent`)
    }
    return out
  }

  const result = block(lines.length ? lines[0].indent : 0)
  if (i < lines.length) throw new Error(`line ${lines[i].n}: could not read "${lines[i].body}"`)
  return result
}
