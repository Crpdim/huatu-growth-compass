# 华图成长罗盘 Demo

本项目用于「2026 AI 先锋未来人才大赛」华图教育命题的方案设计与 Demo 开发。

- [比赛官网](https://activity.feishu.cn/future-talent#challenge)
- [华图教育命题](https://activity.feishu.cn/future-talent?detail=huatujiaoyu)

## 产品定义

> 华图成长罗盘是一套 AI 驱动的大学生成长实验系统，通过“证据画像—多路径推演—成长实验—动态校准”，把学生对未来的模糊焦虑拆成可验证的问题，帮助他们用真实行动逐步找到方向。

产品持续回答四个问题：我是谁、我现在在哪、我能去哪、下一步怎么走。

核心闭环：

```text
定位 → 定向 → 导航 → 校准
画像 → 推演 → 实验 → 新证据 → 再校准
```

## 当前 Demo 的唯一目标

用一个虚构大二计算机专业学生“林小北”跑通当前重点 Demo：

> “你迷茫吗？” → 人生课题选择 → 情境探索 → 用户授权补充事实 → AI 成长坐标与个人定位 → 三种平行人生 → 体制内未来生活体验 → “我该怎么实现” → 7 天考公验证计划

产品逻辑支持考研、公考/考编和企业求职三条路径。比赛 Demo 完整呈现体制内人生分支，另外两条作为对照。首版聚焦四件事：推荐依据可追溯、未来生活可体验、体验能够产生新证据、下一步任务可以执行。AI 服务异常时，静态内容仍能支撑完整演示。

## 文档导航

1. [产品蓝图](./docs/01-product-blueprint.md)：命题洞察、核心机制、用户价值、MVP 与产品红线；
2. [产品体验与 Demo](./docs/02-product-experience-and-demo.md)：当前交互链路、体制内人生体验、7 天验证计划和六分钟演示；
3. [AI、数据与工程](./docs/03-ai-data-and-engineering.md)：AI 边界、结构化输出、数据模型、API、飞书集成和稳定性；
4. [比赛表达与落地](./docs/04-competition-and-rollout.md)：核心表达、评审映射、业务落地、路演结构与答辩；
5. [赛事规则原文](./docs/competition-rules.md)：赛程、资格、提交、评审和知识产权约束。

## 项目文件

- [TASKS.md](./TASKS.md)：MVP 开发任务与状态；
- [AGENTS.md](./AGENTS.md)：参与开发的 AI Agent 和开发者约定；
- [CLAUDE.md](./CLAUDE.md)：兼容其他开发工具的同类约定。

阅读顺序建议：先看产品蓝图和产品体验，再根据职责查看工程方案或比赛表达。

## 运行 Demo

第一版可点击原型位于 [`demo/`](./demo/)，使用固定样例和静态 fallback 跑通完整闭环。

```bash
cd demo
npm install
npm run dev
```

当前版本不接真实 AI、后端、登录或实时外部数据，适合用于产品走查和比赛演示。

## GitHub Pages

`main` 分支更新后，GitHub Actions 会自动构建并发布 `demo/`：

- 构建命令：`npm run build:pages`；
- 静态产物：`demo/out/`；
- Pages 地址：<https://crpdim.github.io/huatu-growth-compass/>。

工作流会自动配置仓库子路径 `/huatu-growth-compass`，本地开发仍使用根路径，不需要手动切换配置。
