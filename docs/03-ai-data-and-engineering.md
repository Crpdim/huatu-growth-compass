# AI、数据与工程方案

## 1. 总体原则

> 大模型负责理解、生成和解释；学生证据、结构化路径库和业务规则负责约束。

MVP 使用单体应用、一个主职业规划 Agent 和若干结构化能力模块，不建设复杂多 Agent、知识图谱或微服务。

## 2. 系统能力

### 证据画像

- 从问卷、对话、简历、任务成果中提取候选信息；
- 映射到能力、兴趣、价值观、经历、约束和执行表现；
- 记录证据来源、置信度和信息缺口；
- 等待用户确认、修正或驳回。

### 路径推演

- 从固定路径库读取考研、公考/考编、企业后端求职规则；
- 根据正式画像匹配已有条件、缺口、风险和转轨节点；
- 输出定性准备状态和验证任务；
- 所有规则记录来源、更新时间和适用范围。

### 成长实验规划

- 将路径目标拆为四周任务；
- 根据可用时间和能力调整强度；
- 每项任务绑定待验证假设、完成标准和成果证据；
- 按任务相关性匹配华图或外部资源。

### 动态校准

- 识别新证据、连续失败、目标变化和外部规则变化；
- 先判断变化影响画像、路径还是任务；
- 生成调整前后差异及解释；
- 识别需要规划师复核的场景。

## 3. 结构化 AI 输出

所有关键 AI 接口至少返回以下公共字段：

```json
{
  "summary": "面向学生的简洁结论",
  "evidence": [
    {
      "claim": "对技术工作存在兴趣",
      "source_type": "project",
      "source_reference": "课程项目：校园二手平台",
      "confidence": "medium"
    }
  ],
  "confidence": "medium",
  "information_gaps": ["尚无真实项目或实习体验"],
  "recommended_actions": ["完成一个可部署后端功能"],
  "requires_human_review": false
}
```

额外约束：

- `confidence` 只允许 `high`、`medium`、`low`；
- 画像提取必须区分候选信息与正式画像；
- 路径推荐最多三条，不返回精确成功率；
- 校准必须返回 `trigger`、`before`、`after` 和 `reasoning_summary`；
- 模型超时、格式错误或安全校验失败时使用同结构静态 fallback。

## 4. 核心数据模型

### StudentProfile

```text
student_id, school, major, grade, academic_level,
current_goals, location_constraints, economic_constraints,
family_constraints, updated_at
```

### ProfileEvidence

```text
evidence_id, student_id, dimension, claim,
source_type, source_reference, confidence,
status, confirmed_by_user, created_at
```

`source_type` 可取 `questionnaire`、`dialogue`、`resume`、`academic_record`、`project`、`certificate`、`task_result`、`external_feedback`、`user_correction`。

### CareerPath

```text
path_id, name, category, description, entry_requirements,
stages, risks, transfer_points, sources, last_verified_at
```

### GrowthTask

```text
task_id, student_id, path_id, title, hypothesis,
purpose, steps, estimated_hours, deadline,
completion_criteria, evidence_type, status
```

### CalibrationRecord

```text
calibration_id, student_id, trigger_type, changed_evidence,
previous_plan, new_plan, reasoning_summary,
requires_human_review, user_decision, created_at
```

## 5. 数据更新流程

1. AI 从输入中提取候选画像信息；
2. 系统记录证据、来源和置信度；
3. 用户确认、修正、驳回或删除；
4. 正式画像影响路径比较和任务生成；
5. 任务成果形成新的候选证据；
6. 新证据或事件触发分级校准；
7. 用户决定是否接受调整，重大场景进入人工复核；
8. 系统保留校准历史，不覆盖原记录。

## 6. 页面与 API

MVP 体验收敛为五个核心场景，路由可保持实现上的拆分：

```text
/onboarding        冷启动与 AI 追问
/compass           成长罗盘与证据画像
/paths             三路径推演
/actions           四周成长实验与成果提交
/calibration       校准前后对比
/planner           简化版规划师工作台
```

建议 API：

```text
POST   /api/onboarding/submit
POST   /api/onboarding/follow-up
GET    /api/compass
PATCH  /api/profile/evidence/:id
GET    /api/paths
POST   /api/paths/select
GET    /api/tasks
PATCH  /api/tasks/:id
POST   /api/tasks/:id/evidence
POST   /api/calibration/run
GET    /api/calibration/latest
POST   /api/demo/reset
```

## 7. 推荐技术与实施顺序

技术栈以团队熟悉和快速交付为准，建议：

- 前端：React / Next.js + TypeScript；
- 后端：FastAPI 或现有熟悉框架；
- 数据库：Demo 阶段使用 SQLite，必要时升级 PostgreSQL；
- AI：结构化 JSON、固定路径规则、集中管理提示词；
- 文件：MVP 只支持文字、链接及有限类型的成果文件。

实施顺序：

1. 用固定样例数据完成可点击的静态闭环；
2. 定义画像、路径、任务、证据和校准数据结构；
3. 接通状态更新、成果提交和一键重置；
4. 逐项接入 AI，始终保留静态 fallback；
5. 接入飞书能力，完成演示脚本和异常演练。

## 8. 飞书集成方案

推荐把飞书作为协同与运营底座，而不是仅做一个机器人入口：

```text
学生提交任务
  → AI 提取成果证据
  → 写入飞书多维表格成长档案
  → 自动化规则识别风险或触发校准
  → 飞书通知规划师
  → 人工建议回写学生计划
```

可用能力：

- 多维表格：画像、路径、任务、证据与校准记录；
- 自动化：任务提醒、周复盘、连续失败告警；
- AI 节点或智能体：摘要、结构化提取、计划和校准解释；
- 妙搭或轻量页面：规划师工作台。

主流程业务逻辑与飞书接口解耦，飞书暂不可用时本地 Demo 仍可完成。

## 9. 稳定性、安全与隐私

- 关键页面均有本地 mock 数据和可复现 fallback；
- 不依赖现场实时政策或岗位检索；
- 演示账号支持一键重置；
- 不在现场上传真实敏感个人信息；
- 用户可跳过非必要问题并删除上传材料；
- 一般情绪表达不自动进入画像；
- 不提供心理诊断或情感咨询；
- 重大建议显示依据、时间和是否需要人工复核；
- 外部规则变化只调整受影响的路径或任务，不重写全部规划；
- 所有量化效果均标注为试点拟验证目标。
