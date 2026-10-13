// 虚构用户原声语料：品牌 A9/A8/M7，口径对齐 voc-insight-kit
(function (root) {
  const TOPICS = [
    { key: "price", name: "价格 / 性价比" },
    { key: "range", name: "续航 / 能耗" },
    { key: "space", name: "空间 / 家用" },
    { key: "smart", name: "智能座舱" },
    { key: "service", name: "交付 / 服务" },
    { key: "design", name: "外观 / 设计" },
    { key: "compete", name: "竞品对比" },
  ];

  const QUOTES = [
    { id: "Q01", topic: "price", model: "A9", likes: 128, stance: "负", text: "指导价到 42 万了，同级能选的太多，这个价位我更犹豫。" },
    { id: "Q02", topic: "price", model: "A9", likes: 96, stance: "负", text: "踩着 39.98 万心理线还行，一过 40 万就想再等等优惠。" },
    { id: "Q03", topic: "price", model: "A8", likes: 74, stance: "中", text: "如果能稳在 35 万以内落地，我会认真去门店看看。" },
    { id: "Q04", topic: "price", model: "A9", likes: 61, stance: "正", text: "配齐智驾套餐后反而觉得划算，比单加总便宜。" },
    { id: "Q05", topic: "range", model: "A9", likes: 88, stance: "负", text: "冬天高速一跑，续航掉到标称的七成，焦虑。" },
    { id: "Q06", topic: "range", model: "M7", likes: 55, stance: "正", text: "市区代步续航够用，一周充一次就行。" },
    { id: "Q07", topic: "space", model: "A9", likes: 102, likes2: 0, stance: "正", text: "二排真能躺平，带老人长途比我现在的车舒服太多。" },
    { id: "Q08", topic: "space", model: "A8", likes: 47, stance: "中", text: "后备箱勉强，婴儿车 + 行李箱要计划着放。" },
    { id: "Q09", topic: "smart", model: "A9", likes: 79, stance: "正", text: "语音一次能办完导航和空调，不用翻两层菜单。" },
    { id: "Q10", topic: "smart", model: "A9", likes: 66, stance: "负", text: "车机偶尔卡死，重启一次要一两分钟，不安全感。" },
    { id: "Q11", topic: "service", model: "A9", likes: 91, stance: "负", text: "交付延期两周，网点解释含糊，社群里一堆人在问。" },
    { id: "Q12", topic: "service", model: "M7", likes: 40, stance: "正", text: "上门取送修很省事，进度短信也及时。" },
    { id: "Q13", topic: "design", model: "A9", likes: 58, stance: "负", text: "侧面腰线有点臃肿，同价位竞品更利落。" },
    { id: "Q14", topic: "design", model: "A8", likes: 33, stance: "正", text: "日间行车灯辨识度高，过隧道回头率可以。" },
    { id: "Q15", topic: "compete", model: "A9", likes: 110, stance: "中", text: "和某新势力比智驾，和某合资比做工，各有取舍。" },
    { id: "Q16", topic: "compete", model: "A9", likes: 70, stance: "负", text: "同价位那台竞品送的权益更多，销售也更敢承诺。" },
    { id: "Q17", topic: "price", model: "M7", likes: 52, stance: "负", text: "官方说 29.98 万起，配置单一点就到 33 万了。" },
    { id: "Q18", topic: "range", model: "A8", likes: 44, stance: "中", text: "标称 650，我实测高速大概 480，希望说明书写清楚工况。" },
    { id: "Q19", topic: "smart", model: "M7", likes: 29, stance: "正", text: "手机钥匙比实体钥匙方便，招手即开。" },
    { id: "Q20", topic: "service", model: "A8", likes: 37, stance: "负", text: "首保预约要等十天，一线城市也这样吗？" },
  ];

  // 禁止话术：对齐 voc-insight 质检思路（虚构规则）
  const FORBIDDEN = [
    { id: "F1", pattern: /一定升值|稳赚|零故障/, reason: "绝对化承诺，不可证实" },
    { id: "F2", pattern: /竞品垃圾|山寨|抄袭/, reason: "贬低竞品，易引发舆情" },
    { id: "F3", pattern: /私下转账|微信付款免定金/, reason: "引导非正规交易" },
    { id: "F4", pattern: /保证提车|一定提车/, reason: "交付承诺超出权限" },
  ];

  const PRICE_POINTS = [29.98, 33, 35, 39.98, 40, 42];

  root.VocData = { TOPICS, QUOTES, FORBIDDEN, PRICE_POINTS, BRAND: "示例出行" };
})(typeof window !== "undefined" ? window : globalThis);
