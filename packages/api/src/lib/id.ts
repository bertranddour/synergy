import { nanoid } from 'nanoid'

/** Generate a unique ID (21 chars, URL-safe) */
export function newId(): string {
  return nanoid()
}
