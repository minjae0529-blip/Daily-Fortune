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

  // 1. 입춘(立春) 계산 -> 년주(Year Pillar)
  // 입춘은 24절기 인덱스 2
  const ipchun = window.CalendarEngine.getSolarTermDate(solarYear, 2);
  const birthDateObj = new Date(solarYear, solarMonth - 1, solarDay, birthHour || 12, birthMinute || 0);
  const ipchunDateObj = new Date(ipchun.year, ipchun.month - 1, ipchun.day, ipchun.hour, ipchun.minute);

  let sajuYear = solarYear;
  if (birthDateObj < ipchunDateObj) {
    // 입춘 전이면 전년도 간지
    sajuYear = solarYear - 1;
  }

  const yearGanIdx = (sajuYear - 4) % 10;
  const yearJiIdx = (sajuYear - 4) % 12;
  const yearGan = window.CalendarEngine.HEAVENLY_STEMS[(yearGanIdx + 10) % 10];
  const yearJi = window.CalendarEngine.EARTHLY_BRANCHES[(yearJiIdx + 12) % 12];

  // 2. 24절기 12절(節) 기준 -> 월주(Month Pillar)
  // 12절의 인덱스: 0(소한), 2(입춘), 4(경칩), 6(청명), 8(입하), 10(망종), 12(소서), 14(입추), 16(백로), 18(한로), 20(입동), 22(대설)
  const termIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const monthJiChars = ["축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자"];
  const termDates = termIndices.map(tIdx => window.CalendarEngine.getSolarTermDate(solarYear, tIdx));

  let monthJiIdx = 1; // 기본값 인(寅)월
  for (let i = 0; i < 12; i++) {
    const t = termDates[i];
    const tDate = new Date(t.year, t.month - 1, t.day, t.hour, t.minute);
    const nextT = i < 11 
      ? termDates[i + 1] 
      : window.CalendarEngine.getSolarTermDate(solarYear + 1, 0); // 다음해 소한
    const nextDate = new Date(nextT.year, nextT.month - 1, nextT.day, nextT.hour, nextT.minute);

    if (birthDateObj >= tDate && birthDateObj < nextDate) {
      monthJiIdx = (i + 1) % 12; // 0=축, 1=인, 2=묘...
      break;
    }
  }

  // 오호둔년법(五虎遁年法): 연간에 따른 인월(寅月) 시작 천간
  // 갑/기 -> 병인(2)
  // 을/경 -> 무인(4)
  // 병/신 -> 경인(6)
  // 정/임 -> 임인(8)
  // 무/계 -> 갑인(0)
  const tigerStartGanMap = { 0: 2, 5: 2, 1: 4, 6: 4, 2: 6, 7: 6, 3: 8, 8: 8, 4: 0, 9: 0 };
  const inWolGanStart = tigerStartGanMap[yearGanIdx];
  // monthJiIdx: 1=인, 2=묘 ... 11=해, 0=축
  // 인월(1)부터 몇 번째 달인지 오프셋
  const offsetFromIn = (monthJiIdx - 1 + 12) % 12;
  const monthGanIdx = (inWolGanStart + offsetFromIn) % 10;
  const monthGan = window.CalendarEngine.HEAVENLY_STEMS[monthGanIdx];
  const monthJi = window.CalendarEngine.EARTHLY_BRANCHES[monthJiIdx];

  // 3. 일주(Day Pillar)
  const dayIljin = window.CalendarEngine.getDayGanJi(solarYear, solarMonth, solarDay);
  const dayGan = dayIljin.gan;
  const dayJi = dayIljin.ji;

  // 4. 시주(Hour Pillar)
  let hourGan = null;
  let hourJi = null;
  if (!isUnknownHour && birthHour !== null) {
    const hJiIdx = getHourJiIndex(birthHour, birthMinute, adjust30Min);
    hourJi = window.CalendarEngine.EARTHLY_BRANCHES[hJiIdx];
    // 오서둔일법(五鼠遁日法 - 시두법): 일간에 따른 자시(子時) 시작 천간
    // 갑/기 -> 갑자(0)
    // 을/경 -> 병자(2)
    // 병/신 -> 무자(4)
    // 정/임 -> 경자(6)
    // 무/계 -> 임자(8)
    const ratStartGanMap = { 0: 0, 5: 0, 1: 2, 6: 2, 2: 4, 7: 4, 3: 6, 8: 6, 4: 8, 9: 8 };
    const jaSiStartGan = ratStartGanMap[dayGan.char === "갑" || dayGan.char === "기" ? 0 : 
      dayGan.char === "을" || dayGan.char === "경" ? 1 : 
      dayGan.char === "병" || dayGan.char === "신" ? 2 : 
      dayGan.char === "정" || dayGan.char === "임" ? 3 : 4];
    const hourGanIdx = (jaSiStartGan + hJiIdx) % 10;
    hourGan = window.CalendarEngine.HEAVENLY_STEMS[hourGanIdx];
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

  // 5. 오행(목, 화, 토, 금, 수) 에너지 비율 분석
  // 월지(계절) 30%, 일지 15%, 일간 15%, 년지 10%, 시지 10%, 년간 10%, 월간 10% (시간 없을 시 재분배)
  const elementWeights = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
  const hasHour = !!pillars.hour;

  const w = hasHour ? {
    yearGan: 10, yearJi: 10,
    monthGan: 10, monthJi: 30, // 득령(월령) 최고 가중치
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

  // 용신(用神) 추천: 신강이면 식상/재성/관성 중 가장 필요한 오행, 신약이면 인성/비겁
  let yongsin = "";
  let yongsinDesc = "";
  if (isSinGang) {
    // 억부용신: 기운을 설기하거나 다듬어주는 식상, 재성
    const childEl = PRODUCES[myElement];
    const wealthEl = OVERCOMES[myElement];
    yongsin = elementWeights[childEl] < elementWeights[wealthEl] ? childEl : wealthEl;
    yongsinDesc = `에너지가 넘치는 ${strengthStatus} 사주이므로, 기운을 생산적으로 표출하고 다듬어주는 [${yongsin}] 기운이 최고의 행운을 엽니다.`;
  } else {
    // 인성 또는 비겁으로 보충
    yongsin = parentElement;
    yongsinDesc = `주체성과 기운을 든든하게 북돋워 주는 [${yongsin}] 기운(인성)과 비겁이 나를 지탱해 주는 핵심 수호신입니다.`;
  }

  // 6. 신살 분석
  const sinsal = window.SinsalEngine.analyzeSinsal(pillars);

  // 7. 일주론 상세 데이터 매칭
  const iljuKey = dayGan.char + dayJi.char;
  const iljuDetail = window.GapjaIljuData[iljuKey] || window.GapjaIljuData["갑자"];

  // 8. 대운(10년 주기) 계산
  // 양남음녀(갑/병/무/경/임 남성, 을/정/기/신/계 여성) -> 순행
  // 음남양녀 -> 역행
  const isYangGan = ["갑", "병", "무", "경", "임"].includes(yearGan.char);
  const isMale = gender === "male";
  const isForward = (isYangGan && isMale) || (!isYangGan && !isMale);

  // 대운수(대략 1~10세 사이)
  const daeunNumber = Math.max(1, Math.min(10, Math.floor(((solarDay * 3) % 9) + 1)));
  const daeunList = [];
  let curGanIdx = monthGanIdx;
  let curJiIdx = monthJiIdx;

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
    elements: elementWeights,
    strengthStatus,
    isSinGang,
    myPower,
    yongsin,
    yongsinDesc,
    sinsal,
    daeunNumber,
    isForward,
    daeunList
  };
}

window.SajuEngine = {
  calculateSaju,
  getTenGod
};
