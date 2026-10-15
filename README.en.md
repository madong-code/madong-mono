> Need the **standard-version frontend [single-user standalone version]**? Visit: [madong-single](https://github.com/madong-code/madong-single) / [madong-aura](https://github.com/madong-code/madong-aura) (admin) and [web-nuxt](https://github.com/madong-code/web-nuxt) (portal).

<div align="center">

<img src="apps/admin/public/logo.png" alt="Madong Logo" width="120" />

# Madong-Saas Frontend Monorepo

The multitenant SaaS frontend built on [Vben Admin](https://github.com/vbenjs/vue-vben-admin) (Vue 3 + Vite + TypeScript)

[![Node](https://img.shields.io/badge/Node-20.19%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10.0%2B-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue)](./LICENSE)

[![Docs](https://img.shields.io/badge/Docs-madong.tech-7C3AED)](https://madong.tech)
[![Download Center](https://img.shields.io/badge/Download%20Center-madong.tech-10B981)](https://madong.tech/download)

[中文](./README.md) | **English**

</div>

## Introduction

Madong-Saas frontend monorepo, built on [Vben Admin](https://github.com/vbenjs/vue-vben-admin) (Vue 3 + Vite + TypeScript), is the multitenant SaaS frontend and works with the [madong-admin-saas](https://github.com/madong-code/madong-admin-saas) backend.

- Uses a pnpm + Turbo Monorepo architecture, with apps and shared packages managed separately;
- Ships multiple apps: `admin` (tenant admin), `platform` (platform / tenant management), `install` (install wizard), and `backend-mock` (API mock);
- The standard-version frontend can be reused, but some service interfaces differ and require targeted adjustments.

> Frontend and backend are deployed separately; the frontend monorepo must be cloned into the `madong/template` directory on its own.

## Repository Addresses

This project is the **frontend monorepo (core)**. The companion backend, portal, and tooling repositories are listed below (pulled from GitHub by default; use the Gitee / GitCode mirrors when network access is limited):

| Module | GitHub | Gitee Mirror | GitCode Mirror |
| :--- | :--- | :--- | :--- |
| Frontend monorepo (this repo) | https://github.com/madong-code/madong-mono | https://gitee.com/motion-code/madong-mono | https://gitcode.com/motion-code/madong-mono |
| Backend service (SaaS) | https://github.com/madong-code/madong-admin-saas | https://gitee.com/motion-code/madong-admin-saas | https://gitcode.com/motion-code/madong-admin-saas |
| Portal site (Web, shared) | https://github.com/madong-code/web-nuxt | https://gitee.com/motion-code/web-nuxt | https://gitcode.com/motion-code/web-nuxt |
| AI Skills package | https://github.com/madong-code/madong-admin-saas-skills | https://gitee.com/motion-code/madong-admin-saas-skills | https://gitcode.com/motion-code/madong-admin-saas-skills |
| Container environment | https://github.com/madong-code/docker-webman | https://gitee.com/motion-code/docker-webman | https://gitcode.com/motion-code/docker-webman |

> For full releases and downloads, see the [Download Center](https://madong.tech/download).

## Runtime Environment

- Node.js ^20.19.0 || ^22.18.0 || ^24.0.0
- pnpm >= 10.0.0
- Git

## Quick Start

Following the standard directory layout, clone this repository into `madong/template` and the backend into the sibling directory `madong/backend`.

```bash
# 1. Clone the frontend monorepo
git clone https://github.com/madong-code/madong-mono.git madong/template
cd madong/template

# 2. Install dependencies
pnpm install

# 3. Start the dev server (tenant admin as an example)
pnpm -F @madong/admin dev
# Start platform management
pnpm -F @madong/platform dev
# Start the install wizard
pnpm -F @madong/install dev

# 4. Build
pnpm build
```

> The `web-nuxt` portal is a separate Nuxt SSR project, shared with the multitenant version; deploy it independently following its repository instructions.

## Directory Structure

```
madong/template/                # frontend monorepo (this repo)
├── apps/                       # applications
│   ├── admin/                  # tenant admin (@madong/admin)
│   ├── platform/               # platform / tenant management (@madong/platform)
│   ├── install/                # install wizard (@madong/install)
│   └── backend-mock/           # API mock (@vben/backend-mock)
├── packages/                   # shared packages (@core / effects / business / lib / constants / types / icons / styles / utils)
├── internal/                   # internal tooling and lint configs
├── scripts/                    # build / check scripts
├── docs/                       # documentation site
├── playground/                 # playground
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Versions

| Version | Description |
| :--- | :--- |
| 5.x | Current version; frontend split into its own monorepo (this repo), multitenant SaaS frontend built on Vben Admin |

## How to Contribute

Contributions are very welcome! [Open an Issue](https://github.com/madong-code/madong-mono/issues) or submit a Pull Request.

1. Fork the repository
2. Create a branch: `git checkout -b feature/xxxx`
3. Commit: `git commit -am 'feat(function): add xxxxx'`
4. Push: `git push origin feature/xxxx`
5. Submit a Pull Request

## Git Commit Convention

Reference [Conventional Commits](https://www.conventionalcommits.org/): `feat` / `fix` / `style` / `perf` / `refactor` / `revert` / `test` / `docs` / `chore` / `ci` / `types` / `wip`.

## License

[MIT](LICENSE)
