# VOC Voice Agent · 用户原声助手

**理想汽车舆情方法的公开 Agent 版：按腾讯 Chatbot 98008 同一套能力层并行设计——入口 / 主调度 / Skill / 原声证据 / 治理；无原声引用则拒答，禁止话术检查不通过不能发。**

[在线体验](https://annawzhang.github.io/voc-voice-agent/) · [浏览器测试](https://annawzhang.github.io/voc-voice-agent/tests.html) · [能力层手册](https://annawzhang.github.io/people-product-handbook/sections/10-agent-capability.html) · 原生 JavaScript，无依赖

> 品牌 A9 / A8 / M7 与全部原声均为虚构；方法对齐 [voc-insight-kit](https://github.com/annawzhang/voc-insight-kit)。

## 能力层（对齐 98008）

| 层 | 98008 / Knot | 本仓 VOC Agent |
|---|---|---|
| L0 入口 | Chatbot 98008 员工前端 | 对话页 `index.html` |
| L1 主调度 | Knot 意图分流 | `VocAgent.answer` + `detectIntent` |
| L2 Skill | RAG / 风控 / VIP / 工单 / 子 Agent | `search` · `topicStats` · `priceCeiling` · `fourStep` · `checkScript` |
| L3 知识 | 权限化书架 FAQ | 议题语料 + 点赞加权原声；**无 cite 不下结论** |
| L4 治理 | Console + Gap Finder | [VOC Insight Kit](https://github.com/annawzhang/voc-insight-kit) 跑批 + 禁止规则 + `tests.html` |

```
销售/策略提问
    ↓
L0 对话入口
    ↓
L1 detectIntent（质检 > 话术 > 价格关口 > 议题检索）
    ↓
L2 Skill 白名单 ──→ L3 原声语料
    ↓                    ↑
拒答 / 结论+citations    L4 Kit 批处理更新语料与规则
```

架构详图见手册：[§10 Agent 能力层](https://annawzhang.github.io/people-product-handbook/sections/10-agent-capability.html) · [§04 用户原声](https://annawzhang.github.io/people-product-handbook/sections/04-voc.html)

## 和批处理 Kit 的分工

| | VOC Insight Kit（L4） | VOC Voice Agent（L0–L3） |
|---|---|---|
| 形态 | 跑批 → HTML 报告 | 对话追问 |
| 输出 | 议题结论 + 话术包 + 质检 | 带引用的回答 + 即时质检 |
| 硬约束 | 编码本 / 禁止规则配置 | **无原声引用则拒答** |
| 类比 98008 | Console 建库 / 补库 | 98008 入口 + Knot Skill |

## 能问什么

- 「价格心理关口是多少？」→ 点赞加权下负面过半的价位点，并列出原声  
- 「续航相关原声怎么看？」→ 按条 / 按点赞负面率 + Top 原声  
- 「生成价格议题四步话术」→ 认同→重构→转移→落地，绑定一条原声  
- 「检查：……」→ 命中绝对化承诺 / 贬低竞品 / 非正规交易等则拦截  

## 本地运行

```bash
python3 -m http.server 8000
# http://localhost:8000/  测试：/tests.html（6 项）
```

## 背景

理想汽车舆情实习中「原声 → 决策 → 话术」方法的公开 Agent 版；能力层叙事对齐腾讯 98008（入口≠基座、Skill 白名单、证据可溯源、治理补库）。数据全部虚构。
