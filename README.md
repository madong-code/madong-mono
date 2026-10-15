> 如需 **标准版本前端【单用户独立版本】**，请访问：[madong-single](https://github.com/madong-code/madong-single) / [madong-aura](https://github.com/madong-code/madong-aura)（管理后台）、[web-nuxt](https://github.com/madong-code/web-nuxt)（门户）。

<div align="center">

<img src="apps/admin/public/logo.png" alt="Madong Logo" width="120" />

# Madong-Saas 前端大仓（Monorepo）

基于 [Vben Admin](https://github.com/vbenjs/vue-vben-admin)（Vue 3 + Vite + TypeScript）的多租户 SaaS 前端工程

[![Node](https://img.shields.io/badge/Node-20.19%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.0%2B-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)

[![Docs](https://img.shields.io/badge/文档-madong.tech-7C3AED)](https://madong.tech)
[![Download](https://img.shields.io/badge/下载中心-madong.tech-10B981)](https://madong.tech/download)

**中文** | [English](./README.en.md)

</div>

## 介绍

Madong-Saas 前端大仓（Monorepo），是基于 [Vben Admin](https://github.com/vbenjs/vue-vben-admin)（Vue 3 + Vite + TypeScript）的多租户 SaaS 前端工程，与后端 [madong-admin-saas](https://github.com/madong-code/madong-admin-saas) 配套使用。

- 采用 pnpm + Turbo 的 Monorepo 架构，应用与公共包分仓管理；
- 内置多端应用：`admin`（租户管理后台）、`platform`（平台 / 租户管理）、`install`（安装向导）、`backend-mock`（接口 Mock）；
- 可复用标准版本前端，但因服务接口存在差异，需针对性调整部分接口。

> 前后端分离部署，前端大仓需单独克隆到 `madong/template` 目录。

## 仓库地址

本项目为 **前端大仓（核心）**，配套后端、门户与工具仓库如下（默认从 GitHub 拉取，网络受限时可改用 Gitee / GitCode 镜像）：

| 模块 | GitHub | Gitee 镜像 | GitCode 镜像 |
| :--- | :--- | :--- | :--- |
| 前端大仓（本仓库） | https://github.com/madong-code/madong-mono | https://gitee.com/motion-code/madong-mono | https://gitcode.com/motion-code/madong-mono |
| 服务后端（SaaS） | https://github.com/madong-code/madong-admin-saas | https://gitee.com/motion-code/madong-admin-saas | https://gitcode.com/motion-code/madong-admin-saas |
| 门户站点（Web，共用） | https://github.com/madong-code/web-nuxt | https://gitee.com/motion-code/web-nuxt | https://gitcode.com/motion-code/web-nuxt |
| AI 技能包 | https://github.com/madong-code/madong-admin-saas-skills | https://gitee.com/motion-code/madong-admin-saas-skills | https://gitcode.com/motion-code/madong-admin-saas-skills |
| 容器环境 | https://github.com/madong-code/docker-webman | https://gitee.com/motion-code/docker-webman | https://gitcode.com/motion-code/docker-webman |

> 完整版本发布与下载见[下载中心](https://madong.tech/download)。

## 运行环境

- Node.js ^20.19.0 || ^22.18.0 || ^24.0.0
- pnpm >= 10.0.0
- Git

## 快速开始

按标准目录布局，将本仓库克隆到 `madong/template`，后端克隆到同级目录 `madong/backend`。

```bash
# 1. 克隆前端大仓
git clone https://github.com/madong-code/madong-mono.git madong/template
cd madong/template

# 2. 安装依赖
pnpm install

# 3. 启动开发服务（以租户管理后台 admin 为例）
pnpm -F @madong/admin dev
# 启动平台管理 platform
pnpm -F @madong/platform dev
# 启动安装向导 install
pnpm -F @madong/install dev

# 4. 构建
pnpm build
```

> `web-nuxt` 门户站点为独立 Nuxt SSR 工程，与多租户版共用，请参考其仓库说明单独部署。

## 目录结构

```
madong/template/                # 前端大仓（本仓库）
├── apps/                       # 应用
│   ├── admin/                  # 租户管理后台（@madong/admin）
│   ├── platform/               # 平台 / 租户管理（@madong/platform）
│   ├── install/                # 安装向导（@madong/install）
│   └── backend-mock/           # 接口 Mock（@vben/backend-mock）
├── packages/                   # 公共包（@core / effects / business / lib / constants / types / icons / styles / utils）
├── internal/                   # 内部工具与 lint 配置
├── scripts/                    # 构建 / 校验脚本
├── docs/                       # 文档站点
├── playground/                 # 演练场
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 版本

| 版本 | 说明 |
| :--- | :--- |
| 5.x | 当前版本，前端独立大仓（本仓库），多租户 SaaS 前端，基于 Vben Admin |

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/madong-code/madong-mono/issues) 或提交 Pull Request。

1. Fork 代码
2. 创建分支：`git checkout -b feature/xxxx`
3. 提交：`git commit -am 'feat(function): add xxxxx'`
4. 推送：`git push origin feature/xxxx`
5. 提交 Pull Request

## Git 提交规范

参考 [Conventional Commits](https://www.conventionalcommits.org/)：`feat` / `fix` / `style` / `perf` / `refactor` / `revert` / `test` / `docs` / `chore` / `ci` / `types` / `wip`。

## 开源协议

[MIT](LICENSE)
