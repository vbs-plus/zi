import { execSync } from 'child_process'
import os from 'os'
import fs from 'fs'
import { resolve } from 'path'

export function remove<T>(arr: T[], v: T) {
  const index = arr.indexOf(v)
  if (index >= 0)
    arr.splice(index, 1)

  return arr
}

// did not change arr
export function exclude<T>(arr: T[], v: T) {
  return remove(arr.slice(), v)
}

/** 判断命令是否有效 */
export function cmdExists(cmd: string) {
  try {
    // #8 执行系统命令
    execSync(
      // https://juejin.cn/post/6908367114315235341
      os.platform() === 'win32'
        ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
        : `command -v ${cmd}`,
    )
    return true
  }
  catch {
    return false
  }
}

export function getPackageJson(cwd = process.cwd()): any {
  const path = resolve(cwd, 'package.json')

  if (fs.existsSync(path)) {
    try {
      const raw = fs.readFileSync(path, 'utf-8')
      return JSON.parse(raw)
    }
    catch (error) {
      console.warn('解析 package.json 失败')
      process.exit(0)
    }
  }
}
