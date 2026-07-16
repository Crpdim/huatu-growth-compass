# AGENTS.md — 华图成长罗盘 Demo 开发约定

本文件约束所有参与本仓库开发的 AI Agent 和开发者。

## 1. 产品目标

构建一个可演示的大学生全周期 AI 成长规划 Demo：

> 冷启动定位 → 动态画像 → 多路径推演 → 四周计划 → 任务反馈 → 动态校准


## 2. 核心产品语言

- 产品名：华图成长罗盘；
- 核心问题：帮用户确认我是谁、我现在在哪、我能去哪、下一步怎么走；
- 核心闭环：定位、定向、导航、校准；
- 核心原则：根据依据、路径和下一步行动。

## 3. 开发优先级

任何实现决策按以下顺序判断：

1. 是否有助于完整演示主闭环；
2. 是否提高结果可解释性；
3. 是否降低演示失败风险；
4. 是否符合用户数据最小化原则；
5. 最后才考虑扩展性和技术先进性。

## 4. 必须遵守的产品规则

1. 所有画像结论必须包含证据来源；
2. 用户可以确认、修正、驳回或删除画像信息；
3. 路径推荐最多展示 3 条；
4. 不输出精确成功率；
5. 不承诺就业、升学或考试结果；
6. 每个任务必须有明确完成标准；
7. 每次规划调整必须解释触发原因和变化内容；
8. 重大选择或低置信度场景不得自动定向，应补充验证任务并由用户最终确认；
9. 不把一般情绪表达自动沉淀为画像；
10. 不开发心理诊断或情感咨询功能。

## 5. MVP 范围

首版只支持：

- 一个虚构的大二计算机专业样例用户；
- 考研、公考/考编、企业求职三条路径；
- 四周行动计划；
- 一次成果提交；
- 一次任务失败或目标变化后的动态校准；
- 全流程仅由系统与学生完成，不设置人工规划师介入。

除非明确要求，不新增：

- 社区；
- 付费系统；
- 完整高校管理后台；
- 多 Agent 自治协作；
- 知识图谱基础设施；
- 微服务拆分；
- 实时全网岗位检索；
- 超出三条的职业路径。

## 6. AI 输出要求

AI 接口优先返回结构化 JSON，至少包含：

- `summary`：面向用户的简洁结论；
- `evidence`：结论依据；
- `confidence`：high / medium / low；
- `information_gaps`：缺失信息；
- `recommended_actions`：下一步行动；
- `decision_status`：ready / needs_more_evidence / user_confirmation_required。

关键 AI 功能必须提供静态 fallback，确保演示不中断。

## 7. 已确认的技术栈

以下信息来自当前仓库配置。修改依赖、命令或部署方式时，必须同步更新本节。

### 7.1 项目结构

- 产品与比赛文档位于仓库根目录和 `docs/`；
- 前端应用位于 `demo/`，所有 npm 命令默认在该目录执行；
- 当前应用采用单页状态切换，主要交互集中在 `demo/app/page.tsx`；
- 全局样式位于 `demo/app/globals.css`；
- 静态图片位于 `demo/public/`；
- 当前没有业务后端、真实 AI 接口、登录和持久化数据库；
- `demo/.openai/hosting.json` 中的 `d1`、`r2` 均为 `null`。

### 7.2 运行环境与依赖

- 包管理器：npm，锁文件为 `demo/package-lock.json`；
- Node.js：`>=22.13.0`，GitHub Actions 使用 Node.js 22；
- Next.js：16.2.6，使用 `app/` 目录；
- React / React DOM：19.2.6；
- TypeScript：5.9.3，`strict: true`、`noEmit: true`；
- Tailwind CSS：4.2.1，通过 PostCSS 和 `@import "tailwindcss"` 接入；当前页面主体样式仍由 `globals.css` 中的手写 CSS 完成；
- 本地与 Vinext 构建链路：Vinext 0.0.50、Vite 8.0.13、Cloudflare Vite Plugin 1.37.1、Wrangler 4.92.0；
- 代码检查：ESLint 9.39.4、`eslint-config-next` 16.2.6；
- 测试：Node.js 内置 test runner，当前断言文件为 `demo/tests/rendered-html.test.mjs`。

版本号以 `demo/package.json` 和 `demo/package-lock.json` 为准，不凭记忆升级或替换依赖。

### 7.3 两套构建链路

当前仓库保留两套用途不同的构建命令：

| 用途 | 命令 | 实际行为 | 主要产物 |
|---|---|---|---|
| 本地开发 | `npm run dev` | Vinext + Vite 开发服务器 | 默认本地地址 `http://localhost:3000` |
| Vinext 构建 | `npm run build` | `vinext build`，包含 Worker 兼容构建 | `demo/dist/` |
| Vinext 生产预览 | `npm run start` | 启动 Vinext 构建结果 | 本地服务 |
| GitHub Pages 构建 | `npm run build:pages` | `next build`；在 GitHub Actions 环境中启用静态导出 | `demo/out/` |
| 自动测试 | `npm test` | 先运行 Vinext 构建，再运行 Node.js 源码断言 | 测试结果 |
| 代码检查 | `npm run lint` | 运行 ESLint | 检查结果 |

注意：`npm test` 不会执行 GitHub Pages 静态导出。涉及页面、资源路径或部署的修改必须额外运行 Pages 构建。

## 8. 已确认的开发与发布流程

### 8.1 首次安装与本地预览

在仓库根目录执行：

```bash
cd demo
npm ci
npm run dev
```

- 已存在依赖且锁文件未变化时，无需重复安装；
- 开发服务器使用 Vinext/Vite；
- 不通过直接打开 `out/index.html` 代替本地服务器；
- `demo/.wrangler/`、`demo/.vinext/`、`demo/.next/`、`demo/dist/` 和 `demo/out/` 都是生成目录，不手工编辑。

### 8.2 修改后的最低验证

所有前端修改至少执行：

```bash
cd demo
npm test
GITHUB_ACTIONS=true GITHUB_REPOSITORY=Crpdim/huatu-growth-compass npm run build:pages
cd ..
git diff --check
```

这条 Pages 构建命令显式模拟仓库环境。缺少 `GITHUB_ACTIONS=true` 时，`next.config.ts` 不会启用 GitHub Pages 的 `output: "export"` 和仓库子路径。

当前自动测试主要检查关键文案和元数据是否存在，尚未覆盖完整点击流程、视觉回归和真实 AI 行为。改动交互状态时，需要人工走查主链路：

> 首页 → 人生课题 → 情境探索 → 画像确认 → 事实补充 → AI 成长坐标 → 三种人生 → 体制内体验 → 证据更新 → 7 天计划

### 8.3 GitHub Pages 子路径

- 线上地址：`https://crpdim.github.io/huatu-growth-compass/`；
- `demo/next.config.ts` 在 GitHub Actions 中根据 `GITHUB_REPOSITORY` 生成 `/huatu-growth-compass`；
- `basePath`、`assetPrefix` 和 `NEXT_PUBLIC_BASE_PATH` 由该配置统一设置；
- 页面引用 `public/` 资源时必须使用 `NEXT_PUBLIC_BASE_PATH`，不要硬编码仓库名；
- 图标和 Open Graph 图片当前也使用该前缀；
- `trailingSlash: true` 已启用，保持静态路由兼容性。

### 8.4 GitHub Pages 发布

发布流程定义在 `.github/workflows/deploy-pages.yml`：

1. 推送到 `main`，或手动触发 `workflow_dispatch`；
2. GitHub Actions 使用 Node.js 22 和 `npm ci` 安装锁定依赖；
3. 在 `demo/` 运行 `npm run build:pages`；
4. 上传 `demo/out`；
5. 使用 GitHub Pages 完成部署。

不要提交或手工修改 `demo/out/`。发布状态以 GitHub Actions 的 `Deploy GitHub Pages` 工作流和线上页面为准。

### 8.5 Sites / Cloudflare 相关文件

- `demo/vite.config.ts`、`demo/worker/index.ts`、`demo/build/sites-vite-plugin.ts` 和 `demo/.openai/hosting.json` 支撑 Vinext / Cloudflare 兼容构建；
- 当前交付渠道为本地预览和 GitHub Pages；
- 未经用户明确要求，不发布到 Sites，也不新增 D1、R2 或 Cloudflare 资源；
- 保留上述文件，不能因为当前只发 GitHub Pages 就删除 Vinext 构建链路。

### 8.6 配置事实来源

遇到不熟悉的流程时，按以下文件核对，不靠猜测：

1. 依赖版本和命令：`demo/package.json`、`demo/package-lock.json`；
2. GitHub Pages 导出和子路径：`demo/next.config.ts`；
3. 本地 Vinext/Vite 行为：`demo/vite.config.ts`；
4. Pages 自动发布：`.github/workflows/deploy-pages.yml`；
5. Sites 资源声明：`demo/.openai/hosting.json`；
6. 测试覆盖范围：`demo/tests/rendered-html.test.mjs`；
7. 产品范围和完成状态：`docs/`、`TASKS.md`。

如果本文与可执行配置冲突，以配置文件为准，并在同一次修改中修正本文。

## 9. 工程原则

- 优先使用团队熟悉的技术栈；
- 保持单体应用，除非现有仓库已有明确架构；
- 不为单次 Demo 设计复杂抽象；
- 先用 mock 数据跑通，再接真实 AI；
- 不把提示词散落在页面组件中；
- 路径规则、任务模板和样例数据应独立管理；
- 所有 Demo 状态支持一键重置；
- 新增功能必须同步更新相关 Markdown 文档。

## 10. 修改流程

实现需求前：

1. 明确该需求属于闭环中的哪一步；
2. 说明会修改哪些页面、数据和接口；
3. 检查是否超出 MVP 范围；
4. 优先采用最小改动完成。

实现后：

1. 验证完整用户路径没有被破坏；
2. 验证 AI 失败时仍可演示；
3. 验证画像和校准均可解释；
4. 更新 `TASKS.md` 状态；
5. 如产品规则变化，更新对应设计文档。
