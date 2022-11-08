import { existsSync, promises as fs } from 'fs'
import { resolve } from 'path'
import { tmpdir } from 'os'

export interface Storage {
  lastRunCommand?: string
}

let storage: Storage | undefined
// find _storage.json path
const storageDir = resolve(tmpdir(), 'za-zi')
const storagePath = resolve(storageDir, '../_storage.json')

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
  if (storage) {
    if (!existsSync(storageDir))
      await fs.mkdir(storageDir, { recursive: true })
    await fs.writeFile(storagePath, JSON.stringify(storage), 'utf-8')
  }
}
