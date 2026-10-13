// 用户原声 Agent 引擎：检索 → 必引原声 → 四步话术 → 禁止话术检查
(function (root) {
  const D = root.VocData;

  function topicOf(key) {
    return D.TOPICS.find((t) => t.key === key) || { key, name: key };
  }

  function search(query, opts) {
    opts = opts || {};
    const q = (query || "").toLowerCase();
    let list = D.QUOTES.slice();
    if (opts.topic) list = list.filter((x) => x.topic === opts.topic);
    if (opts.model) list = list.filter((x) => x.model === opts.model);
    if (opts.stance) list = list.filter((x) => x.stance === opts.stance);
    if (q) {
      const keys = q.split(/\s+/).filter(Boolean);
      list = list.filter((x) => {
        const bag = (x.text + " " + x.model + " " + topicOf(x.topic).name).toLowerCase();
        return keys.some((k) => bag.includes(k) || x.topic.includes(k));
      });
    }
    return list.sort((a, b) => b.likes - a.likes);
  }

  function topicStats(topic) {
    const list = D.QUOTES.filter((x) => x.topic === topic);
    const likes = list.reduce((s, x) => s + x.likes, 0);
    const neg = list.filter((x) => x.stance === "负");
    const negLikes = neg.reduce((s, x) => s + x.likes, 0);
    return {
      topic,
      name: topicOf(topic).name,
      n: list.length,
      likes,
      negRateByCount: list.length ? neg.length / list.length : 0,
      negRateByLikes: likes ? negLikes / likes : 0,
      top: list.slice().sort((a, b) => b.likes - a.likes).slice(0, 3),
    };
  }

  function priceCeiling() {
    // 简化：在语料里出现的价位点上，用「提到该价且负面」的点赞占比找首次过半
    const hits = [];
    D.PRICE_POINTS.forEach((p) => {
      const related = D.QUOTES.filter((x) => x.topic === "price" && x.text.includes(String(p)));
      if (!related.length) return;
      const likes = related.reduce((s, x) => s + x.likes, 0);
      const negLikes = related.filter((x) => x.stance === "负").reduce((s, x) => s + x.likes, 0);
      hits.push({ price: p, n: related.length, likes, negShare: likes ? negLikes / likes : 0, quotes: related });
    });
    hits.sort((a, b) => a.price - b.price);
    const ceiling = hits.find((h) => h.negShare >= 0.5) || null;
    return { points: hits, ceiling };
  }

  function fourStep(topic, model) {
    const st = topicStats(topic);
    const quote = st.top[0];
    if (!quote) return null;
    const name = st.name;
    return {
      topic,
      model: model || quote.model,
      cite: quote,
      steps: [
        { name: "认同", text: `理解您对「${name}」的顾虑，不少车主也提到类似感受。` },
        { name: "重构", text: `我们把讨论落到可核对的信息上，而不是笼统说贵或不好。` },
        { name: "转移", text: `结合 ${model || quote.model} 在同价位的配置与实测口径，看哪一项对您权重最高。` },
        { name: "落地", text: `建议预约到店，按您的通勤/家庭场景做一版对比表，再决定是否锁单。` },
      ],
    };
  }

  function checkScript(text) {
    const hits = D.FORBIDDEN.filter((f) => f.pattern.test(text || ""));
    return { ok: hits.length === 0, hits };
  }

  function detectIntent(text) {
    const t = text || "";
    if (/价格|价位|多少钱|心理|关口|天花板/.test(t)) return { kind: "price_ceiling" };
    if (/话术|怎么回|四步|话术包/.test(t)) {
      const topic = D.TOPICS.find((x) => t.includes(x.name) || t.includes(x.key));
      return { kind: "script", topic: (topic && topic.key) || "price" };
    }
    if (/检查|质检|能不能发/.test(t)) return { kind: "qa", script: t };
    if (/续航|能耗/.test(t)) return { kind: "topic", topic: "range" };
    if (/空间|家用/.test(t)) return { kind: "topic", topic: "space" };
    if (/智能|车机|座舱/.test(t)) return { kind: "topic", topic: "smart" };
    if (/交付|服务|售后/.test(t)) return { kind: "topic", topic: "service" };
    if (/外观|设计/.test(t)) return { kind: "topic", topic: "design" };
    if (/竞品|对比/.test(t)) return { kind: "topic", topic: "compete" };
    const hit = D.TOPICS.find((x) => t.includes(x.name) || t.includes(x.key));
    if (hit) return { kind: "topic", topic: hit.key };
    return { kind: "search", query: t };
  }

  /** 生成回答：必须带 citations（原声 id），否则引擎拒绝下结论 */
  function answer(userText) {
    const intent = detectIntent(userText);
    const citations = [];
    let blocks = [];

    if (intent.kind === "price_ceiling") {
      const pc = priceCeiling();
      const c = pc.ceiling;
      (c ? c.quotes : search("价格", { topic: "price" }).slice(0, 2)).forEach((q) => citations.push(q));
      if (!citations.length) return { error: "语料中没有可引用的价格原声，不能下结论。" };
      if (c) {
        blocks.push(`按点赞加权，负面占比首次达到或超过 50% 的价位点在 **${c.price} 万**（样本 ${c.n} 条，负面点赞占比 ${(c.negShare * 100).toFixed(0)}%）。`);
        blocks.push("口径与公开的 VOC Insight Kit 一致：先合并重复评论点赞，再看价格关口。");
      } else {
        blocks.push("现有价格相关原声里，尚未出现负面点赞占比 ≥50% 的价位点；建议继续收集。");
      }
    } else if (intent.kind === "topic") {
      const st = topicStats(intent.topic);
      st.top.forEach((q) => citations.push(q));
      if (!citations.length) return { error: "该议题下没有可引用原声。" };
      blocks.push(`议题「${st.name}」共 ${st.n} 条，点赞 ${st.likes}。负面率：按条 ${(st.negRateByCount * 100).toFixed(0)}%，按点赞加权 ${(st.negRateByLikes * 100).toFixed(0)}%。`);
      blocks.push("下面三条是点赞最高的原声，结论必须落在这些引用上。");
    } else if (intent.kind === "script") {
      const pack = fourStep(intent.topic);
      if (!pack) return { error: "该议题缺少原声，无法生成话术。" };
      citations.push(pack.cite);
      const draft = pack.steps.map((s) => `【${s.name}】${s.text}`).join("\n");
      const qa = checkScript(draft);
      blocks.push(`基于原声 ${pack.cite.id} 生成四步话术（认同→重构→转移→落地）：`);
      blocks.push(draft);
      blocks.push(qa.ok ? "禁止话术检查：通过。" : "禁止话术检查：未通过 — " + qa.hits.map((h) => h.reason).join("；"));
    } else if (intent.kind === "qa") {
      // 抽取用户粘贴的话术：去掉触发词后检查
      const body = userText.replace(/.*?(检查|质检|能不能发)[:：\s]*/i, "");
      const qa = checkScript(body);
      blocks.push(qa.ok ? "可以发布：未命中禁止规则。" : "不能发布：\n" + qa.hits.map((h) => `- ${h.id} ${h.reason}`).join("\n"));
    } else {
      const hits = search(intent.query).slice(0, 3);
      hits.forEach((q) => citations.push(q));
      if (!citations.length) return { error: "没有检索到可引用原声，拒绝臆造结论。" };
      blocks.push(`检索到 ${hits.length} 条相关原声（按点赞排序）。请基于引用作答，不要脱离原声发挥。`);
    }

    if (!citations.length && intent.kind !== "qa") {
      return { error: "回答缺少原声引用，已拦截。" };
    }
    return { intent, blocks, citations, text: blocks.join("\n\n") };
  }

  root.VocAgent = {
    search, topicStats, priceCeiling, fourStep, checkScript, detectIntent, answer, topicOf,
  };
})(typeof window !== "undefined" ? window : globalThis);
