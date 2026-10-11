/**
 * Traditional Saju Manseryeok Engine
 * 정통 명리학 4주 8자, 십신, 지장간, 오행 비율, 신강신약, 대운 산출 엔진
 */

// 십신 관계 매핑 테이블 [일간 오행][상대 오행][음양 일치 여부: 1=같음(음양동), 0=다름(음양반)]
const TEN_GODS_MAP = {
  // 상대가 비겁 (같은 오행)
  same: { sameYinYang: "비견(比肩)", diffYinYang: "겁재(劫財)" },
  // 내가 생함 (식상)
  iProduce: { sameYinYang: "식신(食神)", diffYinYang: "상관(傷官)" },
  // 내가 극함 (재성)
  iOvercome: { sameYinYang: "편재(偏財)", diffYinYang: "정재(正財)" },
  // 나를 극함 (관성)
  overcomeMe: { sameYinYang: "편관(偏官)", diffYinYang: "정관(正官)" },
  // 나를 생함 (인성)
  produceMe: { sameYinYang: "편인(偏印)", diffYinYang: "정인(正印)" }
};

// 오행 상생 관계: 목->화->토->금->수->목
const PRODUCES = { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" };
// 오행 상극 관계: 목->토->수->화->금->목
const OVERCOMES = { "목": "토", "토": "수", "수": "화", "화": "금", "금": "목" };

// 지장간 정밀 데이터 (여기, 중기, 정기/본기)
const JIJANGGAN_DATA = {
  "자": { yeo: null, jung: null, jeong: "계", element: "수" },
  "축": { yeo: "계", jung: "신", jeong: "기", element: "토" },
  "인": { yeo: "무", jung: "병", jeong: "갑", element: "목" },
  "묘": { yeo: null, jung: null, jeong: "을", element: "목" },
  "진": { yeo: "을", jung: "계", jeong: "무", element: "토" },
  "사": { yeo: "무", jung: "경", jeong: "병", element: "화" },
  "오": { yeo: "병", jung: "기", jeong: "정", element: "화" },
  "미": { yeo: "정", jung: "을", jeong: "기", element: "토" },
  "신": { yeo: "무", jung: "임", jeong: "경", element: "금" },
  "유": { yeo: null, jung: null, jeong: "신", element: "금" },
  "술": { yeo: "신", jung: "정", jeong: "무", element: "토" },
  "해": { yeo: "무", jung: "갑", jeong: "임", element: "수" }
};

// 지장간 포맷팅 헬퍼 함수
function formatJijanggan(jiChar) {
  const data = JIJANGGAN_DATA[jiChar];
  if (!data) return "-";
  const hanjaMap = {
    "갑": "甲", "을": "乙", "병": "丙", "정": "丁", "무": "戊",
    "기": "己", "경": "庚", "신": "辛", "임": "壬", "계": "癸"
  };
  const list = [];
  if (data.yeo) list.push(`${hanjaMap[data.yeo] || data.yeo}(${data.yeo})`);
  if (data.jung) list.push(`${hanjaMap[data.jung] || data.jung}(${data.jung})`);
  if (data.jeong) list.push(`${hanjaMap[data.jeong] || data.jeong}(${data.jeong})`);
  return list.join(" · ");
}

/**
 * 십신 계산 함수
 */
function getTenGod(dayGanObj, targetObj) {
  if (!dayGanObj || !targetObj) return "-";
  if (dayGanObj.char === targetObj.char) return "본원(나)";

  const sameElement = dayGanObj.element === targetObj.element;
  const sameYinYang = dayGanObj.yinYang === targetObj.yinYang;

  if (sameElement) {
    return sameYinYang ? TEN_GODS_MAP.same.sameYinYang : TEN_GODS_MAP.same.diffYinYang;
  }
  if (PRODUCES[dayGanObj.element] === targetObj.element) {
    return sameYinYang ? TEN_GODS_MAP.iProduce.sameYinYang : TEN_GODS_MAP.iProduce.diffYinYang;
  }
  if (OVERCOMES[dayGanObj.element] === targetObj.element) {
    return sameYinYang ? TEN_GODS_MAP.iOvercome.sameYinYang : TEN_GODS_MAP.iOvercome.diffYinYang;
  }
  if (OVERCOMES[targetObj.element] === dayGanObj.element) {
    return sameYinYang ? TEN_GODS_MAP.overcomeMe.sameYinYang : TEN_GODS_MAP.overcomeMe.diffYinYang;
  }
  if (PRODUCES[targetObj.element] === dayGanObj.element) {
    return sameYinYang ? TEN_GODS_MAP.produceMe.sameYinYang : TEN_GODS_MAP.produceMe.diffYinYang;
  }
  return "-";
}

/**
 * 시간(Hour)과 분(Minute)으로부터 시지(Earthly Branch) 인덱스 계산
 * 한국 표준시(KST)는 동경 135도 기준이므로, 서울(127.5도) 기준 30분 보정 적용 시
 */
function getHourJiIndex(hour, minute, adjust30Min = true) {
  if (hour === null || hour === undefined || hour < 0) return null;
  let totalMinutes = hour * 60 + (minute || 0);
  if (adjust30Min) {
    totalMinutes -= 30; // 30분 역보정
    if (totalMinutes < 0) totalMinutes += 1440;
  }
  // 23:00 ~ 00:59 -> 자(0), 01:00 ~ 02:59 -> 축(1) ...
  // totalMinutes >= 1380 (23:00) 또는 < 60 (01:00 전) = 자시
  if (totalMinutes >= 1380 || totalMinutes < 60) return 0; // 자
  return Math.floor((totalMinutes + 60) / 120) % 12;
}

/**
 * 사주 4주 8자 통합 계산 엔진
 */
function calculateSaju(params) {
  const {
    name = "당신",
    gender = "male", // 'male' or 'female'
    calendarType = "solar", // 'solar' or 'lunar'
    isLeap = false,
    birthYear,
    birthMonth,
    birthDay,
    birthHour = null,
    birthMinute = null,
    isUnknownHour = false,
    adjust30Min = true
  } = params;

  let solarYear = parseInt(birthYear, 10);
  let solarMonth = parseInt(birthMonth, 10);
  let solarDay = parseInt(birthDay, 10);

  // 음력 입력인 경우 양력으로 변환
  let lunarInfo = null;
  if (calendarType === "lunar") {
    const converted = window.CalendarEngine.lunarToSolar(solarYear, solarMonth, solarDay, isLeap);
    if (!converted) {
      throw new Error("음력 날짜 변환 범위를 벗어났습니다 (1900~2049 지원)");
    }
    lunarInfo = { year: solarYear, month: solarMonth, day: solarDay, isLeap };
    solarYear = converted.year;
    solarMonth = converted.month;
    solarDay = converted.day;
  } else {
    lunarInfo = window.CalendarEngine.solarToLunar(solarYear, solarMonth, solarDay);
  }

  let yearGan = null, yearJi = null;
  let monthGan = null, monthJi = null;
  let dayGan = null, dayJi = null;
  let hourGan = null, hourJi = null;
  let luckPillarsData = null;
  let voidBranches = [];

  const useManseryeok = typeof window !== "undefined" && window.Manseryeok && typeof window.Manseryeok.calculateFourPillars === "function";

  if (useManseryeok) {
    try {
      const bHour = isUnknownHour ? 12 : (birthHour !== null ? birthHour : 12);
      const bMin = isUnknownHour ? 0 : (birthMinute !== null ? birthMinute : 0);
      const fp = window.Manseryeok.calculateFourPillars({
        year: solarYear,
        month: solarMonth,
        day: solarDay,
        hour: bHour,
        minute: bMin,
        gender: gender === "female" ? "female" : "male",
        isLunar: calendarType === "lunar",
        isLeapMonth: Boolean(isLeap),
        trueSolarTime: adjust30Min ? {
          longitude: 127.5,
          applyEquationOfTime: true,
          applyHistoricalDst: true
        } : undefined,
        dayBoundary: params.dayBoundary || "splitJasi"
      });

      const findStem = (ch) => window.CalendarEngine.HEAVENLY_STEMS.find(s => s.char === ch) || { char: ch, hanja: ch, element: "토", yinYang: "양", color: "#f59e0b" };
      const findBranch = (ch) => window.CalendarEngine.EARTHLY_BRANCHES.find(b => b.char === ch) || { char: ch, hanja: ch, animal: "", element: "토", yinYang: "양", color: "#f59e0b" };

      yearGan = findStem(fp.year.heavenlyStem);
      yearJi = findBranch(fp.year.earthlyBranch);
      monthGan = findStem(fp.month.heavenlyStem);
      monthJi = findBranch(fp.month.earthlyBranch);
      dayGan = findStem(fp.day.heavenlyStem);
      dayJi = findBranch(fp.day.earthlyBranch);

      if (!isUnknownHour && birthHour !== null) {
        hourGan = findStem(fp.hour.heavenlyStem);
        hourJi = findBranch(fp.hour.earthlyBranch);
      }

      luckPillarsData = fp.luckPillars;
      voidBranches = fp.voidBranches || [];
    } catch (e) {
      console.warn("Manseryeok calculateFourPillars fallback:", e);
    }
  }

  // Fallback calculation
  if (!yearGan || !yearJi || !dayGan || !dayJi) {
    const ipchun = window.CalendarEngine.getSolarTermDate(solarYear, 2);
    const birthDateObj = new Date(solarYear, solarMonth - 1, solarDay, birthHour || 12, birthMinute || 0);
    const ipchunDateObj = new Date(ipchun.year, ipchun.month - 1, ipchun.day, ipchun.hour, ipchun.minute);

    let sajuYear = solarYear;
    if (birthDateObj < ipchunDateObj) {
      sajuYear = solarYear - 1;
    }

    const yearGanIdx = (sajuYear - 4) % 10;
    const yearJiIdx = (sajuYear - 4) % 12;
    yearGan = window.CalendarEngine.HEAVENLY_STEMS[(yearGanIdx + 10) % 10];
    yearJi = window.CalendarEngine.EARTHLY_BRANCHES[(yearJiIdx + 12) % 12];

    const termIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    const termDates = termIndices.map(tIdx => window.CalendarEngine.getSolarTermDate(solarYear, tIdx));

    let monthJiIdx = 1;
    for (let i = 0; i < 12; i++) {
      const t = termDates[i];
      const tDate = new Date(t.year, t.month - 1, t.day, t.hour, t.minute);
      const nextT = i < 11 
        ? termDates[i + 1] 
        : window.CalendarEngine.getSolarTermDate(solarYear + 1, 0);
      const nextDate = new Date(nextT.year, nextT.month - 1, nextT.day, nextT.hour, nextT.minute);

      if (birthDateObj >= tDate && birthDateObj < nextDate) {
        monthJiIdx = (i + 1) % 12;
        break;
      }
    }

    const tigerStartGanMap = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 };
    const inWolGanStart = tigerStartGanMap[(yearGanIdx + 10) % 10];
    const offsetFromIn = (monthJiIdx - 1 + 12) % 12;
    const monthGanIdx = (inWolGanStart + offsetFromIn) % 10;
    monthGan = window.CalendarEngine.HEAVENLY_STEMS[monthGanIdx];
    monthJi = window.CalendarEngine.EARTHLY_BRANCHES[monthJiIdx];

    const dayIljin = window.CalendarEngine.getDayGanJi(solarYear, solarMonth, solarDay);
    dayGan = dayIljin.gan;
    dayJi = dayIljin.ji;

    if (!isUnknownHour && birthHour !== null) {
      const hJiIdx = getHourJiIndex(birthHour, birthMinute, adjust30Min);
      hourJi = window.CalendarEngine.EARTHLY_BRANCHES[hJiIdx];
      const ratStartGanMap = { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 };
      const jaSiStartGan = ratStartGanMap[dayGan.char === "갑" || dayGan.char === "기" ? 0 : 
        dayGan.char === "을" || dayGan.char === "경" ? 1 : 
        dayGan.char === "병" || dayGan.char === "신" ? 2 : 
        dayGan.char === "정" || dayGan.char === "임" ? 3 : 4];
      const hourGanIdx = (jaSiStartGan + hJiIdx) % 10;
      hourGan = window.CalendarEngine.HEAVENLY_STEMS[hourGanIdx];
    }
  }


  // 4주 기둥 구성
  const pillars = {
    year: {
      name: "년주(연주)",
      gan: yearGan,
      ji: yearJi,
      tenGodGan: getTenGod(dayGan, yearGan),
      tenGodJi: getTenGod(dayGan, { ...yearJi, yinYang: yearJi.yinYang, element: yearJi.element }),
      jijanggan: JIJANGGAN_DATA[yearJi.char]
    },
    month: {
      name: "월주",
      gan: monthGan,
      ji: monthJi,
      tenGodGan: getTenGod(dayGan, monthGan),
      tenGodJi: getTenGod(dayGan, { ...monthJi, yinYang: monthJi.yinYang, element: monthJi.element }),
      jijanggan: JIJANGGAN_DATA[monthJi.char]
    },
    day: {
      name: "일주 (본원)",
      gan: dayGan,
      ji: dayJi,
      tenGodGan: "본원(나)",
      tenGodJi: getTenGod(dayGan, { ...dayJi, yinYang: dayJi.yinYang, element: dayJi.element }),
      jijanggan: JIJANGGAN_DATA[dayJi.char]
    },
    hour: hourGan && hourJi ? {
      name: "시주",
      gan: hourGan,
      ji: hourJi,
      tenGodGan: getTenGod(dayGan, hourGan),
      tenGodJi: getTenGod(dayGan, { ...hourJi, yinYang: hourJi.yinYang, element: hourJi.element }),
      jijanggan: JIJANGGAN_DATA[hourJi.char]
    } : null
  };

  const hasHour = Boolean(hourGan && hourJi);

  // 5. [개선] 4주 원국 순수 글자 개수(Count) 정밀 계산

  const rawPillarElements = [
    yearGan.element, yearJi.element,
    monthGan.element, monthJi.element,
    dayGan.element, dayJi.element
  ];
  if (hasHour) {
    rawPillarElements.push(hourGan.element, hourJi.element);
  }
  const totalCharCount = rawPillarElements.length;

  // 글자 수 기반 실제 오행 카운트 (0개~8개)
  const elementCounts = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
  rawPillarElements.forEach(el => {
    elementCounts[el] = (elementCounts[el] || 0) + 1;
  });

  // 오행 백분율 (원국에 글자가 0개면 무조건 0%로 정확히 산출)
  const elementPercentages = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
  ["목", "화", "토", "금", "수"].forEach(el => {
    elementPercentages[el] = Math.round((elementCounts[el] / totalCharCount) * 100);
  });

  // 명리학적 세력 가중치 (득령 30% 등 월지 중심 분석)
  const elementWeights = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
  const w = hasHour ? {
    yearGan: 10, yearJi: 10,
    monthGan: 10, monthJi: 30, // 득령(월령) 가중치
    dayGan: 15, dayJi: 15,
    hourGan: 5, hourJi: 5
  } : {
    yearGan: 12, yearJi: 12,
    monthGan: 14, monthJi: 34,
    dayGan: 14, dayJi: 14
  };

  elementWeights[yearGan.element] += w.yearGan;
  elementWeights[yearJi.element] += w.yearJi;
  elementWeights[monthGan.element] += w.monthGan;
  elementWeights[monthJi.element] += w.monthJi;
  elementWeights[dayGan.element] += w.dayGan;
  elementWeights[dayJi.element] += w.dayJi;
  if (hasHour) {
    elementWeights[hourGan.element] += w.hourGan;
    elementWeights[hourJi.element] += w.hourJi;
  }

  // 신강/신약 분석 (내 편 = 비겁 + 인성, 상대 편 = 식상 + 재성 + 관성)
  const myElement = dayGan.element;
  const parentElement = { "목": "수", "화": "목", "토": "화", "금": "토", "수": "금" }[myElement];
  const myPower = elementWeights[myElement] + elementWeights[parentElement];
  const isSinGang = myPower >= 48;
  const strengthStatus = isSinGang ? (myPower > 65 ? "극신강(極身强)" : "신강(身强)") : (myPower < 32 ? "극신약(極身弱)" : "신약(身弱)");

  // 용신(用神) 정밀 선정 (사주에 존재하는 기운과 조후/억부 균형 반영)
  let yongsin = "";
  let yongsinDesc = "";
  if (isSinGang) {
    const childEl = PRODUCES[myElement];
    const wealthEl = OVERCOMES[myElement];
    yongsin = elementCounts[childEl] > 0 ? childEl : (elementCounts[wealthEl] > 0 ? wealthEl : childEl);
    yongsinDesc = `에너지가 넘치는 ${strengthStatus} 사주이므로, 기운을 막힘없이 세상으로 표출하고 다듬어주는 [${yongsin}] 기운이 최고의 행운을 엽니다.`;
  } else {
    yongsin = parentElement;
    yongsinDesc = `나를 든든하게 지탱해 주고 주체성을 북돋워 주는 [${yongsin}] 기운(인성)과 비겁이 삶의 든든한 버팀목이 됩니다.`;
  }

  // 6. 사주 원국에 존재하는 십신 및 없는 십신(무재, 무관, 무인성 등) 정밀 분석
  const allTenGods = [
    pillars.year.tenGodGan, pillars.year.tenGodJi,
    pillars.month.tenGodGan, pillars.month.tenGodJi,
    pillars.day.tenGodJi
  ];
  if (hasHour) {
    allTenGods.push(pillars.hour.tenGodGan, pillars.hour.tenGodJi);
  }

  const tenGodAnalysis = {
    hasBigeop: allTenGods.some(tg => tg.includes("비견") || tg.includes("겁재")),
    hasSiksang: allTenGods.some(tg => tg.includes("식신") || tg.includes("상관")),
    hasJaeseong: allTenGods.some(tg => tg.includes("편재") || tg.includes("정재")),
    hasGwanseong: allTenGods.some(tg => tg.includes("편관") || tg.includes("정관")),
    hasInseong: allTenGods.some(tg => tg.includes("편인") || tg.includes("정인"))
  };

  const missingTenGods = [];
  if (!tenGodAnalysis.hasJaeseong) {
    missingTenGods.push({
      type: "무재(無財) 사주",
      title: "재성(재물운)이 원국에 없는 사주",
      meaning: "재물이 없다는 뜻이 결코 아니며, 돈 계산에 얽매이지 않고 명예나 전문 기술, 브랜드 가치에 집중할 때 오히려 상상 이상의 거대한 부를 이루는 스타일입니다."
    });
  }
  if (!tenGodAnalysis.hasGwanseong) {
    missingTenGods.push({
      type: "무관(無官) 사주",
      title: "관성(조직·직장운)이 원국에 없는 사주",
      meaning: "갑갑한 수직적 위계 조직보다, 자율성이 보장되는 전문직·프리랜서·창업에서 독보적인 자유와 성공을 구가합니다."
    });
  }
  if (!tenGodAnalysis.hasInseong) {
    missingTenGods.push({
      type: "무인성(無印) 사주",
      title: "인성(문서·공부운)이 원국에 없는 사주",
      meaning: "생각만 하느라 타이밍을 놓치지 않고, 기회가 오면 동물적인 감각과 압도적인 실행력으로 남들보다 먼저 결과를 만듭니다."
    });
  }
  if (!tenGodAnalysis.hasSiksang) {
    missingTenGods.push({
      type: "무식상(無食) 사주",
      title: "식상(표현·재능운)이 원국에 없는 사주",
      meaning: "말만 앞서지 않고 묵묵히 결과로 실력을 증명하며, 불필요한 감정 낭비 없이 실속 있고 단단하게 내실을 챙깁니다."
    });
  }

  // 7. 내 사주가 특별히 좋은 이유 3가지 (Blessing Points)
  const blessingPoints = [
    {
      step: "01",
      badge: "타고난 핵심 강점",
      title: `본원 [${dayGan.char}${dayJi.char}] 일주의 독보적인 힘`,
      desc: isSinGang 
        ? `흔들리지 않는 자존감과 추진력을 지닌 ${strengthStatus} 사주로, 인생의 어떤 역경 앞에서도 스스로 돌파구를 열어젖히는 강력한 힘이 있습니다.`
        : `유연한 적응력과 탁월한 상황 판단력을 지닌 사주로, 주변의 흐름과 인덕을 지혜롭게 활용하여 안정적인 성공을 거둡니다.`
    },
    {
      step: "02",
      badge: "나를 돕는 기운",
      title: `사주의 균형을 잡아주는 [${yongsin}] 기운의 축복`,
      desc: yongsinDesc
    },
    {
      step: "03",
      badge: "결핍의 반전 매력",
      title: missingTenGods.length > 0 ? missingTenGods[0].type + "의 특화된 잠재력" : "오행구족의 평탄하고 원만한 복록",
      desc: missingTenGods.length > 0 
        ? missingTenGods[0].meaning 
        : "사주에 5행이 골고루 갖추어져 있어 편중되지 않고, 삶의 굴곡을 최소화하며 안정적인 복록과 장수를 누리는 길한 명식입니다."
    }
  ];

  // 6. 신살 분석
  const sinsal = window.SinsalEngine.analyzeSinsal(pillars);

  // 7. 일주론 상세 데이터 매칭
  const iljuKey = dayGan.char + dayJi.char;
  const iljuDetail = window.GapjaIljuData[iljuKey] || window.GapjaIljuData["갑자"];

  // 8. 대운(10년 주기) 계산
  let daeunNumber = 1;
  const daeunList = [];
  const isYangGan = ["갑", "병", "무", "경", "임"].includes(yearGan.char);
  const isMale = gender === "male";
  const isForward = (isYangGan && isMale) || (!isYangGan && !isMale);

  if (luckPillarsData && luckPillarsData.pillars && luckPillarsData.pillars.length > 0) {
    daeunNumber = luckPillarsData.startAge || 1;
    luckPillarsData.pillars.forEach(item => {
      const dGan = window.CalendarEngine.HEAVENLY_STEMS.find(s => s.char === item.pillar.heavenlyStem) || { char: item.pillar.heavenlyStem, hanja: "", element: "토" };
      const dJi = window.CalendarEngine.EARTHLY_BRANCHES.find(j => j.char === item.pillar.earthlyBranch) || { char: item.pillar.earthlyBranch, hanja: "", element: "토" };
      daeunList.push({
        startAge: item.age,
        endAge: item.age + 9,
        ganChar: dGan.char,
        jiChar: dJi.char,
        ganHanja: dGan.hanja || "",
        jiHanja: dJi.hanja || "",
        name: dGan.char + dJi.char,
        element: `${dGan.element}/${dJi.element}`,
        tenGod: getTenGod(dayGan, dGan)
      });
    });
  } else {
    daeunNumber = Math.max(1, Math.min(10, Math.floor(((solarDay * 3) % 9) + 1)));
    let curGanIdx = window.CalendarEngine.HEAVENLY_STEMS.findIndex(s => s.char === monthGan.char);
    let curJiIdx = window.CalendarEngine.EARTHLY_BRANCHES.findIndex(b => b.char === monthJi.char);
    for (let i = 1; i <= 8; i++) {
      if (isForward) {
        curGanIdx = (curGanIdx + 1) % 10;
        curJiIdx = (curJiIdx + 1) % 12;
      } else {
        curGanIdx = (curGanIdx - 1 + 10) % 10;
        curJiIdx = (curJiIdx - 1 + 12) % 12;
      }
      const dGan = window.CalendarEngine.HEAVENLY_STEMS[curGanIdx];
      const dJi = window.CalendarEngine.EARTHLY_BRANCHES[curJiIdx];
      const age = daeunNumber + (i - 1) * 10;
      daeunList.push({
        startAge: age,
        endAge: age + 9,
        ganChar: dGan.char,
        jiChar: dJi.char,
        ganHanja: dGan.hanja,
        jiHanja: dJi.hanja,
        name: dGan.char + dJi.char,
        element: `${dGan.element}/${dJi.element}`,
        tenGod: getTenGod(dayGan, dGan)
      });
    }
  }

    // 사주 원국에 없는 오행(0개) 및 과다 오행(3개 이상 또는 35% 이상) 판별
    const missingElements = [];
    const excessElements = [];
    const elementMeanings = {
      "목": { name: "목(木)", lack: "추진력, 유연성, 새로운 시작의 기운 부족", remedy: "초록색 옷·식물 인테리어, 아침 산책, 독서 추천" },
      "화": { name: "화(火)", lack: "열정, 표현력, 적극적인 대인관계 에너지 부족", remedy: "붉은색·코랄 계열 소품, 낮 시간 햇볕 쬐기, 유산소 운동 추천" },
      "토": { name: "토(土)", lack: "끈기, 안정감, 중심을 잡는 포용력 부족", remedy: "노란색·베이지 소품, 도자기·흙 만지기, 규칙적인 식습관 추천" },
      "금": { name: "금(金)", lack: "결단력, 절제력, 맺고 끊는 칼같은 마무리 부족", remedy: "흰색·실버 액세서리, 금속 제품 착용, 정리정돈 습관 추천" },
      "수": { name: "수(水)", lack: "지혜, 융통성, 정서적 유연성과 쉼의 여유 부족", remedy: "블루·네이비 계열 의상, 물 자주 마시기, 반신욕·수영 추천" }
    };

    ["목", "화", "토", "금", "수"].forEach(elKey => {
      const count = elementCounts[elKey];
      if (count === 0) {
        missingElements.push({ element: elKey, count: 0, ...elementMeanings[elKey] });
      } else if (count >= 3 || elementPercentages[elKey] >= 35) {
        excessElements.push({ element: elKey, count, percentage: elementPercentages[elKey], ...elementMeanings[elKey] });
      }
    });

    return {
      userInfo: {
        name,
        gender,
        genderKr: gender === "male" ? "남성" : "여성",
        calendarType,
        birthYear: solarYear,
        birthMonth: solarMonth,
        birthDay: solarDay,
        birthHour,
        birthMinute,
        isUnknownHour,
        lunarDate: lunarInfo,
        solarDateString: `${solarYear}년 ${solarMonth}월 ${solarDay}일`
      },
      pillars,
      iljuKey,
      iljuDetail,
      elementCounts,
      elementPercentages,
      elements: elementPercentages, // UI 바 차트와 호환
      missingElements,
      excessElements,
      missingTenGods,
      blessingPoints,
      strengthStatus,
      isSinGang,
      myPower,
      yongsin,
      yongsinDesc,
      sinsal,
      voidBranches,
      daeunNumber,

      isForward,
      daeunList
    };
  }

  window.SajuEngine = {
    calculateSaju,
    calculatePillars: calculateSaju,
    getTenGod,
    formatJijanggan,
    JIJANGGAN_DATA
  };
