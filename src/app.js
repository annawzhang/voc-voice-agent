(function () {
  const log = document.getElementById("log");
  const form = document.getElementById("form");
  const input = document.getElementById("q");
  const chips = document.getElementById("chips");

  const SUGGEST = [
    "价格心理关口是多少？",
    "续航相关原声怎么看？",
    "生成价格议题四步话术",
    "检查：我们保证提车而且竞品垃圾",
  ];

  function esc(s) {
    return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function add(role, html) {
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function renderAnswer(res) {
    if (res.error) return `<span class="err">⚠ ${esc(res.error)}</span>`;
    let html = esc(res.text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (res.citations && res.citations.length) {
      html += '<div class="cites"><b>引用原声</b>';
      res.citations.forEach((q) => {
        html += `<div><mark>${esc(q.id)}</mark> · ${esc(q.model)} · ${esc(VocAgent.topicOf(q.topic).name)} · 👍${q.likes} · ${esc(q.stance)}<br/>「${esc(q.text)}」</div>`;
      });
      html += "</div>";
    }
    return html;
  }

  function ask(text) {
    const t = text.trim();
    if (!t) return;
    add("user", esc(t));
    const res = VocAgent.answer(t);
    add("bot", renderAnswer(res));
  }

  chips.innerHTML = SUGGEST.map((s) => `<button type="button" data-q="${esc(s)}">${esc(s)}</button>`).join("");
  chips.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-q]");
    if (b) ask(b.dataset.q);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = "";
  });

  add("bot", "你好。我只能基于虚构语料里的用户原声回答。可以问价格关口、某议题统计，或生成四步话术并做禁止话术检查。");
})();
