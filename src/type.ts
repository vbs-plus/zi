import type { Agent } from './enums'

export interface RunnerContext {
  hasLock?: boolean
  cwd?: string
}

/** 配置：是否自动安装依赖，当前安装路径 */
export interface DetectOptions {
  autoInstall?: boolean
  cwd?: string
}

export type Runner = (agent: Agent, args: string[], ctx?: RunnerContext) => Promise<string | undefined> | string | undefined
