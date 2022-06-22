# ZI

自动选择包管理工具
## install
```md
npm i -g za-zi
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

TODO：编写文章记录全过程和踩坑点，思维导图系统梳理


**Case测试**

1. 有 `pnpm-lock.yaml` 控制 `package.json` 的 `packageManager` ,等等，控制变量
2. 删除全部 `lock` 文件，测试 `ni`
3. 测试上述文档包安装
4. 卸载全局依赖，测试 `ni`
5. 单测 `parseNi` 边界 `case`
