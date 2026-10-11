/**
 * Sinsal (神煞) Calculation & Modern Interpretation Engine
 * 사주 핵심 신살(도화살, 역마살, 화개살, 천을귀인 등) 정밀 판별 및 현대적 풀이
 */

const SINSAL_DEFINITIONS = {
  "천을귀인": {
    name: "천을귀인 (天乙貴人)",
    type: "길신 (吉神)",
    tagColor: "emerald",
    icon: "sparkles",
    summary: "하늘이 내린 최고의 수호신이자 조력자",
    desc: "인생의 큰 위기나 난관에 부딪혔을 때 기적처럼 귀인이 나타나 도움을 주며, 흉한 기운을 길한 복록으로 변화시키는 최고의 행운의 별입니다.",
    modern: "현대에는 강력한 인맥운과 위기 극복 능력, 인덕으로 작용하여 사회적으로 든든한 멘토와 후원자를 쉽게 만납니다."
  },
  "도화살": {
    name: "도화살 (桃花煞)",
    type: "매력신 (魅力神)",
    tagColor: "rose",
    icon: "heart",
    summary: "만인을 사로잡는 치명적인 매력과 스타성",
    desc: "복숭아꽃 향기처럼 사람들의 시선과 마음을 은연중에 끌어당기는 치명적인 매력과 심미안, 예술적 감수성을 상징합니다.",
    modern: "현대 사회에서는 최고의 인기운이자 셀럽·인플루언서·크리에이터 기질로, 대중의 호감을 얻고 브랜드 가치를 높이는 황금 열쇠입니다."
  },
  "역마살": {
    name: "역마살 (驛馬煞)",
    type: "활동신 (活動神)",
    tagColor: "sky",
    icon: "compass",
    summary: "광활한 무대를 누비는 글로벌 개척정신",
    desc: "한곳에 머무르지 않고 끊임없이 이동하며 새로운 세상을 개척하는 역동적인 에너지와 기동력을 나타냅니다.",
    modern: "해외 비즈니스, 잦은 출장, 디지털 노마드, 빠른 변화 적응력으로 나타나며 넓은 세계에서 성공을 일구는 힘이 됩니다."
  },
  "화개살": {
    name: "화개살 (華蓋煞)",
    type: "지혜신 (智慧神)",
    tagColor: "purple",
    icon: "book",
    summary: "예술적 깊이와 철학적 영감의 꽃",
    desc: "화려함을 덮고 내면의 지혜와 예술, 학문을 깊이 탐구하는 영적이고 철학적인 기운을 상징합니다.",
    modern: "탁월한 기획력, 전문 연구, 예술적 창작, 콘텐츠 제작, 심리 상담 분야에서 독보적인 마니아층과 명성을 얻습니다."
  },
  "문창귀인": {
    name: "문창귀인 (文昌貴人)",
    type: "학문신 (學問神)",
    tagColor: "amber",
    icon: "feather",
    summary: "명석한 두뇌와 뛰어난 언어·문장력",
    desc: "학문과 글재주, 지혜가 출중하여 시험운과 창작운을 드높여주는 길신입니다.",
    modern: "시험 합격운, 논리적 말솜씨, 글쓰기, 전문 라이선스 취득에 매우 유리하며 지적 자산을 쉽게 형성합니다."
  },
  "괴강살": {
    name: "괴강살 (魁罡煞)",
    type: "영웅신 (英雄神)",
    tagColor: "indigo",
    icon: "shield",
    summary: "우두머리의 기백과 비상한 총명함",
    desc: "북두칠성의 우두머리 별처럼 강렬한 카리스마와 결단력, 남에게 지지 않는 승부욕을 품은 장군형 기운입니다.",
    modern: "CEO, 전문직 리더, 결단이 필요한 고난도 프로젝트 총괄에서 압도적인 성과와 영향력을 발휘합니다."
  },
  "백호대살": {
    name: "백호대살 (白虎大煞)",
    type: "추진신 (推進神)",
    tagColor: "orange",
    icon: "zap",
    summary: "폭발적인 에너지와 불굴의 돌파력",
    desc: "호랑이의 맹렬한 기세처럼 어떠한 거대한 장애물도 단숨에 뚫고 나가는 강렬한 집중력과 투지를 의미합니다.",
    modern: "위기 상황을 역전시키는 탁월한 승부사 기질과 프로페셔널한 프로정신으로 위기를 기회로 바꿉니다."
  },
  "양인살": {
    name: "양인살 (羊刃煞)",
    type: "강단신 (剛斷神)",
    tagColor: "red",
    icon: "crosshair",
    summary: "서슬 퍼런 칼날 같은 불굴의 의지",
    desc: "강인한 자존심과 독립심으로 결코 타인에게 굴복하지 않는 강철 같은 뚝심을 상징합니다.",
    modern: "의료, 법조, 군경, 첨단 기술 등 칼을 다루거나 정밀한 결단이 필요한 전문 분야에서 최고의 능력을 뽐냅니다."
  }
};

/**
 * Calculate Sinsal based on 4 Pillars
 */
function analyzeSinsal(sajuPillars) {
  const result = [];
  const { year, month, day, hour } = sajuPillars;
  const dayGan = day.gan.char;
  const dayJi = day.ji.char;
  const yearJi = year.ji.char;
  const allBranches = [year.ji.char, month.ji.char, day.ji.char, hour ? hour.ji.char : null].filter(Boolean);
  const allPillarsGapja = [
    year.gan.char + year.ji.char,
    month.gan.char + month.ji.char,
    day.gan.char + day.ji.char,
    hour ? hour.gan.char + hour.ji.char : null
  ].filter(Boolean);

  // 1. 천을귀인 (Day Gan criteria)
  const cheoneulMap = {
    "갑": ["축", "미"], "무": ["축", "미"], "경": ["축", "미"],
    "을": ["자", "신"], "기": ["자", "신"],
    "병": ["해", "유"], "정": ["해", "유"],
    "신": ["인", "오"],
    "임": ["사", "묘"], "계": ["사", "묘"]
  };
  const targetCheoneul = cheoneulMap[dayGan] || [];
  const foundCheoneul = allBranches.filter(b => targetCheoneul.includes(b));
  if (foundCheoneul.length > 0) {
    result.push({
      ...SINSAL_DEFINITIONS["천을귀인"],
      positions: foundCheoneul.map(b => `${b}(${foundCheoneul.indexOf(b) >= 0 ? "지지에 위치" : ""})`),
      detected: true
    });
  }

  // 2. 삼합 기반 신살 (도화, 역마, 화개)
  // Base branch: use Day Ji or Year Ji
  const getSamhapGroup = (ji) => {
    if (["인", "오", "술"].includes(ji)) return "인오술";
    if (["사", "유", "축"].includes(ji)) return "사유축";
    if (["신", "자", "진"].includes(ji)) return "신자진";
    if (["해", "묘", "미"].includes(ji)) return "해묘미";
    return null;
  };

  const group = getSamhapGroup(dayJi) || getSamhapGroup(yearJi);
  const dohwaMap = { "인오술": "묘", "사유축": "오", "신자진": "유", "해묘미": "자" };
  const yeokmaMap = { "인오술": "신", "사유축": "해", "신자진": "인", "해묘미": "사" };
  const hwagaeMap = { "인오술": "술", "사유축": "축", "신자진": "진", "해묘미": "미" };

  if (group) {
    // 도화살
    if (allBranches.includes(dohwaMap[group])) {
      result.push({ ...SINSAL_DEFINITIONS["도화살"], target: dohwaMap[group], detected: true });
    }
    // 역마살
    if (allBranches.includes(yeokmaMap[group])) {
      result.push({ ...SINSAL_DEFINITIONS["역마살"], target: yeokmaMap[group], detected: true });
    }
    // 화개살
    if (allBranches.includes(hwagaeMap[group])) {
      result.push({ ...SINSAL_DEFINITIONS["화개살"], target: hwagaeMap[group], detected: true });
    }
  }

  // 3. 문창귀인
  const munchangMap = {
    "갑": "사", "을": "오", "병": "신", "무": "신",
    "정": "유", "기": "유", "경": "해", "신": "자",
    "임": "인", "계": "묘"
  };
  if (allBranches.includes(munchangMap[dayGan])) {
    result.push({ ...SINSAL_DEFINITIONS["문창귀인"], target: munchangMap[dayGan], detected: true });
  }

  // 4. 괴강살
  const goegangList = ["무진", "무술", "경진", "경술", "임진", "임술"];
  if (allPillarsGapja.some(p => goegangList.includes(p))) {
    result.push({ ...SINSAL_DEFINITIONS["괴강살"], detected: true });
  }

  // 5. 백호대살
  const baekhoList = ["갑진", "을미", "병술", "정축", "무진", "임술", "계축"];
  if (allPillarsGapja.some(p => baekhoList.includes(p))) {
    result.push({ ...SINSAL_DEFINITIONS["백호대살"], detected: true });
  }

  // 6. 양인살
  const yanginMap = { "갑": "묘", "병": "오", "무": "오", "경": "유", "임": "자" };
  if (allBranches.includes(yanginMap[dayGan])) {
    result.push({ ...SINSAL_DEFINITIONS["양인살"], detected: true });
  }

  return result;
}

window.SinsalEngine = {
  SINSAL_DEFINITIONS,
  analyzeSinsal
};
