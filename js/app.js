/**
 * Main Application Controller (천명 - 오늘의 운세 & 사주 만세력)
 * UI State, Form Event Handlers, Dynamic Form Expansion, Rendering & Animations
 */

const App = {
  currentMode: "daily", // 'daily', 'saju', 'love'
  activeTab: "daily",
  userSaju: null,
  dailyFortune: null,
  partnerSaju: null,
  compatResult: null,
  currentTarotCard: null,

  init() {
    this.populateDateSelects();
    this.initRealtimeBanner();
    this.setMode("daily");
    this.initTarotCard();

    // Lucide Icons 렌더링
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // 오늘 날짜 및 실시간 일진 배너 초기화
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
      todayDateTitle.textContent = `${dateStr} 오늘의 운세 (${iljin.name}일)`;
    }
  },

  // 날짜 셀렉트 옵션 자동 생성
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

    // Main user
    fillOptions("birthYear", 1930, curYear, 1996, false, "년");
    fillOptions("birthMonth", 1, 12, 5, false, "월");
    fillOptions("birthDay", 1, 31, 15, false, "일");
    fillOptions("birthHour", 0, 23, 12, true, "시");
    fillOptions("birthMinute", 0, 59, 30, true, "분");

    // Partner
    fillOptions("partnerYear", 1930, curYear, 1997, false, "년");
    fillOptions("partnerMonth", 1, 12, 8, false, "월");
    fillOptions("partnerDay", 1, 31, 20, false, "일");
  },

  // 모드 변경 (오늘의 운세 vs 사주 vs 연애/궁합)
  setMode(mode) {
    this.currentMode = mode;
    const modeTabs = {
      daily: document.getElementById("modeBtnDaily"),
      saju: document.getElementById("modeBtnSaju"),
      love: document.getElementById("modeBtnLove")
    };

    // Tab active styles
    Object.keys(modeTabs).forEach(k => {
      const btn = modeTabs[k];
      if (!btn) return;
      if (k === mode) {
        btn.className = "mode-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm";
      } else {
        btn.className = "mode-tab py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 text-slate-400 hover:text-white";
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

  // 12간지 시간 버튼 클릭 시 시/분 자동 세팅
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
    if (hourSelect) hourSelect.disabled = isUnknown;
    if (minuteSelect) minuteSelect.disabled = isUnknown;
  },

  togglePartnerActive(enabled) {
    const fields = document.getElementById("partnerInputFields");
    if (!fields) return;
    if (enabled) {
      fields.classList.remove("opacity-40", "pointer-events-none");
    } else {
      fields.classList.add("opacity-40", "pointer-events-none");
    }
  },

  handleCalendarTypeChange() {
    // 음력/양력 전환 처리
  },

  // 폼 제출 이벤트
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
      // 1. 메인 사용자 사주 연산
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

      // 2. 오늘의 운세 연산
      this.dailyFortune = window.FortuneEngine.calculateDailyFortune(this.userSaju);

      // 3. 파트너 정보가 활성화되어 있으면 궁합 연산
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

      // 4. 화면 전환 및 결과 렌더링
      this.renderResults();
      this.showResultSection();

      // 모드에 따라 기본 활성 탭 전환
      if (this.currentMode === "saju") {
        this.switchResultTab("saju");
      } else if (this.currentMode === "love") {
        this.switchResultTab("love");
      } else {
        this.switchResultTab("daily");
      }

      // 화려한 꽃가루 축하 효과
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#f59e0b", "#8b5cf6", "#10b981"]
        });
      }

    } catch (err) {
      alert("사주 계산 중 오류가 발생했습니다: " + err.message);
      console.error(err);
    }
  },

  // 결과 화면으로 전환
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

  // 오행별 CSS 클래스 매핑
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

    // 점수 등급
    let scoreGrade = "평온(平溫)";
    if (f.totalScore >= 95) scoreGrade = "대대길(大大吉)";
    else if (f.totalScore >= 88) scoreGrade = "대길(大吉)";
    else if (f.totalScore >= 80) scoreGrade = "길(吉)";
    document.getElementById("resScoreGrade").textContent = scoreGrade;

    // SVG 게이지 원형 애니메이션
    const circle = document.getElementById("scoreCirclePath");
    if (circle) {
      const dashVal = Math.round(f.totalScore);
      setTimeout(() => {
        circle.setAttribute("stroke-dasharray", `${dashVal}, 100`);
      }, 100);
    }

    // 2. 오늘의 운세 탭
    document.getElementById("dailyThemeTitle").textContent = f.theme;
    document.getElementById("dailySummaryText").textContent = f.summary;
    document.getElementById("dailyActionText").textContent = f.action;
    document.getElementById("dailyAvoidText").textContent = f.avoid;
    document.getElementById("dailyTenGodBadge").textContent = f.todayTenGod;

    document.getElementById("idxMoneyScore").textContent = `${f.scores.money}%`;
    document.getElementById("barMoney").style.width = `${f.scores.money}%`;
    document.getElementById("idxLoveScore").textContent = `${f.scores.love}%`;
    document.getElementById("barLove").style.width = `${f.scores.love}%`;
    document.getElementById("idxHealthScore").textContent = `${f.scores.health}%`;
    document.getElementById("barHealth").style.width = `${f.scores.health}%`;
    document.getElementById("idxCareerScore").textContent = `${f.scores.career}%`;
    document.getElementById("barCareer").style.width = `${f.scores.career}%`;

    document.getElementById("luckyColor").textContent = f.lucky.color;
    document.getElementById("luckyNumbers").textContent = f.lucky.numbers;
    document.getElementById("luckyDirection").textContent = f.lucky.direction;
    document.getElementById("luckyFood").textContent = f.lucky.food;

    // 시간대별 운세 리듬
    const hourlyContainer = document.getElementById("hourlyContainer");
    hourlyContainer.innerHTML = "";
    f.hourlyFlow.forEach(h => {
      const card = document.createElement("div");
      card.className = "p-3 rounded-xl bg-black/40 border border-white/5";
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="text-slate-400">${h.time}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">${h.status}</span>
        </div>
        <p class="text-[11px] text-slate-300">${h.desc}</p>
      `;
      hourlyContainer.appendChild(card);
    });

    // 3. 정통 사주팔자 만세력 표 렌더링
    this.renderPillarsTable(s.pillars);

    // 일주론
    document.getElementById("iljuTitle").textContent = `${s.iljuDetail.name} : ${s.iljuDetail.symbol}`;
    document.getElementById("iljuDesc").textContent = s.iljuDetail.desc;
    document.getElementById("iljuStrength").textContent = s.iljuDetail.strength;
    document.getElementById("iljuCaution").textContent = s.iljuDetail.caution;
    document.getElementById("iljuLove").textContent = s.iljuDetail.loveStyle;
    document.getElementById("iljuWealth").textContent = s.iljuDetail.wealthStyle;

    // 신살 렌더링
    const sinsalContainer = document.getElementById("sinsalContainer");
    sinsalContainer.innerHTML = "";
    if (s.sinsal && s.sinsal.length > 0) {
      s.sinsal.forEach(item => {
        const div = document.createElement("div");
        div.className = "p-3 rounded-xl bg-black/40 border border-white/5 space-y-1";
        div.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-serif-kr text-xs font-bold text-amber-300">${item.name}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300">${item.type}</span>
          </div>
          <p class="text-[11px] font-medium text-slate-200">${item.summary}</p>
          <p class="text-[10px] text-slate-400">${item.modern}</p>
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
      dCard.className = "p-2.5 rounded-xl bg-black/40 border border-white/5";
      dCard.innerHTML = `
        <div class="text-[10px] text-amber-400 font-semibold mb-1">${d.startAge}~${d.endAge}세</div>
        <div class="font-serif-kr text-base font-bold text-white mb-0.5">${d.ganHanja}${d.jiHanja}</div>
        <div class="text-[10px] text-slate-400">${d.name}</div>
        <div class="text-[9px] text-slate-500 mt-1">${d.tenGod}</div>
      `;
      daeunContainer.appendChild(dCard);
    });

    // 4. 오행 밸런스 탭
    const el = s.elements;
    document.getElementById("pctWood").textContent = `${el["목"]}%`;
    document.getElementById("barWood").style.width = `${el["목"]}%`;
    document.getElementById("pctFire").textContent = `${el["화"]}%`;
    document.getElementById("barFire").style.width = `${el["화"]}%`;
    document.getElementById("pctEarth").textContent = `${el["토"]}%`;
    document.getElementById("barEarth").style.width = `${el["토"]}%`;
    document.getElementById("pctMetal").textContent = `${el["금"]}%`;
    document.getElementById("barMetal").style.width = `${el["금"]}%`;
    document.getElementById("pctWater").textContent = `${el["수"]}%`;
    document.getElementById("barWater").style.width = `${el["수"]}%`;

    document.getElementById("diagStrengthText").textContent = s.strengthStatus;
    document.getElementById("diagPowerSummary").textContent = `내 기운(비겁+인성)의 비중이 ${s.myPower}%로, ${s.strengthStatus}의 특성을 나타냅니다. 주관과 뚝심이 확실하며 자신만의 영역을 구축하는 힘이 있습니다.`;
    document.getElementById("diagYongsinDesc").textContent = s.yongsinDesc;

    // 5. 연애 & 궁합 탭
    document.getElementById("loveDnaDesc").textContent = `${s.userInfo.name} 님은 일지에 [${s.pillars.day.ji.element}] 오행의 기운을 품고 있어, ${s.iljuDetail.loveStyle}`;
    document.getElementById("loveMatchBest").textContent = `나의 기운을 가장 이상적으로 보듬어주는 [${s.yongsin}] 오행이나 천간합을 이루는 인연과 만났을 때 영혼의 안식처를 얻게 됩니다.`;
    document.getElementById("loveCharmPoint").textContent = `내면의 깊은 온기와 진중함, 그리고 상대방을 깊이 배려하는 ${s.iljuDetail.keywords.join(", ")}의 매력이 이성을 사로잡는 강력한 무기입니다.`;

    // 2인 궁합 결과 렌더링
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
    document.getElementById("wealthDnaDesc").textContent = `${s.userInfo.name} 님의 사주는 ${s.iljuDetail.wealthStyle} 자산 관리에 대한 감각이 뛰어나며, ${s.strengthStatus}의 기운을 통해 꾸준한 결실을 거둡니다.`;
    document.getElementById("wealthStyleDesc").textContent = s.isSinGang 
      ? "과감한 추진력과 자기 비즈니스를 통해 규모 있는 부를 일구는 사업·투자형에 최적화되어 있습니다." 
      : "정밀한 분석과 안정적인 전문 라이선스, 확실한 실물 자산을 기반으로 알짜배기 자산을 축적합니다.";
    document.getElementById("careerFieldsDesc").textContent = `기획, 연구개발, 컨설팅, 전문직, IT 플랫폼, 미디어 및 ${s.yongsin} 오행과 관련된 특화 산업 분야에서 두각을 나타냅니다.`;
    document.getElementById("wealthTimingDesc").textContent = `대운에서 [${s.yongsin}] 기운이 도래하는 시기(인생 전성기 대운)에 일생일대의 재물과 사회적 명예를 거머쥐게 됩니다.`;

    if (window.lucide) window.lucide.createIcons();
  },

  // 4주 8자 카드 스타일 적용
  renderPillarsTable(pillars) {
    const setPillarBadge = (ganBadgeId, jiBadgeId, ganObj, jiObj, tenGodGanId, tenGodJiId, tenGodGan, tenGodJi, jijangganId, jiChar) => {
      const gEl = document.getElementById(ganBadgeId);
      const jEl = document.getElementById(jiBadgeId);
      if (gEl && ganObj) {
        gEl.className = `w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-xl sm:text-2xl font-bold border my-1 ${this.getElementClass(ganObj.element)}`;
        gEl.innerHTML = `<span>${ganObj.hanja}</span><span class="text-[10px] font-sans font-normal opacity-75">${ganObj.char}</span>`;
      }
      if (jEl && jiObj) {
        jEl.className = `w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-xl sm:text-2xl font-bold border my-1 ${this.getElementClass(jiObj.element)}`;
        jEl.innerHTML = `<span>${jiObj.hanja}</span><span class="text-[10px] font-sans font-normal opacity-75">${jiObj.char}</span>`;
      }
      if (document.getElementById(tenGodGanId)) document.getElementById(tenGodGanId).textContent = tenGodGan || "-";
      if (document.getElementById(tenGodJiId)) document.getElementById(tenGodJiId).textContent = tenGodJi || "-";
      if (document.getElementById(jijangganId) && jiChar) {
        const jg = window.CalendarEngine.EARTHLY_BRANCHES.find(b => b.char === jiChar);
        document.getElementById(jijangganId).textContent = `지장간: ${jg ? jg.animal : ""}`;
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
      hourCard.classList.remove("opacity-50");
      setPillarBadge("hourGanBadge", "hourJiBadge", pillars.hour.gan, pillars.hour.ji, "hourTenGodGan", "hourTenGodJi", pillars.hour.tenGodGan, pillars.hour.tenGodJi, "hourJijanggan", pillars.hour.ji.char);
    } else {
      hourCard.classList.add("opacity-50");
      document.getElementById("hourTenGodGan").textContent = "미상";
      document.getElementById("hourGanBadge").innerHTML = `<span class="text-sm">未詳</span>`;
      document.getElementById("hourJiBadge").innerHTML = `<span class="text-sm">未詳</span>`;
      document.getElementById("hourTenGodJi").textContent = "미상";
      document.getElementById("hourJijanggan").textContent = "시간 모름";
    }
  },

  // 결과 화면 내 서브 탭 전환
  switchResultTab(tabName) {
    this.activeTab = tabName;
    const tabBtns = document.querySelectorAll(".result-tab-btn");
    tabBtns.forEach(btn => {
      btn.className = "result-tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap glass-card text-slate-300 hover:text-white flex items-center space-x-2";
    });

    const activeBtn = document.getElementById(`tabBtn-${tabName}`);
    if (activeBtn) {
      activeBtn.className = "result-tab-btn px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-2";
    }

    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(p => p.classList.add("hidden"));

    const activePane = document.getElementById(`tabContent-${tabName}`);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // 타로 카드 초기화 및 셔플
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
        window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
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
    }, 400);
  },

  // 결과 복사 기능
  copyResultText() {
    if (!this.userSaju || !this.dailyFortune) return;
    const s = this.userSaju;
    const f = this.dailyFortune;

    const text = `[천명(天命) 사주 & 오늘의 운세 보고서]
• 이름: ${s.userInfo.name} (${s.userInfo.genderKr})
• 생년월일: ${s.userInfo.solarDateString}
• 사주 일주: ${s.iljuDetail.name} (${s.iljuDetail.symbol})
• 사주 체질: ${s.strengthStatus} (용신: ${s.yongsin})
-----------------------------------------
[오늘의 운세 (${f.dateString})]
• 총운 점수: ${f.totalScore}점 (${f.todayTenGod})
• 오늘의 테마: ${f.theme}
• 한 줄 요약: ${f.summary}
• 추천 행동: ${f.action}
• 행운의 아이템: 컬러(${f.lucky.color}), 번호(${f.lucky.numbers}), 방위(${f.lucky.direction})
-----------------------------------------
천명(天命)에서 더 많은 사주 & 타로 풀이를 확인해보세요!`;

    navigator.clipboard.writeText(text).then(() => {
      alert("운세 결과 보고서가 클립보드에 복사되었습니다!");
    }).catch(() => {
      alert("복사에 실패했습니다.");
    });
  },

  // 링크 공유
  shareLink() {
    if (navigator.share) {
      navigator.share({
        title: "천명(天命) - 오늘의 운세 & 정통 사주 만세력",
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

// Start application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

window.App = App;
