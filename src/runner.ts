import { resolve } from 'path'
import prompts from 'prompts'
import { execaCommand } from 'execa'
import { getDefaultAgent, getGlobalAgent } from './config'
import { detect } from './detect'
import { agents } from './enums'
import type { Agent } from './enums'
import type { DetectOptions, Runner } from './type'

export async function runCli(fn: Runner, options: DetectOptions = {}) {
  // 移除非有效字符 提取命令行有效参数 https://juejin.cn/post/6844903568365846536
  // zi @types/node -D ==> [ '@types/node', '-D' ]
  const args = process.argv.slice(2).filter(Boolean)

  try {
    // console.log(fn, options, args, 'runCli')
    await run(fn, args, options)
  } catch (error) {
    process.exit(1)
  }
}

export async function run(fn: Runner, args: string[], options: DetectOptions = {}) {
  let command
  let cwd = process.cwd()

  // zi -C packages/foo vite
  if (args[0] === '-C') {
    // concat path
    cwd = resolve(cwd, args[1])
    // remove -C path
    args.splice(0, 2)
  }

  // zi -g iroiro
  const isGlobal = args.includes('-g')
  if (isGlobal) { command = await fn(await getGlobalAgent(), args) }
  // main logic
  else {
    let agent = await detect({ ...options, cwd }) || await getDefaultAgent()
    // 识别不出，则进入默认选择包工具
    if (agent === 'prompt') {
      agent = (
        await prompts({
          name: 'agent',
          type: 'select',
          message: 'Choose the agent',
          choices: agents
            .filter(i => !i.includes('@'))
            .map(value => ({ title: value, value })),
        })
      ).agent
      if (!agent)
        return
    }
    command = await fn(agent as Agent, args, {
      hasLock: Boolean(agent),
      cwd,
    })
  }

  if (!command)
    return

  // console.log(command)
  // run
  await execaCommand(command, { stdio: 'inherit', encoding: 'utf-8', cwd })
}
