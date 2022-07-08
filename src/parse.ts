import type { Choice } from 'prompts'
import prompts from 'prompts'
import { version } from '../package.json'
import type { Agent, Command } from './enums'
import { AGENTS } from './enums'
import { dump, loadStorage } from './storage'
import type{ Runner } from './type'
import { exclude, getPackageJson } from './utils'

export function getCommand(
  agent: Agent,
  command: Command,
  args: string[] = [],
) {
  if (!(agent in AGENTS))
    throw new Error(`暂不支持 agent "${agent}"`)

  const agentCommand = AGENTS[agent][command]

  // includes run
  if (typeof agentCommand === 'function')
    return agentCommand(args)

  if (!agentCommand)
    throw new Error(`命令 "${command}" 在 "${agent}" 暂不支持`)
  // replace {0}
  return agentCommand.replace('{0}', args.join(' ')).trim()
}

export const getNrCommand = <Runner>((agent, args) => {
  if (args.length === 0)
    args.push('start')

  return getCommand(agent, 'run', args)
})

/** 解析命令语句，并替换 */
export const parseZi = <Runner>((agent, args) => {
  // eslint-disable-next-line no-console
  // console.log(agent, args, ctx, 'parseZi')

  // zi -v
  if (args.length === 1 && args[0] === '-v') {
    // eslint-disable-next-line no-console
    console.log(`zi 当前版本为 v${version}`)
    process.exit(1)
  }

  // zi -g iroiro
  if (args.includes('-g'))
    return getCommand(agent, 'global', exclude(args, '-g'))

  // zi --frozen
  if (args.includes('--frozen'))
    return getCommand(agent, 'frozen', exclude(args, '--frozen'))

  // zi
  if (args.length === 0 || args.every(i => i.startsWith('-')))
    return getCommand(agent, 'install', args)
  // zi @types/node -D ...
  return getCommand(agent, 'add', args)
})

export const parseZr = <Runner>(async (agent, args, ctx) => {
  // TODO: 存在一个潜在问题，用户电脑无权限，则zr失效，会报443问题
  // eslint-disable-next-line no-console
  // console.log(agent, args, ctx, "parseZr");
  const storage = (await loadStorage())!

  // zr -
  if (args[0] === '-') {
    if (!storage?.lastRunCommand) {
      console.error('上一次命令未找到')
      process.exit(1)
    }
    args[0] = storage.lastRunCommand
  }

  // zr ,识别scripts，进入选择运行
  if (args.length === 0) {
    const pkg = getPackageJson(ctx?.cwd)
    const scripts = pkg.scripts || {}
    const names = Object.entries(scripts) as [string, string][]

    if (!names.length)
      return

    const choices: Choice[] = names
      .filter(item => !item[0].startsWith('?'))
      .map(([value, cmd]) => ({
        title: value,
        value,
        description: scripts[`?${value}`] || cmd,
      }))

    // 上次命令置顶选项
    if (storage?.lastRunCommand) {
      const last = choices.find(i => i.value === storage.lastRunCommand)
      if (last)
        choices.unshift(last)
    }

    try {
      const { fn } = await prompts({
        name: 'fn',
        message: '请选择要运行的 script',
        type: 'autocomplete',
        choices,
      })

      if (!fn)
        return

      args.push(fn)
    }
    catch (error) {
      process.exit(1)
    }
  }

  // zr dev --port=3000
  if (storage.lastRunCommand !== args[0]) {
    storage.lastRunCommand = args[0]
    dump()
  }

  return getNrCommand(agent, args)
})

// upgrade 工作目录全依赖更新
export const parseZu = <Runner>((agent, args) => {
  if (args.includes('-i'))
    return getCommand(agent, 'upgrade-interactive', exclude(args, '-i'))

  return getCommand(agent, 'upgrade', args)
})

// uninstall
export const parseZun = <Runner>((agent, args) => {
  if (args.includes('-g'))
    return getCommand(agent, 'global_uninstall', exclude(args, '-g'))

  return getCommand(agent, 'uninstall', args)
})

