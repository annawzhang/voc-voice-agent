# VOC Voice Agent · 用户原声助手

> **数据已脱敏**：品牌与全部原声虚构；不含真实车主评论 / 门店 / 内部舆情库。

**理想汽车舆情方法的公开 Agent 全栈（与腾讯 98008 独立）：对话入口 · 意图调度 · Skill 白名单 · 原声证据 · Kit 治理；无原声引用则拒答。**

[在线体验](https://annawzhang.github.io/voc-voice-agent/) · [浏览器测试](https://annawzhang.github.io/voc-voice-agent/tests.html) · [架构手册 §11](https://annawzhang.github.io/people-product-handbook/sections/11-voc-agent.html) · 原生 JavaScript

> 品牌 A9 / A8 / M7 与全部原声均为虚构。98008 企业智能体见 [手册 §10](https://annawzhang.github.io/people-product-handbook/sections/10-agent-capability.html)（另一套产品）。

## 能力层（本仓专属）

| 层 | VOC Agent |
|---|---|
| L0 入口 | 对话页 `index.html` |
| L1 主调度 | `VocAgent.answer` + `detectIntent` |
| L2 Skill | `search` · `topicStats` · `priceCeiling` · `fourStep` · `checkScript` |
| L3 证据 | 议题语料 + 点赞加权；**无 cite 不下结论** |
| L4 治理 | [VOC Insight Kit](https://github.com/annawzhang/voc-insight-kit) + 禁止规则 + `tests.html` |

完整架构图：[手册 §11 VOC Agent](https://annawzhang.github.io/people-product-handbook/sections/11-voc-agent.html)

## 和批处理 Kit

| | Insight Kit | Voice Agent |
|---|---|---|
| 形态 | 跑批 → 报告 | 对话 |
| 硬约束 | 编码本 / 禁止规则 | **无原声引用则拒答** |

## 本地运行

```bash
python3 -m http.server 8000
# http://localhost:8000/  · /tests.html
```
