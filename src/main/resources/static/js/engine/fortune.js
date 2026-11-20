/**
 * Daily Fortune & Category Readings Engine (Love, Wealth, Compatibility)
 * 일진(日辰) 상생상극 및 하도(河圖) 5행 수리학 기반 고정밀 오늘의 운세 엔진
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

// 하도(河圖) 5행 수리학 표준 수비학 매핑
// 수(1,6), 화(2,7), 목(3,8), 금(4,9), 토(5,10)
const HADO_NUMBERS = {
  "수": [1, 6],
  "화": [2, 7],
  "목": [3, 8],
  "금": [4, 9],
  "토": [5, 10]
};

// 십신별 상세 일진 가이드
const DAILY_TENGOD_GUIDE = {
  "비견(比肩)": {
    theme: "동료와의 협력과 당당한 주체성의 날",
    summary: "내 편이 되어주는 든든한 동료나 조력자를 만나며 주체적으로 뜻을 펼치기 좋습니다.",
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

// 시간대별 십신 상호작용 행동 가이드 (아침, 오후, 저녁, 밤/심야 고유 분리)
const HOURLY_TENGOD_ADVICE = {
  morning: {
    "비견": "동료들과의 활발한 인사와 소통으로 활기차게 아침을 시작하세요. 팀의 단합이 큰 힘이 됩니다.",
    "겁재": "출근길 서두르다 물건을 분실하거나 불필요한 지출이 생기지 않도록 차분히 소지품을 챙기세요.",
    "식신": "창의적인 아이디어가 샘솟는 아침입니다. 든든한 아침 식사를 챙기고 오늘 할 일의 우선순위를 기분 좋게 정리하세요.",
    "상관": "두뇌 회전이 매우 빠르고 기민한 시간입니다. 낡은 관행 대신 신선한 발상으로 오전 업무를 기획해보세요.",
    "편재": "새로운 기회와 정보가 빠르게 포착되는 아침입니다. 메일이나 시장 흐름을 민첩하게 체크해보세요.",
    "정재": "꼼꼼하고 체계적인 계획 수립이 빛을 발하는 시간입니다. 오늘 일정과 예산을 꼼꼼히 정리하고 출발하세요.",
    "편관": "집중력과 결단력이 고조되는 아침입니다. 미뤄두었던 부담스러운 오전 과제부터 단호하게 처리하세요.",
    "정관": "단정하고 신뢰감 있는 태도가 행운을 부릅니다. 깔끔한 복장과 시간 엄수로 상대방에게 강한 신뢰를 심어주세요.",
    "편인": "직관과 통찰력이 빛나는 시간입니다. 깊은 사색이나 전문 지식 습득, 새로운 전략 수립에 몰입하기 좋습니다.",
    "정인": "선배나 상사의 조언에 귀를 기울이세요. 마음이 차분해지며 중요한 문서나 학습에서 높은 성과가 납니다."
  },
  afternoon: {
    "비견": "동료와의 협업이나 파트너십 미팅에서 시너지가 폭발합니다. 솔직하고 당당한 태도로 교섭을 주도하세요.",
    "겁재": "경쟁 상황에서 승부욕이 샘솟으나, 무리한 고집은 마찰을 낳습니다. 양보할 것은 양보하며 실리를 챙기세요.",
    "식신": "실무 추진력과 설득력이 최고조에 달합니다. 준비해 온 기획안을 적극 발표하거나 사람들을 부드럽게 리드하세요.",
    "상관": "기발한 순발력으로 난관을 돌파할 수 있는 시간입니다. 다만 직설적인 언행으로 오해를 사지 않도록 완곡하게 표현하세요.",
    "편재": "예상치 못한 성과나 알짜배기 이득이 발생할 수 있는 황금 시간입니다. 적극적인 영업과 투자 제안에 유리합니다.",
    "정재": "정확하고 빈틈없는 일 처리가 요구되는 시간입니다. 계약서나 계산서의 세부 조항을 한 번 더 면밀히 검토하세요.",
    "편관": "긴박한 결단이나 강한 리더십이 필요한 상황이 주어집니다. 주저하지 말고 원칙을 세워 단호하게 돌파하세요.",
    "정관": "조직 내 입지를 다지고 결재나 승인을 받기에 완벽한 타이밍입니다. 예의를 갖춘 보고가 최고의 결과를 만듭니다.",
    "편인": "복잡한 문제의 숨은 원인을 날카롭게 파악할 수 있습니다. 겉으로 드러나지 않은 이면의 조건을 꼼꼼히 분석하세요.",
    "정인": "차분한 조율과 문서 작업에 길한 시간입니다. 귀인의 지지와 도움을 받아 까다로운 업무가 순조롭게 매듭지어집니다."
  },
  evening: {
    "비견": "마음 맞는 친구나 지인과의 편안한 저녁 약속이 하루의 피로를 말끔히 씻어줍니다. 진솔한 우정을 나누세요.",
    "겁재": "기분에 휩쓸려 충동적인 회식비를 과도하게 지출하거나 과음하지 않도록 자기 통제력을 발휘하세요.",
    "식신": "미식의 즐거움과 여유를 만끽할 시간입니다. 정갈하고 맛있는 저녁 식사로 지친 몸과 마음에 활력을 선물하세요.",
    "상관": "취미 생활이나 예술적 활동, 유쾌한 대화로 스트레스를 해소하세요. 단, 가족이나 연인에게 뾰족한 말을 삼가세요.",
    "편재": "쇼핑이나 약속에서 뜻밖의 혜택을 얻을 수 있습니다. 가성비 좋은 소비와 즐거운 만남이 함께하는 시간입니다.",
    "정재": "하루의 지출을 정리하고 가정의 평온을 돌보기에 적합합니다. 가족과 함께 오붓하고 따뜻한 저녁을 보내세요.",
    "편관": "퇴근 후 가벼운 유산소 운동이나 스트레칭으로 굳은 몸을 풀어주세요. 긴장을 내려놓는 루틴이 필수적입니다.",
    "정관": "하루의 약속을 깔끔하게 매듭짓고 내일 일정을 정돈하세요. 신뢰를 지킨 사람으로서 깊은 보람을 느낄 수 있습니다.",
    "편인": "조용한 카페나 서재에서 나만의 취미에 몰입하기 좋은 저녁입니다. 인문학 독서나 음악 감상이 힐링을 줍니다.",
    "정인": "마음이 편안해지고 정서적 안정을 찾는 시간입니다. 따뜻한 차 한잔과 함께 소중한 사람에게 감사의 마음을 전하세요."
  },
  night: {
    "비견": "스스로에 대한 자긍심을 회복하는 밤입니다. 남과의 비교를 멈추고 오늘 하루 열심히 살아낸 나 자신을 칭찬해주세요.",
    "겁재": "심야 온라인 쇼핑이나 감정적 SNS 탐색을 자제하세요. 자극적인 영상 대신 일찍 조명을 낮추고 잠을 청하세요.",
    "식신": "야식의 유혹을 현명하게 이겨내고 편안한 잠자리를 마련하세요. 몸이 가벼워야 내일 아침 개운하게 시작합니다.",
    "상관": "머릿속 잡생각이 많아질 수 있으니 생각을 일기장에 쏟아내고 비워내세요. 디지털 디톡스가 숙면의 열쇠입니다.",
    "편재": "내일의 자산 계획이나 버킷리스트를 가볍게 스케치해보세요. 밝고 풍요로운 미래를 상상하며 잠자리에 드세요.",
    "정재": "주변 환경과 침구를 정돈하고 규칙적인 수면 리듬을 지키세요. 안정된 휴식이 내일의 재물운을 탄탄히 받쳐줍니다.",
    "편관": "오늘의 스트레스와 압박감을 완전히 내려놓으세요. 깊은 복식호흡과 명상으로 뇌를 쉬게 해주어야 합니다.",
    "정관": "규칙적인 취침 습관이 몸의 균형을 잡아줍니다. 정해진 시간에 잠자리에 들어 내일의 당당한 하루를 준비하세요.",
    "편인": "독창적인 영감이나 꿈의 계시가 찾아오는 심야입니다. 번뜩이는 아이디어가 있다면 머리맡 메모장에 적어두세요.",
    "정인": "가장 평화롭고 깊은 치유의 에너지가 흐르는 밤입니다. 따뜻한 침실에서 숙면을 취하며 완벽한 에너지 충전을 이루세요."
  }
};

/**
 * 특정 날짜에 대한 고정밀 오늘의 운세 계산
 * 사용자 사주(일간, 일지, 오행 분포, 용신)와 당일 일진의 다차원 상호작용
 */
function calculateDailyFortune(sajuResult, targetDate = new Date(), maybeMonth, maybeDay) {
  let tYear, tMonth, tDay;
  if (typeof targetDate === "number" && maybeMonth !== undefined) {
    tYear = targetDate;
    tMonth = maybeMonth;
    tDay = maybeDay || 1;
  } else if (targetDate && typeof targetDate.getFullYear === "function") {
    tYear = targetDate.getFullYear();
    tMonth = targetDate.getMonth() + 1;
    tDay = targetDate.getDate();
  } else {
    const now = new Date();
    tYear = now.getFullYear();
    tMonth = now.getMonth() + 1;
    tDay = now.getDate();
  }

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

  // 3. 점수 계산 (사용자별 고유 편차 계산)
  // 일간 인덱스(0~9)와 당일 일진 인덱스(0~59)의 상호작용
  const userGanIdx = window.CalendarEngine.HEAVENLY_STEMS.findIndex(g => g.char === userDayGan.char);
  const userJiIdx = window.CalendarEngine.EARTHLY_BRANCHES.findIndex(j => j.char === userDayJi.char);
  
  // 개인 고유 파동치 (Base Personal Resonance)
  const personalResonance = ((userGanIdx * 7 + userJiIdx * 3 + todayIljin.index * 5) % 15) - 7;

  let baseScore = 80 + personalResonance;
  if (hasGanHap) baseScore += 12;
  if (hasJiHap) baseScore += 9;
  if (hasGanChung) baseScore -= 8;
  if (hasJiChung) baseScore -= 7;

  // 사용자 오행과 당일 오행의 생극제화 가중치
  const userEl = userDayGan.element;
  const todayGanEl = todayIljin.gan.element;
  const todayJiEl = todayIljin.ji.element;

  // 용신이 오늘 천간 또는 지지에 들어오면 대길 가산점
  if (todayGanEl === sajuResult.yongsin) baseScore += 6;
  if (todayJiEl === sajuResult.yongsin) baseScore += 5;

  const totalScore = Math.max(62, Math.min(99, Math.round(baseScore)));

  // 4대 지수 개별 계산 (사용자 일주 및 당일 십신에 따라 완전히 차별화)
  const moneyOffset = (userJiIdx % 5) - 2;
  const loveOffset = (userGanIdx % 5) - 2;
  const healthOffset = ((userGanIdx + userJiIdx) % 5) - 2;
  const careerOffset = (todayIljin.index % 5) - 2;

  const moneyScore = Math.max(60, Math.min(98, totalScore + (todayTenGod.includes("재") ? 8 : -3) + moneyOffset));
  const loveScore = Math.max(60, Math.min(98, totalScore + (hasGanHap || hasJiHap || todayTenGod.includes("관") || todayTenGod.includes("재") ? 9 : -2) + loveOffset));
  const healthScore = Math.max(63, Math.min(96, totalScore + (hasJiChung ? -9 : 4) + healthOffset));
  const careerScore = Math.max(60, Math.min(99, totalScore + (todayTenGod.includes("관") || todayTenGod.includes("인") ? 8 : 2) + careerOffset));

  // 4. [개선] 오늘 나에게 가장 절실한 "개운 오행(Lucky Target Element)" 동적 도출
  // 사주 원국의 5행 결핍도 + 당일 일진의 기운을 다스리는 상생 오행
  const elements = sajuResult.elements;
  let leastElement = "목";
  let minWeight = 999;
  ["목", "화", "토", "금", "수"].forEach(elKey => {
    if (elements[elKey] < minWeight) {
      minWeight = elements[elKey];
      leastElement = elKey;
    }
  });

  // 오늘 일진과의 상호작용:
  // 오늘 기운이 강할 때 균형을 잡아줄 오행(용신 또는 결핍 오행과의 조화)
  let luckyTargetEl = leastElement;
  if (hasGanChung || hasJiChung) {
    // 충이 발생한 날은 이를 완충해주는 통관 오행(용신)을 최우선 채택
    luckyTargetEl = sajuResult.yongsin || leastElement;
  } else if ((userGanIdx + todayIljin.ganIndex) % 2 === 0) {
    luckyTargetEl = sajuResult.yongsin;
  }

  // 5. [개선] 하도(河圖) 수리학 기반 개인 맞춤 행운의 숫자 도출
  const hadoNums = HADO_NUMBERS[luckyTargetEl] || [3, 8];
  // 개인 생일 일진과 당일 일진의 조화 수
  const personalLuckySeed1 = (userGanIdx + todayIljin.ganIndex + hadoNums[0]) % 10;
  const personalLuckySeed2 = (userJiIdx + todayIljin.jiIndex + hadoNums[1]) % 10;
  const num1 = personalLuckySeed1 === 0 ? 10 : personalLuckySeed1;
  let num2 = personalLuckySeed2 === 0 ? 7 : personalLuckySeed2;
  if (num1 === num2) num2 = (num1 % 9) + 1;

  // 6. [개선] 개운 오행별 컬러 및 방위, 음식 매핑
  const luckyColorMap = {
    "목": ["에메랄드 그린, 싱그러운 민트", "포레스트 그린, 올리브", "애플그린, 연두색"],
    "화": ["선명한 레드, 따스한 코랄", "로즈 핑크, 다홍색", "루비 버건디, 주황색"],
    "토": ["고급스러운 골드, 카멜 베이지", "머스터드 옐로우, 크림색", "샌드 브라운, 테라코타"],
    "금": ["순백의 화이트, 세련된 실버", "샴페인 골드, 아이보리", "플래티넘 그레이, 진주색"],
    "수": ["깊은 네이비, 스카이 블루", "차콜 블랙, 미드나잇 블루", "코발트 블루, 바다색"]
  };
  const luckyDirMap = {
    "목": "동쪽 (East) - 새로운 생기가 솟아나는 방위",
    "화": "남쪽 (South) - 밝은 열정과 활력이 넘치는 방위",
    "토": "중앙 및 남서쪽 (Center/South-West) - 안정과 포용의 방위",
    "금": "서쪽 (West) - 결실과 정돈을 부르는 방위",
    "수": "북쪽 (North) - 지혜와 차분한 영감이 깃든 방위"
  };
  const luckyFoodMap = {
    "목": "신선한 그린 샐러드, 키위, 녹차, 채소 쌈밥",
    "화": "따뜻한 드립 커피, 매콤한 한식 찌개, 토마토 파스타",
    "토": "달콤한 단호박죽, 잡곡 비빔밥, 꿀차, 군고구마",
    "금": "정갈한 생선구이, 견과류, 배 도라지차, 흰 쌀밥",
    "수": "시원한 조개탕, 해산물 요리, 미네랄 워터, 해초 냉채"
  };

  const colorVariants = luckyColorMap[luckyTargetEl] || luckyColorMap["목"];
  const colorIndex = (userGanIdx + todayIljin.index) % colorVariants.length;
  const chosenColor = colorVariants[colorIndex];
  const chosenDir = luckyDirMap[luckyTargetEl];
  const chosenFood = luckyFoodMap[luckyTargetEl];

  // 7. [개선] 시두법(時頭法) 및 시간대별 십신(十神)·상생상극 기반 "시간대별 정밀 운세 리듬"
  // 하루 4대 시간대: 아침(진시 07~11시), 오후(오시 11~17시), 저녁(유시 17~21시), 밤/심야(자시 21~07시)
  const todayGanIdx = todayIljin.ganIndex; // 0=갑, 1=을, 2=병, 3=정, 4=무, 5=기, 6=경, 7=신, 8=임, 9=계
  const baseJaGanIdx = ((todayGanIdx % 5) * 2) % 10;

  const timeSlots = [
    { slotKey: "morning", name: "아침 (07:00 ~ 11:00)", branchChar: "진", jiOffset: 4 },
    { slotKey: "afternoon", name: "오후 (11:00 ~ 17:00)", branchChar: "오", jiOffset: 6 },
    { slotKey: "evening", name: "저녁 (17:00 ~ 21:00)", branchChar: "유", jiOffset: 9 },
    { slotKey: "night", name: "밤 (21:00 ~ 익일 07:00)", branchChar: "자", jiOffset: 0 }
  ];

  const hourlyFlow = timeSlots.map(slot => {
    const slotJiChar = slot.branchChar;
    const slotGan = HEAVENLY_STEMS[(baseJaGanIdx + slot.jiOffset) % 10];
    
    // 사용자의 일간과 해당 시간대 천간의 십신 계산
    const slotTenGodRaw = window.SajuEngine ? window.SajuEngine.getTenGod(userDayGan, slotGan) : "정관";
    const slotTenGodName = (slotTenGodRaw && slotTenGodRaw !== "-") ? slotTenGodRaw.split("(")[0] : "정관";

    // 사용자의 일지와 해당 시간대 지지의 육합/충 분석
    const pair = userDayJi.char + slotJiChar;
    const isSlotHap = !!JI_YUKHAP[pair];
    const isSlotChung = !!JI_CHUNG[pair];

    let status = "순조(平)";
    let statusBadgeClass = "bg-slate-100 text-slate-800 border border-slate-300";
    let desc = "";

    if (isSlotHap) {
      status = "최고조(大吉)";
      statusBadgeClass = "bg-amber-100 text-amber-900 border border-amber-400 font-black";
      const hapAdvice = {
        morning: "나의 일지와 육합(六合)을 이루어 아침부터 귀인의 조력과 반가운 소식이 찾아오는 최상의 스타트입니다.",
        afternoon: "일지와 육합(六合)의 시너지가 폭발하여 오후 업무 추진, 중요한 계약 및 협상에서 압도적인 결실을 맺습니다.",
        evening: "일지와 육합(六合)의 조화로 저녁 미팅과 만남에서 깊은 신뢰와 매력을 인정받으며 뜻밖의 행운이 따릅니다.",
        night: "일지와 육합(六合)을 이루어 심신이 완벽한 평온을 되찾으며, 숙면을 통해 내일의 대운을 가득 충전합니다."
      };
      desc = hapAdvice[slot.slotKey];
    } else if (isSlotChung) {
      status = "신중(愼重)";
      statusBadgeClass = "bg-rose-100 text-rose-900 border border-rose-400 font-black";
      const chungAdvice = {
        morning: "일지와 충(沖)을 이루는 기운이니 출근길 서두름을 피하고, 10분 일찍 준비하며 차분한 마음을 유지하세요.",
        afternoon: "일지와 충(沖)의 파동이 감돌아 돌발 변수가 생길 수 있으니 즉흥적인 결정 대신 한 번 더 신중히 검토하세요.",
        evening: "일지와 충(沖)으로 심신 피로도가 높으니 무리한 술자리나 감정적 언쟁을 삼가고 조용히 귀가해 휴식하세요.",
        night: "일지와 충(沖)으로 생각이 많아질 수 있으니 야간 스마트폰을 멀리하고 따뜻한 이완 요법으로 안정을 취하세요."
      };
      desc = chungAdvice[slot.slotKey];
    } else {
      // 십신별 기운 및 상태 분류
      if (["식신", "정재", "정관", "정인"].includes(slotTenGodName)) {
        status = "활력(吉)";
        statusBadgeClass = "bg-emerald-100 text-emerald-900 border border-emerald-300";
      } else if (["비견", "편재"].includes(slotTenGodName)) {
        status = "역동(順)";
        statusBadgeClass = "bg-sky-100 text-sky-900 border border-sky-300";
      } else if (["편관", "상관", "겁재"].includes(slotTenGodName)) {
        status = "조율(調)";
        statusBadgeClass = "bg-orange-100 text-orange-900 border border-orange-300";
      } else {
        status = "안정(安)";
        statusBadgeClass = "bg-indigo-100 text-indigo-900 border border-indigo-300";
      }

      const slotAdviceTable = HOURLY_TENGOD_ADVICE[slot.slotKey] || {};
      desc = slotAdviceTable[slotTenGodName] || "안정된 흐름 속에 자신의 페이스를 유지하며 순조롭게 하루를 전개하세요.";
    }

    return {
      time: slot.name,
      tenGodBadge: `${slotTenGodName}의 기운`,
      status,
      statusBadgeClass,
      desc
    };
  });

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
      color: chosenColor,
      numbers: `${num1}, ${num2}`,
      direction: chosenDir,
      food: chosenFood,
      targetElement: luckyTargetEl
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
