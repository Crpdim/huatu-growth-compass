# 华图成长罗盘 Demo

这是“华图成长罗盘”的第一版可点击原型，使用固定样例学生“林小北”和静态 fallback 数据演示完整闭环：

```text
“你迷茫吗？”→ 人生情境 → 探索画像 → 事实与平台授权
→ AI 补全任务画像 → 三条发展路径与同路人案例
→ 完成方向探索 → 切换至独立成长管理应用 → Todo → AI 伴学 → 周期复盘与画像校准
```

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

打开开发服务输出的本地地址即可体验。

## 构建检查

```bash
npm run build
```

当前版本不接后端、真实 AI、登录、真实文件上传或实时岗位数据。简历与 Bilibili、GitHub、华图、Apple Watch 授权均使用预置数据模拟；AI 不可用时仍可完整演示。

## 代码结构

- `app/page.tsx`：单页流程状态、动画时序和页面编排；
- `app/demo-data.ts`：情境题、画像维度、案例、任务和课程样例；
- `app/demo-types.ts`：流程阶段与共享类型；
- `app/components/exploration-pages.tsx`：首页、人生课题、情境探索；
- `app/components/profile-pages.tsx`：第一印象、资料授权、AI 分析和能力画像；
- `app/components/direction-pages.tsx`：同路人案例、路径对比和 Agent 问答；
- `app/components/management-action-pages.tsx`：画像导入、Todo 与计划校准；
- `app/components/companion-page.tsx`：AI 伴学和华图资源模拟接入；
- `app/components/review-pages.tsx`：周期复盘、画像更新和阶段结算；
- `app/components/app-chrome.tsx`：品牌栏和两阶段进度导航。
