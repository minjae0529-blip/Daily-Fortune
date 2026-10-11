/**
 * Main Application Controller (천명 - 오늘의 운세 & 사주 만세력)
 * Modern Minimal UI, Interactive Blessing Animations, Exact Element Counts & Diagnostics
 */

const App = {
  currentMode: "daily", // 'daily', 'saju', 'love'
  activeTab: "daily",
  userSaju: null,
  dailyFortune: null,
  partnerSaju: null,
  compatResult: null,
  currentTarotCard: null,
  isBlessingOpen: false,

  init() {
    this.populateDateSelects();
    this.initRealtimeBanner();
    this.setMode("daily");
    this.initTarotCard();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // 오늘 날짜 및 실시간 일진 배너
  initRealtimeBanner() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = days[now.getDay()];

    const iljin = window.CalendarEngine.getDayGanJi(y, m, d);
    const dateStr = `${y}년 ${m}월 ${d}일 (${dayName})`;

    const bannerDate = document.getElementById("bannerDate");
    const bannerIljin = document.getElementById("bannerIljin");
    if (bannerDate && bannerIljin) {
      bannerDate.textContent = dateStr;
      bannerIljin.textContent = `· ${iljin.name}(${iljin.hanja})일`;
    }

    const todayDateTitle = document.getElementById("dailyDateTitle");
    if (todayDateTitle) {
      todayDateTitle.textContent = `${dateStr} 운세`;
    }
  },

  // 생년월일 셀렉트 생성
  populateDateSelects() {
    const curYear = new Date().getFullYear();
    const fillOptions = (selectId, start, end, selectedVal, pad = false, suffix = "") => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.innerHTML = "";
      for (let i = start; i <= end; i++) {
        const val = pad ? String(i).padStart(2, "0") : String(i);
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${val}${suffix}`;
        if (i === selectedVal) opt.selected = true;
        select.appendChild(opt);
      }
    };

    fillOptions("birthYear", 1930, curYear, 1996, false, "년");
    fillOptions("birthMonth", 1, 12, 5, false, "월");
    fillOptions("birthDay", 1, 31, 15, false, "일");
    fillOptions("birthHour", 0, 23, 12, true, "시");
    fillOptions("birthMinute", 0, 59, 30, true, "분");

    fillOptions("partnerYear", 1930, curYear, 1997, false, "년");
    fillOptions("partnerMonth", 1, 12, 8, false, "월");
    fillOptions("partnerDay", 1, 31, 20, false, "일");
  },

  // 모드 변경 (오늘의 운세 vs 정통 사주 vs 연애/궁합)
  setMode(mode) {
    this.currentMode = mode;
    const modeTabs = {
      daily: document.getElementById("modeBtnDaily"),
      saju: document.getElementById("modeBtnSaju"),
      love: document.getElementById("modeBtnLove")
    };

    Object.keys(modeTabs).forEach(k => {
      const btn = modeTabs[k];
      if (!btn) return;
      if (k === mode) {
        btn.className = "py-2 rounded-lg text-xs font-semibold transition text-center text-amber-300 bg-white/10";
      } else {
        btn.className = "py-2 rounded-lg text-xs font-medium transition text-center text-slate-400 hover:text-white";
      }
    });

    const advFields = document.getElementById("advancedSajuFields");
    const partnerFields = document.getElementById("partnerSection");
    const submitBtnText = document.getElementById("submitBtnText");

    if (mode === "daily") {
      advFields.classList.remove("expanded");
      partnerFields.classList.remove("expanded");
      submitBtnText.textContent = "오늘의 운세 바로보기";
    } else if (mode === "saju") {
      advFields.classList.add("expanded");
      partnerFields.classList.remove("expanded");
      submitBtnText.textContent = "정통 사주팔자 만세력 분석하기";
    } else if (mode === "love") {
      advFields.classList.add("expanded");
      partnerFields.classList.add("expanded");
      submitBtnText.textContent = "연애운 & 인연 궁합 분석하기";
    }

    if (window.lucide) window.lucide.createIcons();
  },

  setGanjiTime(hourVal) {
    const hourSelect = document.getElementById("birthHour");
    const minuteSelect = document.getElementById("birthMinute");
    const unknownCheckbox = document.getElementById("unknownHour");

    if (hourSelect) hourSelect.value = hourVal;
    if (minuteSelect) minuteSelect.value = 30;
    if (unknownCheckbox) unknownCheckbox.checked = false;
    this.toggleUnknownHour(false);
  },

  toggleUnknownHour(isUnknown) {
    const hourSelect = document.getElementById("birthHour");
    const minuteSelect = document.getElementById("birthMinute");
    const container = document.getElementById("hourInputContainer");
    if (hourSelect) hourSelect.disabled = isUnknown;
    if (minuteSelect) minuteSelect.disabled = isUnknown;
    if (container) {
      if (isUnknown) {
        container.classList.add("opacity-30", "pointer-events-none");
      } else {
        container.classList.remove("opacity-30", "pointer-events-none");
      }
    }
  },

  togglePartnerActive(enabled) {
    const fields = document.getElementById("partnerInputFields");
    if (!fields) return;
    if (enabled) {
      fields.classList.remove("opacity-30", "pointer-events-none");
    } else {
      fields.classList.add("opacity-30", "pointer-events-none");
    }
  },

  // 폼 제출
  handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim() || "당신";
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const calendarTypeRadio = document.querySelector('input[name="calendarType"]:checked').value;
    const isLeap = calendarTypeRadio === "lunar_leap";
    const calendarType = calendarTypeRadio.startsWith("lunar") ? "lunar" : "solar";

    const birthYear = document.getElementById("birthYear").value;
    const birthMonth = document.getElementById("birthMonth").value;
    const birthDay = document.getElementById("birthDay").value;

    const isUnknownHour = document.getElementById("unknownHour").checked;
    const birthHour = isUnknownHour ? null : parseInt(document.getElementById("birthHour").value, 10);
    const birthMinute = isUnknownHour ? null : parseInt(document.getElementById("birthMinute").value, 10);
    const adjust30Min = document.getElementById("adjust30Min").checked;

    try {
      this.userSaju = window.SajuEngine.calculateSaju({
        name,
        gender,
        calendarType,
        isLeap,
        birthYear,
        birthMonth,
        birthDay,
        birthHour,
        birthMinute,
        isUnknownHour,
        adjust30Min
      });

      this.dailyFortune = window.FortuneEngine.calculateDailyFortune(this.userSaju);

      const enablePartner = document.getElementById("enablePartner") && document.getElementById("enablePartner").checked;
      if (enablePartner) {
        const partnerName = document.getElementById("partnerName").value.trim() || "상대방";
        const partnerGender = document.getElementById("partnerGender").value;
        const partnerYear = document.getElementById("partnerYear").value;
        const partnerMonth = document.getElementById("partnerMonth").value;
        const partnerDay = document.getElementById("partnerDay").value;

        this.partnerSaju = window.SajuEngine.calculateSaju({
          name: partnerName,
          gender: partnerGender,
          calendarType: "solar",
          isLeap: false,
          birthYear: partnerYear,
          birthMonth: partnerMonth,
          birthDay: partnerDay,
          isUnknownHour: true
        });

        this.compatResult = window.FortuneEngine.calculateCompatibility(this.userSaju, this.partnerSaju);
      } else {
        this.partnerSaju = null;
        this.compatResult = null;
      }

      this.renderResults();
      this.showResultSection();

      if (this.currentMode === "saju") {
        this.switchResultTab("saju");
      } else if (this.currentMode === "love") {
        this.switchResultTab("love");
      } else {
        this.switchResultTab("daily");
      }

      if (window.confetti) {
        window.confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#fbbf24", "#38bdf8", "#34d399"]
        });
      }

    } catch (err) {
      alert("사주 계산 중 오류가 발생했습니다: " + err.message);
      console.error(err);
    }
  },

  showResultSection() {
    document.getElementById("inputSection").classList.add("hidden");
    const resSec = document.getElementById("resultSection");
    resSec.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  resetToHome() {
    document.getElementById("inputSection").classList.remove("hidden");
    document.getElementById("resultSection").classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  getElementClass(elementName) {
    switch (elementName) {
      case "목": return "element-wood";
      case "화": return "element-fire";
      case "토": return "element-earth";
      case "금": return "element-metal";
      case "수": return "element-water";
      default: return "";
    }
  },

  // NEW: 내 사주가 좋은 이유 3가지 (애니메이션 아코디언 토글)
  toggleBlessingCard() {
    const sec = document.getElementById("blessingSection");
    const chevron = document.getElementById("blessingChevron");
    if (!sec) return;

    this.isBlessingOpen = !this.isBlessingOpen;
    if (this.isBlessingOpen) {
      sec.classList.add("expanded");
      if (chevron) chevron.style.transform = "rotate(180deg)";
    } else {
      sec.classList.remove("expanded");
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  },

  // 결과 렌더링 총괄
  renderResults() {
    const s = this.userSaju;
    const f = this.dailyFortune;

    // 1. 프로필 요약 카드
    document.getElementById("resUserName").textContent = s.userInfo.name;
    document.getElementById("resSolarDate").textContent = s.userInfo.solarDateString;
    document.getElementById("resLunarDate").textContent = s.userInfo.lunarDate ? `${s.userInfo.lunarDate.year}년 ${s.userInfo.lunarDate.month}월 ${s.userInfo.lunarDate.day}일` : "-";
    document.getElementById("resGender").textContent = s.userInfo.genderKr;
    document.getElementById("resHourDesc").textContent = s.userInfo.isUnknownHour ? "시간 모름" : `${s.userInfo.birthHour}시 ${s.userInfo.birthMinute}분`;

    document.getElementById("resIljuAnimalSymbol").textContent = s.iljuDetail.symbol;
    document.getElementById("resStrengthBadge").textContent = s.strengthStatus;
    document.getElementById("resTotalScore").textContent = f.totalScore;

    let scoreGrade = "평온(平溫)";
    if (f.totalScore >= 95) scoreGrade = "대대길(大大吉)";
    else if (f.totalScore >= 88) scoreGrade = "대길(大吉)";
    else if (f.totalScore >= 80) scoreGrade = "길(吉)";
    document.getElementById("resScoreGrade").textContent = scoreGrade;

    // NEW: "내 사주가 좋은 이유 3가지" 렌더링
    const blessingContainer = document.getElementById("blessingContainer");
    if (blessingContainer) {
      blessingContainer.innerHTML = "";
      s.blessingPoints.forEach((b, idx) => {
        const bCard = document.createElement("div");
        bCard.className = `p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 animate-slide-up`;
        bCard.style.animationDelay = `${idx * 120}ms`;
        bCard.innerHTML = `
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">${b.badge}</span>
            <span class="text-slate-500 font-mono text-[10px]">POINT ${b.step}</span>
          </div>
          <h5 class="text-xs font-bold text-white font-serif-kr">${b.title}</h5>
          <p class="text-[11px] text-slate-300 leading-relaxed">${b.desc}</p>
        `;
        blessingContainer.appendChild(bCard);
      });
    }

    // 2. 오늘의 운세 탭
    document.getElementById("dailyThemeTitle").textContent = f.theme;
    document.getElementById("dailySummaryText").textContent = f.summary;
    document.getElementById("dailyActionText").textContent = f.action;
    document.getElementById("dailyAvoidText").textContent = f.avoid;
    document.getElementById("dailyTenGodBadge").textContent = f.todayTenGod;

    document.getElementById("idxMoneyScore").textContent = `${f.scores.money}%`;
    document.getElementById("idxLoveScore").textContent = `${f.scores.love}%`;
    document.getElementById("idxHealthScore").textContent = `${f.scores.health}%`;
    document.getElementById("idxCareerScore").textContent = `${f.scores.career}%`;

    document.getElementById("luckyColor").textContent = f.lucky.color;
    document.getElementById("luckyNumbers").textContent = f.lucky.numbers;
    document.getElementById("luckyDirection").textContent = f.lucky.direction;
    document.getElementById("luckyFood").textContent = f.lucky.food;

    // 시간대별 운세
    const hourlyContainer = document.getElementById("hourlyContainer");
    hourlyContainer.innerHTML = "";
    f.hourlyFlow.forEach(h => {
      const card = document.createElement("div");
      card.className = "p-2.5 rounded-xl bg-slate-900/40 border border-white/5";
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs mb-0.5">
          <span class="text-slate-400 text-[11px]">${h.time}</span>
          <span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-white/5 text-amber-300">${h.status}</span>
        </div>
        <p class="text-[11px] text-slate-300">${h.desc}</p>
      `;
      hourlyContainer.appendChild(card);
    });

    // 3. 정통 사주팔자 만세력 표 렌더링
    this.renderPillarsTable(s.pillars);

    document.getElementById("iljuTitle").textContent = `${s.iljuDetail.name} (${s.iljuDetail.symbol})`;
    document.getElementById("iljuDesc").textContent = s.iljuDetail.desc;
    document.getElementById("iljuStrength").textContent = s.iljuDetail.strength;
    document.getElementById("iljuCaution").textContent = s.iljuDetail.caution;
    document.getElementById("iljuLove").textContent = s.iljuDetail.loveStyle;
    document.getElementById("iljuWealth").textContent = s.iljuDetail.wealthStyle;

    // 신살 렌더링 (사주 내 위치 정확히 표기)
    const sinsalContainer = document.getElementById("sinsalContainer");
    sinsalContainer.innerHTML = "";
    if (s.sinsal && s.sinsal.length > 0) {
      s.sinsal.forEach(item => {
        const div = document.createElement("div");
        div.className = "p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1";
        div.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-300 font-serif-kr">${item.name}</span>
            <span class="text-[10px] text-slate-400">${item.type}</span>
          </div>
          <div class="text-[11px] text-sky-400 font-medium">위치: ${item.position || "사주 원국"}</div>
          <p class="text-[11px] text-slate-300">${item.modern}</p>
        `;
        sinsalContainer.appendChild(div);
      });
    } else {
      sinsalContainer.innerHTML = `<p class="text-xs text-slate-400 col-span-2">사주의 균형이 온화하여 특수한 흉살이 없으며 평탄한 복록을 누립니다.</p>`;
    }

    // 대운 렌더링
    document.getElementById("daeunMeta").textContent = `대운수: ${s.daeunNumber}세 (${s.isForward ? "순행" : "역행"})`;
    const daeunContainer = document.getElementById("daeunContainer");
    daeunContainer.innerHTML = "";
    s.daeunList.forEach(d => {
      const dCard = document.createElement("div");
      dCard.className = "p-2 rounded-xl bg-slate-900/40 border border-white/5";
      dCard.innerHTML = `
        <div class="text-[10px] text-amber-400 font-medium">${d.startAge}~${d.endAge}세</div>
        <div class="font-serif-kr text-sm font-bold text-white my-0.5">${d.ganHanja}${d.jiHanja}</div>
        <div class="text-[9px] text-slate-400">${d.name}</div>
        <div class="text-[9px] text-slate-500">${d.tenGod}</div>
      `;
      daeunContainer.appendChild(dCard);
    });

    // 4. 오행 밸런스 탭 (실제 글자 개수 Count와 백분율 정확 출력)
    const counts = s.elementCounts;
    const pcts = s.elementPercentages;

    const setElementUI = (key, countId, barId) => {
      const c = counts[key] || 0;
      const p = pcts[key] || 0;
      const labelEl = document.getElementById(countId);
      const barEl = document.getElementById(barId);
      if (labelEl) {
        labelEl.innerHTML = c === 0 
          ? `<strong class="text-rose-400">0개 (0%) [원국에 없음]</strong>` 
          : `<strong>${c}개</strong> (${p}%)`;
      }
      if (barEl) {
        barEl.style.width = `${p}%`;
      }
    };

    setElementUI("목", "woodCountLabel", "barWood");
    setElementUI("화", "fireCountLabel", "barFire");
    setElementUI("토", "earthCountLabel", "barEarth");
    setElementUI("금", "metalCountLabel", "barMetal");
    setElementUI("수", "waterCountLabel", "barWater");

    document.getElementById("diagStrengthText").textContent = s.strengthStatus;
    document.getElementById("diagPowerSummary").textContent = `사주 원국 8글자 중 내 편(비겁+인성)의 비중이 ${s.myPower}%로, ${s.strengthStatus}의 기운을 보입니다.`;
    document.getElementById("diagYongsinDesc").textContent = s.yongsinDesc;

    // 사주에 없는 오행(0개 결핍) 진단 렌더링
    const missingContainer = document.getElementById("missingElementsContainer");
    if (missingContainer) {
      missingContainer.innerHTML = "";
      if (s.missingElements && s.missingElements.length > 0) {
        s.missingElements.forEach(m => {
          const card = document.createElement("div");
          card.className = "p-3 rounded-xl bg-slate-900/60 border border-rose-500/30 space-y-1 text-xs";
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="font-bold text-rose-300">⚠️ 원국에 없는 오행: ${m.name} (0개)</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">결핍 기운</span>
            </div>
            <p class="text-[11px] text-slate-300">• <strong>특징:</strong> ${m.lack}</p>
            <p class="text-[11px] text-emerald-300">• <strong>개운 처방:</strong> ${m.remedy}</p>
          `;
          missingContainer.appendChild(card);
        });
      } else {
        missingContainer.innerHTML = `
          <div class="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-500/30 col-span-2 text-center text-xs">
            <span class="font-bold text-emerald-300 block mb-0.5">🎉 오행구족(五行具足) 사주</span>
            <p class="text-[11px] text-slate-300">목·화·토·금·수의 5대 기운이 결핍 없이 골고루 존재하여, 삶의 굴곡을 유연하게 넘기는 원만한 사주입니다.</p>
          </div>
        `;
      }
    }

    // 사주에 없는 십신(무재, 무관, 무인성 등) 반전 해설 렌더링
    const missingTenGodsContainer = document.getElementById("missingTenGodsContainer");
    if (missingTenGodsContainer) {
      missingTenGodsContainer.innerHTML = "";
      if (s.missingTenGods && s.missingTenGods.length > 0) {
        s.missingTenGods.forEach(mt => {
          const card = document.createElement("div");
          card.className = "p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-1 text-xs";
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-300">${mt.type} : ${mt.title}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300">특화 잠재력</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">${mt.meaning}</p>
          `;
          missingTenGodsContainer.appendChild(card);
        });
      }
    }

    // 5. 연애 & 궁합 탭
    document.getElementById("loveDnaDesc").textContent = `${s.userInfo.name} 님의 일지는 [${s.pillars.day.ji.element}] 기운을 품고 있어, ${s.iljuDetail.loveStyle}`;
    document.getElementById("loveMatchBest").textContent = `나의 기운을 보듬어주는 [${s.yongsin}] 기운이나 천간합을 이루는 인연과 가장 이상적인 호흡을 이룹니다.`;
    document.getElementById("loveCharmPoint").textContent = `${s.iljuDetail.keywords.join(", ")}의 매력이 상대방의 마음을 깊이 사로잡습니다.`;

    const partnerCard = document.getElementById("partnerResultCard");
    if (this.compatResult && this.partnerSaju) {
      partnerCard.classList.remove("hidden");
      document.getElementById("compatScoreBadge").textContent = `${this.compatResult.score}점`;
      document.getElementById("compatTheme").textContent = this.compatResult.theme;

      const meritsContainer = document.getElementById("compatMerits");
      meritsContainer.innerHTML = "";
      this.compatResult.merits.forEach(m => {
        const p = document.createElement("p");
        p.textContent = `• ${m}`;
        meritsContainer.appendChild(p);
      });

      const advicesContainer = document.getElementById("compatAdvices");
      advicesContainer.innerHTML = "";
      this.compatResult.advices.forEach(a => {
        const p = document.createElement("p");
        p.textContent = `• ${a}`;
        advicesContainer.appendChild(p);
      });
    } else {
      partnerCard.classList.add("hidden");
    }

    // 6. 재물 & 커리어 탭
    document.getElementById("wealthDnaDesc").textContent = `${s.userInfo.name} 님의 사주는 ${s.iljuDetail.wealthStyle}`;
    document.getElementById("wealthStyleDesc").textContent = s.isSinGang 
      ? "추진력과 주체성을 바탕으로 규모 있는 부를 일구는 사업·투자형에 최적화되어 있습니다." 
      : "정밀한 분석과 안정적인 전문 라이선스를 기반으로 실속 있는 알짜배기 자산을 축적합니다.";
    document.getElementById("careerFieldsDesc").textContent = `전문직, 기획, IT 플랫폼, 미디어 및 ${s.yongsin} 오행 관련 특화 산업 분야에서 큰 두각을 나타냅니다.`;
    document.getElementById("wealthTimingDesc").textContent = `대운에서 [${s.yongsin}] 기운이 도래하는 인생 전성기 대운에 막강한 재물과 명예를 거머쥡니다.`;

    if (window.lucide) window.lucide.createIcons();
  },

  // 4주 8자 카드 스타일 및 실제 지장간 출력
  renderPillarsTable(pillars) {
    const setPillarBadge = (ganBadgeId, jiBadgeId, ganObj, jiObj, tenGodGanId, tenGodJiId, tenGodGan, tenGodJi, jijangganId, jiChar) => {
      const gEl = document.getElementById(ganBadgeId);
      const jEl = document.getElementById(jiBadgeId);
      if (gEl && ganObj) {
        gEl.className = `w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-lg sm:text-xl font-bold my-1 ${this.getElementClass(ganObj.element)}`;
        gEl.innerHTML = `<span>${ganObj.hanja}</span><span class="text-[9px] font-sans font-normal opacity-70">${ganObj.char}</span>`;
      }
      if (jEl && jiObj) {
        jEl.className = `w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-lg sm:text-xl font-bold my-1 ${this.getElementClass(jiObj.element)}`;
        jEl.innerHTML = `<span>${jiObj.hanja}</span><span class="text-[9px] font-sans font-normal opacity-70">${jiObj.char}</span>`;
      }
      if (document.getElementById(tenGodGanId)) document.getElementById(tenGodGanId).textContent = tenGodGan || "-";
      if (document.getElementById(tenGodJiId)) document.getElementById(tenGodJiId).textContent = tenGodJi || "-";
      if (document.getElementById(jijangganId) && jiChar) {
        document.getElementById(jijangganId).textContent = `${window.SajuEngine.formatJijanggan(jiChar)}`;
      }
    };

    // 년주
    setPillarBadge("yearGanBadge", "yearJiBadge", pillars.year.gan, pillars.year.ji, "yearTenGodGan", "yearTenGodJi", pillars.year.tenGodGan, pillars.year.tenGodJi, "yearJijanggan", pillars.year.ji.char);
    // 월주
    setPillarBadge("monthGanBadge", "monthJiBadge", pillars.month.gan, pillars.month.ji, "monthTenGodGan", "monthTenGodJi", pillars.month.tenGodGan, pillars.month.tenGodJi, "monthJijanggan", pillars.month.ji.char);
    // 일주
    setPillarBadge("dayGanBadge", "dayJiBadge", pillars.day.gan, pillars.day.ji, null, "dayTenGodJi", "본원(나)", pillars.day.tenGodJi, "dayJijanggan", pillars.day.ji.char);

    // 시주
    const hourCard = document.getElementById("pillarHourCard");
    if (pillars.hour) {
      hourCard.classList.remove("opacity-40");
      setPillarBadge("hourGanBadge", "hourJiBadge", pillars.hour.gan, pillars.hour.ji, "hourTenGodGan", "hourTenGodJi", pillars.hour.tenGodGan, pillars.hour.tenGodJi, "hourJijanggan", pillars.hour.ji.char);
    } else {
      hourCard.classList.add("opacity-40");
      document.getElementById("hourTenGodGan").textContent = "미상";
      document.getElementById("hourGanBadge").innerHTML = `<span class="text-xs">未詳</span>`;
      document.getElementById("hourJiBadge").innerHTML = `<span class="text-xs">未詳</span>`;
      document.getElementById("hourTenGodJi").textContent = "미상";
      document.getElementById("hourJijanggan").textContent = "시간 모름";
    }
  },

  switchResultTab(tabName) {
    this.activeTab = tabName;
    const tabBtns = document.querySelectorAll(".result-tab-btn");
    tabBtns.forEach(btn => {
      btn.className = "result-tab-btn px-3.5 py-2 rounded-lg font-medium whitespace-nowrap modern-chip text-slate-400 hover:text-white";
    });

    const activeBtn = document.getElementById(`tabBtn-${tabName}`);
    if (activeBtn) {
      activeBtn.className = "result-tab-btn px-3.5 py-2 rounded-lg font-medium whitespace-nowrap bg-white/10 text-amber-300 border border-amber-500/30";
    }

    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(p => p.classList.add("hidden"));

    const activePane = document.getElementById(`tabContent-${tabName}`);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 타로
  initTarotCard() {
    const cards = window.TarotData || [];
    const randIdx = Math.floor(Math.random() * cards.length);
    this.currentTarotCard = cards[randIdx];
  },

  flipTarotCard() {
    const inner = document.getElementById("tarotCardInner");
    if (!inner) return;

    if (!inner.classList.contains("flipped")) {
      const card = this.currentTarotCard;
      document.getElementById("tarotCardKrName").textContent = card.nameKr;
      document.getElementById("tarotCardElem").textContent = card.element;
      document.getElementById("tarotCardTheme").textContent = card.theme;
      document.getElementById("tarotCardSummary").textContent = card.summary;
      document.getElementById("tarotGeneralAdv").textContent = card.generalAdvice;
      document.getElementById("tarotLoveAdv").textContent = card.loveAdvice;
      document.getElementById("tarotMoneyAdv").textContent = card.moneyAdvice;

      inner.classList.add("flipped");

      if (window.confetti) {
        window.confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
      }
    }
  },

  shuffleTarotCard() {
    const inner = document.getElementById("tarotCardInner");
    if (inner) {
      inner.classList.remove("flipped");
    }
    setTimeout(() => {
      this.initTarotCard();
    }, 350);
  },

  copyResultText() {
    if (!this.userSaju || !this.dailyFortune) return;
    const s = this.userSaju;
    const f = this.dailyFortune;

    const text = `[천명(天命) 사주 분석 & 오늘의 운세]
• 이름: ${s.userInfo.name} (${s.userInfo.genderKr})
• 생년월일: ${s.userInfo.solarDateString}
• 일주: ${s.iljuDetail.name} (${s.iljuDetail.symbol})
• 사주 체질: ${s.strengthStatus} (용신: ${s.yongsin})
• 없는 오행: ${s.missingElements.length > 0 ? s.missingElements.map(m => m.name).join(", ") : "없음(오행구족)"}
-----------------------------------------
[오늘의 운세 (${f.dateString})]
• 총운 지수: ${f.totalScore}점 (${f.todayTenGod})
• 오늘의 테마: ${f.theme}
• 한 줄 조언: ${f.summary}
• 행운의 아이템: 컬러(${f.lucky.color}), 번호(${f.lucky.numbers}), 방위(${f.lucky.direction})
-----------------------------------------
https://minjae0529-blip.github.io/Daily-Fortune/`;

    navigator.clipboard.writeText(text).then(() => {
      alert("분석 결과 요약이 클립보드에 복사되었습니다!");
    }).catch(() => {
      alert("복사에 실패했습니다.");
    });
  },

  shareLink() {
    if (navigator.share) {
      navigator.share({
        title: "천명(天命) - 정통 사주 만세력 & 오늘의 운세",
        text: "한국천문연구원 역법 기반 고정밀 사주 만세력과 오늘의 운세를 확인해보세요!",
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("웹 서비스 링크가 클립보드에 복사되었습니다!");
      });
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

window.App = App;
