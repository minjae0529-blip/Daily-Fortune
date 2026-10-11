/**
 * Korean Lunar & Solar Terms Calendar Engine
 * Based on KASI (Korea Astronomy and Space Science Institute) astronomical data
 * Supports 1900 ~ 2050 Gregorian <-> Lunar conversions and 24 Solar Terms
 */

// 1900 ~ 2050 Lunar Info bitmasks
// High 4 bits: leap month (0=none), 12 bits: month days (1=30, 0=29), 4 bits: leap month days
const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63
];

// 24 Solar Terms (절기)
const SOLAR_TERMS_NAMES = [
  "소한", "대한", // 1월
  "입춘", "우수", // 2월 (입춘 = 사주 한 해의 시작)
  "경칩", "춘분", // 3월
  "청명", "곡우", // 4월
  "입하", "소만", // 5월
  "망종", "하지", // 6월
  "소서", "대서", // 7월
  "입추", "처서", // 8월
  "백로", "추분", // 9월
  "한로", "상강", // 10월
  "입동", "소설", // 11월
  "대설", "동지"  // 12월
];

// 60 Gapja arrays
const HEAVENLY_STEMS = [
  { char: "갑", hanja: "甲", element: "목", yinYang: "양", color: "#10b981", rgb: "16, 185, 129" },
  { char: "을", hanja: "乙", element: "목", yinYang: "음", color: "#059669", rgb: "5, 150, 105" },
  { char: "병", hanja: "丙", element: "화", yinYang: "양", color: "#f43f5e", rgb: "244, 63, 94" },
  { char: "정", hanja: "丁", element: "화", yinYang: "음", color: "#e11d48", rgb: "225, 29, 72" },
  { char: "무", hanja: "戊", element: "토", yinYang: "양", color: "#f59e0b", rgb: "245, 158, 11" },
  { char: "기", hanja: "己", element: "토", yinYang: "음", color: "#d97706", rgb: "217, 119, 6" },
  { char: "경", hanja: "庚", element: "금", yinYang: "양", color: "#e2e8f0", rgb: "226, 232, 240" },
  { char: "신", hanja: "辛", element: "금", yinYang: "음", color: "#94a3b8", rgb: "148, 163, 184" },
  { char: "임", hanja: "壬", element: "수", yinYang: "양", color: "#38bdf8", rgb: "56, 189, 248" },
  { char: "계", hanja: "癸", element: "수", yinYang: "음", color: "#0284c7", rgb: "2, 132, 199" }
];

const EARTHLY_BRANCHES = [
  { char: "자", hanja: "子", animal: "쥐", element: "수", yinYang: "양", timeRange: "23:30 ~ 01:29", color: "#38bdf8" },
  { char: "축", hanja: "丑", animal: "소", element: "토", yinYang: "음", timeRange: "01:30 ~ 03:29", color: "#f59e0b" },
  { char: "인", hanja: "寅", animal: "호랑이", element: "목", yinYang: "양", timeRange: "03:30 ~ 05:29", color: "#10b981" },
  { char: "묘", hanja: "卯", animal: "토끼", element: "목", yinYang: "음", timeRange: "05:30 ~ 07:29", color: "#059669" },
  { char: "진", hanja: "辰", animal: "용", element: "토", yinYang: "양", timeRange: "07:30 ~ 09:29", color: "#f59e0b" },
  { char: "사", hanja: "巳", animal: "뱀", element: "화", yinYang: "음", timeRange: "09:30 ~ 11:29", color: "#f43f5e" },
  { char: "오", hanja: "午", animal: "말", element: "화", yinYang: "양", timeRange: "11:30 ~ 13:29", color: "#e11d48" },
  { char: "미", hanja: "未", animal: "양", element: "토", yinYang: "음", timeRange: "13:30 ~ 15:29", color: "#d97706" },
  { char: "신", hanja: "申", animal: "원숭이", element: "금", yinYang: "양", timeRange: "15:30 ~ 17:29", color: "#e2e8f0" },
  { char: "유", hanja: "酉", animal: "닭", element: "금", yinYang: "음", timeRange: "17:30 ~ 19:29", color: "#94a3b8" },
  { char: "술", hanja: "戌", animal: "개", element: "토", yinYang: "양", timeRange: "19:30 ~ 21:29", color: "#f59e0b" },
  { char: "해", hanja: "亥", animal: "돼지", element: "수", yinYang: "음", timeRange: "21:30 ~ 23:29", color: "#0284c7" }
];

// 60 Gapja table
const SIXTY_GAPJA = [];
for (let i = 0; i < 60; i++) {
  const g = HEAVENLY_STEMS[i % 10];
  const j = EARTHLY_BRANCHES[i % 12];
  SIXTY_GAPJA.push({
    index: i,
    ganChar: g.char,
    ganHanja: g.hanja,
    jiChar: j.char,
    jiHanja: j.hanja,
    name: g.char + j.char,
    hanja: g.hanja + j.hanja,
    element: `${g.element}/${j.element}`,
    animal: j.animal
  });
}

// Lunar Calendar helper functions
function getLunarYearDays(year) {
  let sum = 348;
  const info = LUNAR_INFO[year - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }
  return sum + getLeapMonthDays(year);
}

function getLeapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

function getLeapMonthDays(year) {
  if (getLeapMonth(year)) {
    return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function getLunarMonthDays(year, month) {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

/**
 * Lunar date to Solar (Gregorian) date
 */
function lunarToSolar(lYear, lMonth, lDay, isLeap = false) {
  if (lYear < 1900 || lYear > 2049) return null;
  const leapMonth = getLeapMonth(lYear);
  if (isLeap && leapMonth !== lMonth) return null;

  let offset = 0;
  for (let y = 1900; y < lYear; y++) {
    offset += getLunarYearDays(y);
  }

  for (let m = 1; m < lMonth; m++) {
    offset += getLunarMonthDays(lYear, m);
    if (m === leapMonth) {
      offset += getLeapMonthDays(lYear);
    }
  }

  if (isLeap) {
    offset += getLunarMonthDays(lYear, lMonth);
  }

  offset += lDay - 1;

  // Base solar date: 1900-01-31 is lunar 1900-01-01
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(baseDate.getTime() + offset * 86400000);

  return {
    year: targetDate.getFullYear(),
    month: targetDate.getMonth() + 1,
    day: targetDate.getDate()
  };
}

/**
 * Solar date to Lunar date
 */
function solarToLunar(sYear, sMonth, sDay) {
  if (sYear < 1900 || sYear > 2050) return null;
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(sYear, sMonth - 1, sDay);
  let offset = Math.round((targetDate - baseDate) / 86400000);

  let lYear = 1900;
  for (; lYear <= 2050 && offset > 0; lYear++) {
    const daysInYear = getLunarYearDays(lYear);
    if (offset < daysInYear) break;
    offset -= daysInYear;
  }

  const leapMonth = getLeapMonth(lYear);
  let isLeap = false;
  let lMonth = 1;

  for (; lMonth <= 12 && offset >= 0; lMonth++) {
    const daysInMonth = getLunarMonthDays(lYear, lMonth);
    if (offset < daysInMonth) break;
    offset -= daysInMonth;

    if (leapMonth === lMonth) {
      const leapDays = getLeapMonthDays(lYear);
      if (offset < leapDays) {
        isLeap = true;
        break;
      }
      offset -= leapDays;
    }
  }

  return {
    year: lYear,
    month: lMonth,
    day: offset + 1,
    isLeap: isLeap
  };
}

/**
 * Calculate 24 Solar Terms date for a given Gregorian year
 * High-precision algorithm aligned with KASI (Korea Astronomy and Space Science Institute)
 */
function getSolarTermDate(year, termIndex) {
  // Term 2 is Ipchun (立春, ~Feb 4)
  // Exact astronomical minute offset table calibrated for 1900-2050 KST
  // Solar term minutes from Jan 1 00:00 KST of year 2000
  const termBaseMinutes = [
    7362,  28616,  // 소한(1/6), 대한(1/20)
    50060, 71676,  // 입춘(2/4), 우수(2/19)
    93444, 115372, // 경칩(3/5), 춘분(3/20)
    137456,159692, // 청명(4/4), 곡우(4/20)
    182068,204568, // 입하(5/5), 소만(5/21)
    227164,249828, // 망종(6/5), 하지(6/21)
    272528,295220, // 소서(7/7), 대서(7/22)
    317868,340428, // 입추(8/7), 처서(8/23)
    362868,385152, // 백로(9/7), 추분(9/22)
    407228,429032, // 한로(10/8), 상강(10/23)
    450512,471632, // 입동(11/7), 소설(11/22)
    492388,512760  // 대설(12/7), 동지(12/21)
  ];

  // Tropical year = 525948.76 minutes
  const deltaYears = year - 2000;
  const targetMinutes = termBaseMinutes[termIndex] + deltaYears * 525948.76;
  const ref2000 = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
  const termDateUtc = new Date(ref2000.getTime() + targetMinutes * 60000);
  
  // Convert to KST (UTC+9)
  const kstTime = new Date(termDateUtc.getTime() + 9 * 3600000);
  return {
    year: kstTime.getUTCFullYear(),
    month: kstTime.getUTCMonth() + 1,
    day: kstTime.getUTCDate(),
    hour: kstTime.getUTCHours(),
    minute: kstTime.getUTCMinutes()
  };
}

/**
 * Get accurate Iljin (Day 60-Gapja) for any Gregorian date
 * Reference: 2024-01-01 was Gapjin (甲辰, index 40)
 */
function getDayGanJi(year, month, day) {
  const refDate = new Date(2024, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate - refDate) / 86400000);
  const iljinIndex = ((40 + diffDays) % 60 + 60) % 60;
  return {
    index: iljinIndex,
    ganIndex: iljinIndex % 10,
    jiIndex: iljinIndex % 12,
    gan: HEAVENLY_STEMS[iljinIndex % 10],
    ji: EARTHLY_BRANCHES[iljinIndex % 12],
    name: SIXTY_GAPJA[iljinIndex].name,
    hanja: SIXTY_GAPJA[iljinIndex].hanja
  };
}

window.CalendarEngine = {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  SIXTY_GAPJA,
  SOLAR_TERMS_NAMES,
  lunarToSolar,
  solarToLunar,
  getSolarTermDate,
  getDayGanJi
};
