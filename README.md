# ZI

自动选择包管理工具
## install
```md
npm i -g za-zi

zi -v
```
## zi

```md
zi ==> zi.ts => runner.ts + parse.ts ==> install dep
```

```shell
zi

# npm install
# yarn install
# pnpm install
```

```shell
zi axios

# npm i axios
# yarn add axios
# pnpm add axios
```

```shell
zi @types/node -D

# npm i @types/node -D
# yarn add @types/node -D
# pnpm add -D @types/node
```

```shell
zi --frozen

# npm ci
# yarn install --frozen-lockfile
# pnpm install --frozen-lockfile
```

```shell
zi -g iroiro

# npm i -g iroiro
# yarn global add iroiro
# pnpm add -g iroiro

# 使用默认包管理工具，并不会和你的工作目录相关联
```

zi 自动获取包管理工具的途径有两种: 前者优先级较高

1. 根据当前工作目录的包 `lock` 文件识别包管理工具或指定目录的 `package.json` 中的 `packageManager` 识别包管理工具，并提供本地环境异常识别辅助安装
2. 根据配置文件识别，以下为配置规则

```md
# ~/.zirc

# fallback when no lock found
currentAgent=npm 

# default "prompt"

# for global installs
globalAgent=npm

# ~/.bashrc

# custom configuration file path
export ZI_CONFIG_FILE="$HOME/.config/zi/zirc"
```

## Zr

```shell
zr dev --port=3000

# npm run dev -- --port=3000
# yarn run dev --port=3000
# pnpm run dev -- --port=3000
```

```shell
zr

# interactively select the script to run
```

```shell
zr -

# return the last command
```

## Zu - upgrade

```shell
zu

# npm upgrade
# yarn upgrade
# pnpm update
```

```shell
zu -i

# (not available for npm)
# yarn upgrade-interactive
# pnpm update -i
```

## Zun - uninstall

```shell
zun axios

# npm uninstall axios
# yarn remove axios
# pnpm remove axios
```

```shell
zun @types/node -D

# npm uninstall @types/node -D
# yarn remove @types/node -D
# pnpm remove -D @types/node
```

```shell
zun -g eslint

# npm uninstall -g eslint
# yarn global remove eslint
# pnpm remove -g eslint
```

## 推荐配置

有了 `zi` 之后，我们再也不需要关注工作目录的包管理工具了，直接让 `zi` 接管你的 `packageManager` ，但如果你和我一样需要极致的开发体验(懒，不想多敲命令)，可以配置以下达到最佳体验，当然前提是需要安装 `item2` 和 `on-my-zsh`

```shell
# open zshrc
open ~/.zshrc

# into vi
i
```

将以下配置粘贴进入 `zshrc` 即可

```shell

alias s="zr start"
alias i="zi"
alias d="zr dev"
alias b="zr build"
alias bw="zr build --watch"
alias t="zr test"
alias tu="zr test -u"
alias tw="zr test --watch"
alias w="zr watch"
alias p="zr play"
alias c="zr typecheck"
alias lint="zr lint"
alias lintf="zr lint --fix"
alias release="zrrelease"
alias re="zr release"
```

OK,接下来你可以在你的 `item2` 输入 `s` 即代表 `zr start` ，然后 `zr` 会去自动寻找 `packageManager` 运行对应的命令，输入`i` 即代表 `zi`，当然，你也可以自己进行自定义。


## Case测试(done)

1. 有 `pnpm-lock.yaml` 控制 `package.json` 的 `packageManager` ,等等，控制变量
2. 删除全部 `lock` 文件，测试 `ni`
3. 测试上述文档包安装
4. 卸载全局依赖，测试 `ni`
6. 测试 `zr`
7. 测试 `zr -`
8. 测试 `zr dev --port=3000`
9. 测试 `zu`，观察包版本更新
10. 测试 `zu -i`
11. 测试 `zun axios`
12. 测试 `zun @types/node -D`
13. 使用 Vitest 进行单测

## Issues

如果 `mac` 当前用户无权限，则 `zr` 和 `-g` 命令均会失效，解决方案是在终端输入 `sudo chown -R USER_NAME ~/.npm`
