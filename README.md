# VOC Voice Agent · 用户原声助手

**把 VOC Insight Kit 的口径做成可对话 Agent：问价格关口、议题统计或生成四步话术时，回答必须引用语料里的用户原声；禁止话术检查不通过就不能发。**

[在线体验](https://annawzhang.github.io/voc-voice-agent/) · [浏览器测试](https://annawzhang.github.io/voc-voice-agent/tests.html) · 原生 JavaScript，无依赖

> 品牌 A9 / A8 / M7 与全部原声均为虚构；方法对齐 [voc-insight-kit](https://github.com/annawzhang/voc-insight-kit)。

## 和批处理 Kit 的分工

| | VOC Insight Kit | VOC Voice Agent（本仓库） |
|---|---|---|
| 形态 | 跑批 → HTML 报告 | 对话追问 |
| 输出 | 议题结论 + 话术包 + 质检 | 带引用的回答 + 即时质检 |
| 硬约束 | 编码本 / 禁止规则配置 | **无原声引用则拒答** |

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

理想汽车舆情实习中「原声 → 决策 → 话术」方法的公开 Agent 版，数据全部虚构。
