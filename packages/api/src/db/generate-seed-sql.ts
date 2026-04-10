/**
 * Generates a SQL seed file from the TypeScript seed data.
 * Run: bun run packages/api/src/db/generate-seed-sql.ts
 * Output: packages/api/src/db/seed.sql
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { frameworkSeeds, modeSeeds, programSeeds } from './seed.js'

function escapeSQL(value: string): string {
  return value.replace(/'/g, "''")
}

function toSQL(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? '1' : '0'
  if (typeof value === 'string') return `'${escapeSQL(value)}'`
  if (typeof value === 'object') return `'${escapeSQL(JSON.stringify(value))}'`
  return `'${escapeSQL(String(value))}'`
}

const lines: string[] = ['-- Synergy App Seed Data', '-- Generated from packages/api/src/db/seed.ts', '']

// Frameworks
lines.push('-- Frameworks')
for (const fw of frameworkSeeds) {
  lines.push(
    `INSERT INTO frameworks (id, slug, name, description, color, mode_count) VALUES (${toSQL(fw.id)}, ${toSQL(fw.slug)}, ${toSQL(fw.name)}, ${toSQL(fw.description)}, ${toSQL(fw.color)}, ${toSQL(fw.modeCount)});`,
  )
}
lines.push('')

// Modes
lines.push('-- Modes')
for (const mode of modeSeeds) {
  lines.push(
    `INSERT INTO modes (id, framework_id, slug, name, purpose, trigger, flow_name, fields_schema, ai_coach_prompts, done_signal, metrics_schema, composability_hooks, time_estimate_minutes, sort_order) VALUES (${toSQL(mode.id)}, ${toSQL(mode.frameworkId)}, ${toSQL(mode.slug)}, ${toSQL(mode.name)}, ${toSQL(mode.purpose)}, ${toSQL(mode.trigger)}, ${toSQL(mode.flowName)}, ${toSQL(mode.fieldsSchema)}, ${toSQL(mode.aiCoachPrompts)}, ${toSQL(mode.doneSignal)}, ${toSQL(mode.metricsSchema)}, ${toSQL(mode.composabilityHooks)}, ${toSQL(mode.timeEstimateMinutes)}, ${toSQL(mode.sortOrder)});`,
  )
}
lines.push('')

// Training Programs
lines.push('-- Training Programs')
for (const prog of programSeeds) {
  lines.push(
    `INSERT INTO training_programs (id, slug, name, description, duration_days, frameworks_required, mode_sequence, target_stage) VALUES (${toSQL(prog.id)}, ${toSQL(prog.slug)}, ${toSQL(prog.name)}, ${toSQL(prog.description)}, ${toSQL(prog.durationDays)}, ${toSQL(prog.frameworksRequired)}, ${toSQL(prog.modeSequence)}, ${toSQL(prog.targetStage)});`,
  )
}

const sql = lines.join('\n')
const outPath = join(import.meta.dirname!, 'seed.sql')
writeFileSync(outPath, sql)
console.log(`Seed SQL written to ${outPath} (${lines.length} lines)`)
