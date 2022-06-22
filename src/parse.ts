import { version } from '../package.json'
import type { Agent, Command } from './enums'
import { AGENTS } from './enums'
import type{ Runner } from './type'
import { exclude } from './utils'

/** 解析命令语句，并替换 */
export const parseZi = <Runner>((agent, args, ctx) => {
  // eslint-disable-next-line no-console
  console.log(agent, args, ctx, 'parseZi')

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

export function getCommand(agent: Agent, command: Command, args: string[] = []) {
  if (!(agent in AGENTS))
    throw new Error(`暂不支持 agent "${agent}"`)

  const agentCommand = AGENTS[agent][command]

  // includes run
  if (typeof agentCommand === 'function')
    return agentCommand(args)

  if (!agentCommand)
    throw new Error(`命令 "${command}" 在 "${agent}" 暂不支持`)
  // replace {0}
  return agentCommand.replace('{0}', args.join(' ').trim())
}
