import fs from 'fs'
import path from 'path'
import { findUp } from 'find-up'
import ini from 'ini'
import type { Agent } from './enums'
import { LOCKS } from './enums'

interface Config {
  currentAgent: Agent | 'prompt'
  globalAgent: Agent
}

const defaultConfig: Config = {
  currentAgent: 'prompt',
  globalAgent: 'npm',
}

// 读取配置文件地址
// 默认地址为 ~/.zirc
// 自定义地址 export ZI_CONFIG_FILE="$HOME/.config/zi/zirc"
const home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
const defaultRCPath = path.join(home || '~/', '.zirc')
const customRCPath = process.env.ZI_CONFIG_FILE

const rcPath = customRCPath || defaultRCPath

let config: Config | undefined

// 根据不同的配置文件定位 agent
export async function getConfig(): Promise<Config> {
  if (!config) {
    // find packageJSONPath https://www.npmjs.com/package/find-up
    const result = (await findUp('package.json')) || ''
    let packageManager = ''

    // packageManager: pnpm@7.0.0
    if (result) {
      packageManager
        = JSON.parse(fs.readFileSync(result, 'utf8')).packageManager ?? ''
    }
    // parse agent/version
    const [, agent, version]
      = packageManager.match(
        new RegExp(`^(${Object.values(LOCKS).join('|')})@(\d).*?$`),
      ) || []

    // 最终改写默认agent 需要额外处理 yarn 2.x
    if (agent) {
      config = Object.assign({}, defaultConfig, {
        defaultAgent:
          agent === 'yarn' && parseInt(version) > 1 ? 'yarn@berry' : agent,
      })
    }
    // 默认为 defaultConfig
    else if (!fs.existsSync(rcPath)) {
      config = defaultConfig
    }
    else {
      // 合并配置
      config = Object.assign(
        {},
        defaultConfig,
        // https://www.npmjs.com/package/ini
        ini.parse(fs.readFileSync(rcPath, 'utf-8')),
      )
    }
  }
  return config
}

export async function getDefaultAgent() {
  const { currentAgent } = await getConfig()
  // prompt代表默认无agent行为
  if (currentAgent === 'prompt' && process.env.CI)
    return 'npm'
  return currentAgent
}

export async function getGlobalAgent() {
  const { globalAgent } = await getConfig()
  return globalAgent
}
