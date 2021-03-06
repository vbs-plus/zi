import { existsSync, promises as fs } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export interface Storage {
  lastRunCommand?: string
}

let storage: Storage | undefined
// find _storage.json path
const storagePath = resolve(fileURLToPath(import.meta.url), '../_storage.json')

// eslint-disable-next-line no-console
console.log(storagePath, 1121212121212)

/** 记录上一次命令 */
export async function loadStorage(fn?: (storage: Storage) => Promise<boolean> | boolean) {
  if (!storage)
    storage = existsSync(storagePath) ? JSON.parse(await fs.readFile(storagePath, 'utf-8')) || {} : {}

  if (fn) {
    if (await fn(storage!))
      await dump()
  }
  return storage
}

export async function dump() {
  if (storage)
    await fs.writeFile(storagePath, JSON.stringify(storage), 'utf-8')
}
