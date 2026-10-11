/**
 * Daily Fortune & Category Readings Engine (Love, Wealth, Compatibility)
 * 일진(日辰) 상생상극 기반 오늘의 운세, 연애운, 재물운, 궁합 계산 엔진
 */

// 천간합 (天干合)
const GAN_HAP = {
  "갑기": "갑기합토 (甲己合土) - 신뢰와 결합의 기운",
  "기갑": "갑기합토 (甲己合土) - 신뢰와 결합의 기운",
  "을경": "을경합금 (乙庚合金) - 의리와 강단의 조화",
  "경을": "을경합금 (乙庚合金) - 의리와 강단의 조화",
  "병신": "병신합수 (丙辛合水) - 지혜와 유연함의 조화",
  "신병": "병신합수 (丙辛合水) - 지혜와 유연함의 조화",
  "정임": "정임합목 (丁壬合木) - 풍부한 감수성과 생명력",
  "임정": "정임합목 (丁壬合木) - 풍부한 감수성과 생명력",
  "무계": "무계합화 (戊癸合火) - 열정과 총명함의 결합",
  "계무": "무계합화 (戊癸合火) - 열정과 총명함의 결합"
};

// 지지육합 (地支六合)
const JI_YUKHAP = {
  "자축": "자축합토 (子丑合土)", "축자": "자축합토 (子丑合土)",
  "인해": "인해합목 (寅亥合木)", "해인": "인해합목 (寅亥合木)",
  "묘술": "묘술합화 (卯戌合火)", "술묘": "묘술합화 (卯戌合火)",
  "진유": "진유합금 (辰酉合金)", "유진": "진유합금 (辰酉合金)",
  "사신": "사신합수 (巳申合水)", "신사": "사신합수 (巳申合水)",
  "오미": "오미합일 (午未合日月)", "미오": "오미합일 (午未合日月)"
};

// 천간충 (天干沖)
const GAN_CHUNG = ["갑경", "경갑", "을신", "신을", "병임", "임병", "정계", "계정"];

// 지지충 (地支沖)
const JI_CHUNG = {
  "자오": "자오충 (子午沖) - 감정의 변동과 이동수", "오자": "자오충 (子午沖) - 감정의 변동과 이동수",
  "축미": "축미충 (丑未沖) - 재물과 일의 변동", "미축": "축미충 (丑未沖) - 재물과 일의 변동",
  "인신": "인신충 (寅申沖) - 진로와 활동성의 충돌", "신인": "인신충 (寅申沖) - 진로와 활동성의 충돌",
  "묘유": "묘유충 (卯酉沖) - 대인관계의 마찰과 결단", "유묘": "묘유충 (卯酉沖) - 대인관계의 마찰과 결단",
  "진술": "진술충 (辰戌沖) - 부동산과 자산의 재배치", "술진": "진술충 (辰戌沖) - 부동산과 자산의 재배치",
  "사해": "사해충 (巳亥沖) - 생각의 충돌과 새로운 시각", "해사": "사해충 (巳亥沖) - 생각의 충돌과 새로운 시각"
};

// 십신별 오늘의 테마 가이드
const DAILY_TENGOD_GUIDE = {
  "비견(比肩)": {
    theme: "동료와의 협력과 당당한 자기주장의 날",
    summary: "내 편이 되어주는 든든한 동료나 친구의 조력을 받으며 주체성을 발휘하기 좋습니다.",
    action: "팀 프로젝트나 지인과의 협업에 적극 나서보세요. 당당한 태도가 호감을 부릅니다.",
    avoid: "사소한 자존심 대결이나 고집으로 인한 감정 소모를 피하세요."
  },
  "겁재(劫財)": {
    theme: "선의의 경쟁과 과감한 승부수의 날",
    summary: "강한 승부욕과 추진력이 샘솟는 날로, 경쟁 환경에서 놀라운 순발력을 발휘합니다.",
    action: "경쟁자가 있는 시험, 입찰, 프로젝트에서 자신 있게 실력을 뽐내보세요.",
    avoid: "지나친 충동구매나 지인과의 금전 거래는 철저히 삼가세요."
  },
  "식신(食神)": {
    theme: "풍요로운 창의력과 미식의 기쁨이 넘치는 날",
    summary: "맛있는 음식과 즐거운 대화, 창의적인 영감이 가득하여 오감이 행복한 날입니다.",
    action: "좋아하는 사람들과 맛있는 식사를 나누거나 예술, 취미 창작 활동을 즐기세요.",
    avoid: "너무 낙천적인 마음에 마감 기한이나 약속 시간을 놓치지 않도록 주의하세요."
  },
  "상관(傷官)": {
    theme: "번뜩이는 아이디어와 화려한 표현력의 날",
    summary: "기존의 틀을 깨는 혁신적인 발상과 남다른 언변으로 사람들의 이목을 사로잡습니다.",
    action: "새로운 기획 발표, 제안서 작성, SNS 소통 등 표현의 장을 적극 펼쳐보세요.",
    avoid: "날카로운 직설화법으로 윗사람이나 연인에게 상처를 주지 않도록 완곡하게 말하세요."
  },
  "편재(偏財)": {
    theme: "뜻밖의 행운과 역동적인 비즈니스의 날",
    summary: "예상치 못한 기회나 횡재수가 따르며, 시야가 넓어져 큰 그림을 보게 됩니다.",
    action: "새로운 투자 기회를 스터디하거나 사업적 미팅, 네트워크 확장에 나서세요.",
    avoid: "무리한 투기나 일확천금을 노리는 도박성 행위는 금물입니다."
  },
  "정재(正財)": {
    theme: "착실한 성과와 신뢰가 자산으로 쌓이는 날",
    summary: "성실하게 쏟은 노력에 대한 정당한 보상이 주어지며, 재정적으로 매우 안정된 날입니다.",
    action: "가계부 정리, 알짜배기 자산 점검, 신뢰를 바탕으로 한 계약 체결에 집중하세요.",
    avoid: "지나친 인색함으로 주변 사람들에게 융통성 없다는 인상을 주지 마세요."
  },
  "편관(偏官)": {
    theme: "책임감과 카리스마로 난관을 돌파하는 날",
    summary: "다소 긴장감이 맴돌지만 강력한 리더십과 집중력으로 까다로운 문제를 단숨에 해결합니다.",
    action: "미뤄두었던 골치 아픈 일을 정면 돌파해 끝내버리세요. 큰 성취감을 얻습니다.",
    avoid: "무리한 과로로 몸을 혹사하지 말고 충분한 휴식으로 컨디션을 조절하세요."
  },
  "정관(正官)": {
    theme: "명예와 인정을 받으며 품격이 빛나는 날",
    summary: "윗사람이나 조직으로부터 공로를 인정받고 신뢰를 한 몸에 받는 품격 있는 날입니다.",
    action: "공적인 미팅이나 면접, 발표 등 원칙과 신뢰가 요구되는 자리에 당당히 서세요.",
    avoid: "형식과 겉치레에 너무 얽매여 실속을 놓치지 않도록 균형을 잡으세요."
  },
  "편인(偏印)": {
    theme: "깊은 영감과 특수한 재능이 꽃피는 날",
    summary: "직관력이 매우 예리해지며 남들이 보지 못하는 이면의 진실과 아이디어를 포착합니다.",
    action: "독서, 명상, 기획, 전문 연구 등 고도의 집중이 필요한 두뇌 활동에 전념하세요.",
    avoid: "잡생각이나 불필요한 의심으로 혼자만의 망상에 빠지지 마세요."
  },
  "정인(正印)": {
    theme: "따뜻한 사랑과 귀인의 은덕을 받는 날",
    summary: "어머니의 품처럼 포근한 온기가 깃들며, 주변 사람들이 호의를 베풀고 칭찬을 아끼지 않습니다.",
    action: "배움이나 조언을 적극 구하고, 나를 아껴주는 사람들에게 감사한 마음을 전하세요.",
    avoid: "지나친 의존성이나 게으름에 빠져 현실적인 실행을 미루지 마세요."
  }
};

/**
 * 특정 날짜에 대한 오늘의 운세 계산
 */
function calculateDailyFortune(sajuResult, targetDate = new Date()) {
  const tYear = targetDate.getFullYear();
  const tMonth = targetDate.getMonth() + 1;
  const tDay = targetDate.getDate();

  const todayIljin = window.CalendarEngine.getDayGanJi(tYear, tMonth, tDay);
  const userDayGan = sajuResult.pillars.day.gan;
  const userDayJi = sajuResult.pillars.day.ji;

  // 1. 오늘의 십신(일진 천간 기준)
  const todayTenGod = window.SajuEngine.getTenGod(userDayGan, todayIljin.gan);
  const guide = DAILY_TENGOD_GUIDE[todayTenGod] || DAILY_TENGOD_GUIDE["식신(食神)"];

  // 2. 합/충 체크
  const ganPair = userDayGan.char + todayIljin.gan.char;
  const jiPair = userDayJi.char + todayIljin.ji.char;

  const hasGanHap = !!GAN_HAP[ganPair];
  const ganHapDesc = GAN_HAP[ganPair] || null;

  const hasJiHap = !!JI_YUKHAP[jiPair];
  const jiHapDesc = JI_YUKHAP[jiPair] || null;

  const hasGanChung = GAN_CHUNG.includes(ganPair);
  const hasJiChung = !!JI_CHUNG[jiPair];
  const jiChungDesc = JI_CHUNG[jiPair] || null;

  // 3. 점수 계산 (기본 78점 ~ 98점)
  let baseScore = 80;
  if (hasGanHap) baseScore += 10;
  if (hasJiHap) baseScore += 8;
  if (hasGanChung) baseScore -= 6;
  if (hasJiChung) baseScore -= 5;

  // 오행 상생/상극 가중치
  const userEl = userDayGan.element;
  const todayEl = todayIljin.gan.element;
  if (userEl === todayEl || userEl === sajuResult.yongsin) baseScore += 5;

  const totalScore = Math.max(65, Math.min(99, baseScore));

  // 4대 지수
  const moneyScore = Math.max(60, Math.min(98, totalScore + (todayTenGod.includes("재") ? 8 : -3)));
  const loveScore = Math.max(60, Math.min(98, totalScore + (hasGanHap || hasJiHap || todayTenGod.includes("관") || todayTenGod.includes("재") ? 9 : -2)));
  const healthScore = Math.max(65, Math.min(95, totalScore + (hasJiChung ? -7 : 4)));
  const careerScore = Math.max(60, Math.min(99, totalScore + (todayTenGod.includes("관") || todayTenGod.includes("인") ? 8 : 2)));

  // 행운의 아이템 산출 (용신 및 부족한 오행 기반)
  const luckyColors = { "목": "초록색, 민트", "화": "붉은색, 코랄", "토": "노란색, 베이지, 골드", "금": "흰색, 은색", "수": "남색, 하늘색, 블랙" };
  const luckyDirections = { "목": "동쪽 (East)", "화": "남쪽 (South)", "토": "중앙 및 남서쪽", "금": "서쪽 (West)", "수": "북쪽 (North)" };
  const luckyFoods = { "목": "신선한 샐러드, 녹차, 채소 요리", "화": "따뜻한 국물, 로스팅 커피, 매콤한 요리", "토": "달콤한 디저트, 잡곡밥, 호박죽", "금": "정갈한 한정식, 견과류, 배즙", "수": "시원한 해산물, 미네랄 워터, 해초류" };

  const luckyTargetEl = sajuResult.yongsin || "목";
  const luckyNum1 = ((todayIljin.index + 3) % 9) + 1;
  const luckyNum2 = ((todayIljin.index + 7) % 9) + 1;

  // 시간대별 운세
  const hourlyFlow = [
    { time: "아침 (06:00 ~ 12:00)", status: "상승", desc: "활기찬 에너지로 머리가 맑아지며 중요한 계획을 세우기 좋습니다." },
    { time: "오후 (12:00 ~ 18:00)", status: totalScore > 80 ? "최고조" : "원만", desc: "대인관계와 커뮤니케이션에서 빛을 발하며 기회가 찾아옵니다." },
    { time: "저녁 (18:00 ~ 22:00)", status: "안정", desc: "편안한 사람들과 여유를 즐기며 보람찬 하루를 정리하기 알맞습니다." },
    { time: "밤 (22:00 ~ 06:00)", status: "재충전", desc: "내면의 영감이 솟아나며 숙면을 통해 기운을 완충하는 시간입니다." }
  ];

  return {
    dateString: `${tYear}년 ${tMonth}월 ${tDay}일`,
    todayIljin: {
      name: todayIljin.name,
      hanja: todayIljin.hanja,
      gan: todayIljin.gan,
      ji: todayIljin.ji
    },
    totalScore,
    todayTenGod,
    theme: guide.theme,
    summary: guide.summary,
    action: guide.action,
    avoid: guide.avoid,
    hasGanHap,
    ganHapDesc,
    hasJiHap,
    jiHapDesc,
    hasJiChung,
    jiChungDesc,
    scores: {
      money: moneyScore,
      love: loveScore,
      health: healthScore,
      career: careerScore
    },
    lucky: {
      color: luckyColors[luckyTargetEl] || "황금색 (Gold)",
      numbers: `${luckyNum1}, ${luckyNum2}`,
      direction: luckyDirections[luckyTargetEl] || "동남쪽",
      food: luckyFoods[luckyTargetEl] || "영양가 있는 따뜻한 식사"
    },
    hourlyFlow
  };
}

/**
 * 2인 사주 궁합(Compatibility) 계산 엔진
 */
function calculateCompatibility(saju1, saju2) {
  const gan1 = saju1.pillars.day.gan;
  const ji1 = saju1.pillars.day.ji;
  const gan2 = saju2.pillars.day.gan;
  const ji2 = saju2.pillars.day.ji;

  const pairGan = gan1.char + gan2.char;
  const pairJi = ji1.char + ji2.char;

  let baseScore = 75;
  const merits = [];
  const advices = [];

  // 1. 일간 합 (최고의 천생연분 결합)
  if (GAN_HAP[pairGan]) {
    baseScore += 15;
    merits.push(`천간합(${GAN_HAP[pairGan]}): 두 사람의 정신적 파동과 가치관이 톱니바퀴처럼 완벽하게 맞물리는 천생연분의 인연입니다.`);
  } else if (gan1.element === gan2.element) {
    baseScore += 5;
    merits.push("같은 오행의 기운: 오랜 친구처럼 편안하고 서로를 깊이 이해하는 공감대를 형성합니다.");
  } else if (GAN_CHUNG.includes(pairGan)) {
    baseScore -= 6;
    advices.push("천간 충의 기운: 성격과 표현 방식의 차이로 불꽃이 튈 수 있으니 서로의 다름을 존중하는 배려가 필요합니다.");
  }

  // 2. 일지 합 (속궁합 및 현실적 라이프스타일 결합)
  if (JI_YUKHAP[pairJi]) {
    baseScore += 12;
    merits.push(`지지육합(${JI_YUKHAP[pairJi]}): 함께 있을 때 정서적 안정감이 크며 현실적인 라이프스타일의 호흡이 매우 뛰어납니다.`);
  } else if (JI_CHUNG[pairJi]) {
    baseScore -= 7;
    advices.push(`지지 충(${JI_CHUNG[pairJi]}): 생활 습관이나 사소한 부분에서 마찰이 생길 수 있으니 규칙을 정해 배려하세요.`);
  }

  // 3. 오행 상호 보완성 (내가 부족한 오행을 상대가 많이 가지고 있는지)
  let complementBonus = 0;
  ["목", "화", "토", "금", "수"].forEach(el => {
    if (saju1.elements[el] < 15 && saju2.elements[el] > 25) complementBonus += 4;
    if (saju2.elements[el] < 15 && saju1.elements[el] > 25) complementBonus += 4;
  });
  if (complementBonus > 0) {
    baseScore += Math.min(10, complementBonus);
    merits.push("오행 상호 보완: 서로에게 부족한 기운을 상대방이 채워주어 함께할수록 운이 트이는 상생의 관계입니다.");
  }

  const finalScore = Math.max(65, Math.min(99, baseScore));

  let relationTheme = "";
  if (finalScore >= 92) relationTheme = "하늘이 맺어준 천생연분 (Soulmate)";
  else if (finalScore >= 84) relationTheme = "서로에게 큰 복이 되는 상생의 인연 (Synergy)";
  else if (finalScore >= 75) relationTheme = "친구처럼 든든한 동반자 (Companion)";
  else relationTheme = "서로를 통해 성장하는 밀당의 인연 (Growth)";

  return {
    score: finalScore,
    theme: relationTheme,
    merits: merits.length > 0 ? merits : ["서로의 독립된 영역을 존중하며 균형 있게 발전하는 관계입니다."],
    advices: advices.length > 0 ? advices : ["지금처럼 서로에 대한 신뢰와 배려를 유지하면 시간이 흐를수록 사랑이 깊어집니다."]
  };
}

window.FortuneEngine = {
  calculateDailyFortune,
  calculateCompatibility
};
