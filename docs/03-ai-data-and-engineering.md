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
- 将用户确认的初始画像保存为只读快照；
- 根据成长事件生成新画像版本，并输出版本差异。

### 路径推演

- 从固定路径库读取考研、公考/考编、企业后端求职规则；
- 根据正式画像匹配已有条件、缺口、风险和转轨节点；
- 输出定性准备状态和验证任务；
- 所有规则记录来源、更新时间和适用范围。

### 成长实验规划

- 当前 Demo 先将体制内路径拆为 7 天验证任务，后续再扩展为四周和学期计划；
- 根据可用时间和能力调整强度；
- 每项任务绑定待验证假设、完成标准和成果证据；
- 按任务相关性匹配华图或外部资源。

### 未来生活体验

- 根据正式画像选择“值得优先体验”的路径，不输出唯一答案或成功率；
- 从路径模板读取工作内容、生活取舍、常见风险和转轨问题；
- 用户在模拟场景中的选择只生成候选证据；
- 用户确认后，体验反馈才能进入新画像版本并影响任务；
- 当前 Demo 只完整实现体制内人生，考研与企业求职保留入口和静态说明。

### 动态校准

- 识别新证据、连续失败、目标变化和外部规则变化；
- 先判断变化影响画像、路径还是任务；
- 生成调整前后差异及解释；
- 对低置信度或重大转轨进入待验证状态，不自动替学生确认。

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
  "decision_status": "ready"
}
```

额外约束：

- `confidence` 只允许 `high`、`medium`、`low`；
- `decision_status` 只允许 `ready`、`needs_more_evidence`、`user_confirmation_required`；
- 画像提取必须区分候选信息与正式画像；
- 路径推荐最多三条，不返回精确成功率；
- 校准必须返回 `trigger`、`before`、`after` 和 `reasoning_summary`；
- 模型超时、格式错误或安全校验失败时使用同结构静态 fallback。

冷启动可额外返回用户主动表达的当前担忧及其行动化拆解：

```json
{
  "current_concern": {
    "category": "fear_wrong_choice",
    "statement": "担心投入很久后才发现选错",
    "source": "user_selected"
  },
  "concern_response": {
    "acknowledgement": "你担心的是过早押注一条路径带来的试错成本",
    "uncertainties": ["技术工作真实体验", "考研动机", "公考岗位认知"],
    "next_action": "本周完成三路径信息对比表"
  }
}
```

系统不得推断焦虑程度、诊断心理状态或生成“焦虑指数”。`current_concern` 必须来自用户主动选择或表达，用户可修改、清除，且不自动写入 `ProfileEvidence`。

## 4. 核心数据模型

### StudentProfile

```text
student_id, school, major, grade, academic_level,
current_goals, location_constraints, economic_constraints,
family_constraints, baseline_snapshot_id,
current_snapshot_id, updated_at
```

### ProfileEvidence

```text
evidence_id, student_id, dimension, claim,
source_type, source_reference, confidence,
status, confirmed_by_user, created_at
```

`source_type` 可取 `questionnaire`、`dialogue`、`resume`、`academic_record`、`project`、`certificate`、`task_result`、`external_feedback`、`user_correction`。

### ProfileSnapshot

```text
snapshot_id, student_id, version, snapshot_type,
profile_data, evidence_ids, change_summary,
created_at, created_by
```

`snapshot_type` 可取 `baseline` 或 `derived`。初始画像经用户确认后生成 `baseline` 快照；后续更新生成 `derived` 版本，不修改旧快照。`StudentProfile.current_snapshot_id` 指向当前有效版本。

### GrowthEvent

```text
event_id, student_id, event_type, occurred_at,
source_type, source_reference, summary,
evidence_ids, user_confirmed, created_at
```

MVP 的 `event_type` 只覆盖 `task_completed`、`task_missed`、`artifact_submitted`、`goal_changed`、`user_correction` 和 `external_rule_changed`。后续接入成绩、证书或校内系统前必须另行获得授权。

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
decision_status, user_decision, created_at
```

### OnboardingContext

```text
session_id, student_id, current_concern,
concern_source, user_confirmed, created_at, cleared_at
```

该结构只服务当前规划会话，用于在 Demo 中承接学生明确表达的担忧。它不等同于长期画像，不记录心理强度，用户清除后不再参与后续生成。

## 5. 数据更新流程

1. AI 从冷启动输入中提取候选画像信息；
2. 系统记录证据、来源和置信度；
3. 用户确认、修正、驳回或删除；
4. 系统生成只读初始画像快照 `v1`；
5. 正式画像影响路径比较、未来体验顺序和任务生成；
6. 未来体验反馈、任务结果、成果提交或用户修正形成 `GrowthEvent` 和候选证据；
7. 用户确认新证据后，系统生成当前画像新版本和差异摘要；
8. 新版本或外部事件触发分级校准；
9. 用户决定是否接受调整；证据不足时系统继续生成验证任务；
10. 系统保留全部画像版本和校准历史，不覆盖原记录。

## 6. 页面与 API

当前 Demo 体验可按以下场景拆分路由；静态实现仍可保留为单页状态切换：

```text
/onboarding        “你迷茫吗？”与人生情境
/profile           探索画像、事实补充与授权
/futures           三种平行人生
/experience/public 体制内未来生活体验
/evidence-review   体验前后证据与用户确认
/actions           7 天考公验证计划
```

建议 API：

```text
POST   /api/onboarding/submit
POST   /api/onboarding/follow-up
GET    /api/compass
GET    /api/profile/snapshots
GET    /api/profile/timeline
PATCH  /api/profile/evidence/:id
GET    /api/paths
POST   /api/paths/select
GET    /api/path-experiences/:pathId
POST   /api/path-experiences/:pathId/events
POST   /api/path-experiences/:pathId/confirm
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
  → 自动化规则识别变化并触发校准
  → 系统生成新计划或补充验证任务
  → 飞书通知学生确认
```

可用能力：

- 多维表格：画像、路径、任务、证据与校准记录；
- 自动化：任务提醒、周复盘、连续失败告警；
- AI 节点或智能体：摘要、结构化提取、计划和校准解释；
- 妙搭或轻量页面：学生成长时间线与计划确认页面。

主流程业务逻辑与飞书接口解耦，飞书暂不可用时本地 Demo 仍可完成。

## 9. 稳定性、安全与隐私

- 关键页面均有本地 mock 数据和可复现 fallback；
- 不依赖现场实时政策或岗位检索；
- 演示账号支持一键重置；
- 不在现场上传真实敏感个人信息；
- 用户可跳过非必要问题并删除上传材料；
- 一般情绪表达不自动进入画像；
- 当前担忧只能由用户主动表达并确认，不推断、不评分、不用于制造紧迫感；
- 持续更新仅由已声明且获授权的成长事件触发，不做后台无边界监控；
- 画像新版本不得覆盖历史快照，用户可查看版本差异和证据来源；
- 不提供心理诊断或情感咨询；
- 重大建议显示依据、时间和决策状态，并要求用户主动确认；
- 外部规则变化只调整受影响的路径或任务，不重写全部规划；
- 所有量化效果均标注为试点拟验证目标。
