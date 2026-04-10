import { hc } from 'hono/client'
// AppType is imported from the api package at build time via Vite's module resolution.
// For type-checking, we use a path alias that resolves to the api source.
// The actual type import works through Bun's workspace resolution.
import type { AppType } from '@synergy/api'

export const api = hc<AppType>('/')
