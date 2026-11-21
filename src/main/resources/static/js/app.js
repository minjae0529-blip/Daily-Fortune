/**
 * Main Application Controller (천명 - 오늘의 운세 · 사주 · 타로)
 * High-Contrast Comfortable Light Theme (2026 Trend)
 * 12지신 수호동물 상호작용 & KASI 정통 만세력 & 3-Card 대화형 타로 시스템
 */

const ZODIAC_MASCOTS = {
  "자": { animal: "쥐", emoji: "🐭", name: "총명한 햄찌", greeting: "총명한 지혜가 퐁퐁 샘솟는 날이야!", quotes: [
    "너의 기민한 감각을 믿어봐! 오늘은 감이 최고야 🧀",
    "작은 디테일까지 놓치지 않는 너의 영리함이 빛날 거야 ✨",
    "차근차근 실속을 챙기면 큰 부자가 될 수 있어 💰",
    "오늘 너를 괴롭힐 수 있는 건 아무것도 없어! 파이팅 💖",
    "톡 쳐줘서 고마워! 네 곁에서 행운을 솔솔 뿌려줄게 🌸"
  ]},
  "축": { animal: "소", emoji: "🐮", name: "든든한 우직이", greeting: "한 걸음씩 성실하게 나아가면 큰 결실이 와!", quotes: [
    "너의 묵묵한 노력은 절대 배신하지 않아! 🍀",
    "천천히 가도 괜찮아, 넌 반드시 완주할 거니까 🌾",
    "오늘 차곡차곡 쌓은 노력이 곧 황금 열매를 맺을 거야 🍯",
    "힘들 땐 내 든든한 등에 잠깐 기대도 돼 🐮",
    "네가 가진 우직함은 세상에서 가장 단단한 무기야! 힘내자 💪"
  ]},
  "인": { animal: "호랑이", emoji: "🐯", name: "용맹한 아랑이", greeting: "용기와 카리스마를 맘껏 펼쳐봐! 어흥!", quotes: [
    "주저하지 말고 당당하게 전진해! 넌 주인공이야 👑",
    "오늘 너의 열정은 아무도 막을 수 없어! 불꽃 파워 🔥",
    "어려운 일도 너의 기백 앞에서는 눈 녹듯 사라질 거야 ⚡",
    "두려움은 던져버려! 내가 뒤에서 지켜줄게 어흥! 🐾",
    "자신감을 가져! 넌 생각보다 훨씬 더 멋진 사람이야 💖"
  ]},
  "묘": { animal: "토끼", emoji: "🐰", name: "사랑스런 복토끼", greeting: "행운의 깡총 점프! 기분 좋은 소식이 찾아올 거야!", quotes: [
    "사랑스러운 미소 하나로 사람들의 마음을 사로잡아봐 🌸",
    "기분 좋은 행운이 깡총깡총 네 품으로 뛰어들 거야 🥕",
    "오늘 너의 센스와 순발력은 만점이야! 톡톡 튀어봐 ✨",
    "따스한 봄바람처럼 편안하고 행복한 하루 보내길 바라 🍀",
    "나를 터치해줘서 고마워! 너에게 매일매일 행복을 줄게 🐰"
  ]},
  "진": { animal: "용", emoji: "🐲", name: "신비로운 청룡이", greeting: "잠자던 비범한 재능이 하늘로 비상할 타이밍이야!", quotes: [
    "너의 큰 꿈과 비전은 반드시 현실이 될 거야! 🌈",
    "남들과 다른 너의 비범함을 자랑스럽게 여겨봐 ⚡",
    "오늘 너의 한 걸음은 기적을 만드는 씨앗이야 🌱",
    "구름 위를 나는 용처럼 시야를 넓게 가져봐 ☁️",
    "하늘의 기운이 온통 널 응원하고 있어! 비상해봐 🐲✨"
  ]},
  "사": { animal: "뱀", emoji: "🐍", name: "지혜로운 꼬마뱀", greeting: "날카로운 통찰력으로 기회를 단번에 낚아채!", quotes: [
    "이면을 꿰뚫어 보는 너의 직관은 언제나 정확해 🔮",
    "우아하고 침착하게 상황을 주도해 나가봐 💎",
    "허황된 말보다 차분한 실속을 챙길 때 큰 이득이 와 🌿",
    "스스로를 믿어봐, 넌 이미 해답을 알고 있잖아 🗝️",
    "너의 은은한 매력에 다들 매료될 거야! 멋진 하루 보내 🐍"
  ]},
  "오": { animal: "말", emoji: "🐴", name: "자유로운 페가수스", greeting: "신나게 달려보자! 오늘은 막힘없이 술술 풀려!", quotes: [
    "넓은 들판을 달리듯 시원하게 마음먹고 도전해봐 🐎",
    "너의 밝고 건강한 에너지가 주변 사람들도 밝혀줘 ☀️",
    "답답했던 매듭이 단숨에 풀리는 날이야! 달려가보자 💨",
    "망설이지 마! 속도를 내면 기회가 너를 따라잡아 🌟",
    "히히힝! 오늘 하루도 온 힘을 다해 너를 응원할게 🐴💖"
  ]},
  "미": { animal: "양", emoji: "🐑", name: "포근한 솜이", greeting: "따스한 온기와 힐링이 너를 포근히 감싸줄 거야!", quotes: [
    "오늘 너 자신에게 따뜻한 칭찬 한마디 건네줘 ☁️",
    "평화롭고 고요한 시간 속에서 진짜 지혜가 싹터 ☕",
    "너의 다정함은 주변을 치유하는 특별한 마법이야 🌸",
    "지친 마음은 내 푹신한 털에 기대어 쉬어가렴 🐑",
    "모든 일이 부드럽고 순조롭게 풀릴 거야, 걱정 마 💖"
  ]},
  "신": { animal: "원숭이", emoji: "🐵", name: "재치만점 몽이", greeting: "아이디어가 팡팡! 센스 넘치게 다 해결할 수 있어!", quotes: [
    "너의 유쾌한 재치로 어떤 난관도 가볍게 넘겨봐 💡",
    "창의적인 영감이 번뜩이는 날이야! 메모해둬 🍌",
    "사람들과 유쾌하게 웃을 때 큰 행운의 복이 굴러와 🎈",
    "똑똑하고 민첩한 너는 뭐든 금방 배워서 해내잖아 👏",
    "우끼끼! 너랑 함께라서 나도 너무 신나! 파이팅 🐵✨"
  ]},
  "유": { animal: "닭", emoji: "🐔", name: "새벽별 꼬꼬", greeting: "행운의 새벽 기상! 너의 매력이 가장 빛나는 때야!", quotes: [
    "단정하고 세련된 너의 품격이 모두의 부러움을 사 👑",
    "흐트러짐 없는 결단력으로 최고의 결실을 맺어봐 💎",
    "남들이 보지 못한 작은 보석을 네가 찾아낼 거야 🔍",
    "약속과 신의를 지키는 너의 태도가 큰 기회를 불러와 📜",
    "꼬끼오! 눈부신 아침 햇살처럼 찬란한 하루가 될 거야 🐔☀️"
  ]},
  "술": { animal: "개", emoji: "🐶", name: "충직한 댕댕이", greeting: "믿음직한 너의 곁에 최고의 인연과 동료가 찾아와!", quotes: [
    "너의 한결같은 진심은 누구에게나 감동을 줘 🐾",
    "의리와 신뢰로 맺은 관계가 평생의 든든한 자산이야 🤝",
    "혼자가 아니야, 언제나 널 믿고 응원하는 내가 있잖아 🐶",
    "오늘 꼬리를 살랑이며 반가운 행운의 손님이 찾아올 거야 🎁",
    "멍멍! 넌 세상에서 제일 착하고 멋진 사람이야 💖"
  ]},
  "해": { animal: "돼지", emoji: "🐷", name: "복덩이 꿀꿀이", greeting: "재물복과 먹을 복이 가득! 편안하고 넉넉한 하루야!", quotes: [
    "오늘 맛있는 음식 먹고 행복 충전 100% 해보자 🍯",
    "너의 너그러운 마음씨가 큰 복덕을 자석처럼 끌어당겨 💰",
    "여유를 가져봐, 억지로 애쓰지 않아도 저절로 풀려 🍀",
    "네가 가는 곳마다 풍요와 웃음꽃이 피어날 거야 🌸",
    "꿀꿀! 복주머니를 활짝 열어둘게, 복 듬뿍 받아가 🐷💖"
  ]}
};

const App = {
  currentMode: "daily", // 'daily', 'saju', 'tarot'
  activeTab: "daily",
  userSaju: null,
  dailyFortune: null,
  partnerSaju: null,
  compatResult: null,

  // 3-Card 타로 시스템 상태
  tarotCategory: "love", // 'love', 'career', 'money', 'mind'
  tarotDeckCards: [], // 펼쳐진 12장의 카드
  tarotPickedCards: [], // 사용자가 선택한 3장 [{ deckIdx, card }]

  // 12지신 수호동물 상태
  currentMascot: null,
  mascotQuoteIdx: 0,
  isBlessingOpen: false,

  // 유료화 (500원 사주 간편결제 - 토스/카카오/네이버페이) 상태
  isPremiumUnlocked: false,
  selectedPayMethod: "TOSS_PAY",
  lastSavedSajuId: null,
  lastReceipt: null,

  // 회원가입 · 보안 로그인 · SMS 휴면해제 상태
  currentAccount: null,
  latestDemoSmsCode: null,
  latestSmsLoginId: null,

  init() {
    this.populateDateSelects();
    this.initRealtimeBanner();
    this.initTarotDeck();
    this.setMode("daily");
    this.checkAuthSession();

    // 초기 수호동물 설정
    this.currentMascot = ZODIAC_MASCOTS["진"] || Object.values(ZODIAC_MASCOTS)[0];

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  // ==========================================================================
  // 🛡️ 회원가입 · 보안 로그인 (5회 오류 SMS 발송 / 10회 오류 휴면화 / SQL 인젝션 방어)
  // ==========================================================================
  hasClientSqlInjection(str) {
    if (!str) return false;
    const pattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|SLEEP)\b)|(--|\/\*|\*\/|;)|('.*\b(OR|AND)\b.*=)|(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i;
    return pattern.test(str);
  },

  async checkAuthSession() {
    try {
      const res = await fetch("/api/auth/me");
      const result = await res.json();
      if (result && result.success && result.data && result.data.authenticated) {
        this.enterAuthenticatedService(result.data);
      } else {
        this.showAuthGateScreen();
      }
    } catch (e) {
      this.showAuthGateScreen();
    }
  },

  showAuthGateScreen() {
    this.currentAccount = null;
    const authSec = document.getElementById("authSection");
    const inputSec = document.getElementById("inputSection");
    const resultSec = document.getElementById("resultSection");
    const userBox = document.getElementById("headerUserBox");
    const vaultBtn = document.getElementById("headerVaultBtn");
    const adminBtn = document.getElementById("headerAdminBtn");
    const headerAiBtn = document.getElementById("headerAiChatBtn");
    const aiFabBox = document.getElementById("aiChatbotFloatingContainer");
    const aiDrawer = document.getElementById("aiChatbotDrawer");

    if (authSec) authSec.classList.remove("hidden");
    if (inputSec) inputSec.classList.add("hidden");
    if (resultSec) resultSec.classList.add("hidden");
    if (userBox) {
      userBox.classList.add("hidden");
      userBox.classList.remove("flex");
    }
    if (adminBtn) {
      adminBtn.classList.add("hidden");
      adminBtn.classList.remove("flex");
    }
    if (vaultBtn) {
      vaultBtn.classList.add("hidden");
      vaultBtn.classList.remove("flex");
    }
    // 로그인 전에는 AI 도사 챗봇 버튼 및 드로어를 전면 숨김
    if (headerAiBtn) {
      headerAiBtn.classList.add("hidden");
      headerAiBtn.classList.remove("flex");
    }
    if (aiFabBox) {
      aiFabBox.classList.add("hidden");
      aiFabBox.classList.remove("flex");
    }
    if (aiDrawer) {
      this.isAiChatOpen = false;
      aiDrawer.classList.add("hidden", "hidden-drawer");
    }
  },

  enterAuthenticatedService(accountData) {
    this.currentAccount = accountData;
    const authSec = document.getElementById("authSection");
    const inputSec = document.getElementById("inputSection");
    const resultSec = document.getElementById("resultSection");
    const userBox = document.getElementById("headerUserBox");
    const userNameText = document.getElementById("headerUserNameText");
    const vaultBtn = document.getElementById("headerVaultBtn");
    const adminBtn = document.getElementById("headerAdminBtn");
    const headerAiBtn = document.getElementById("headerAiChatBtn");
    const aiFabBox = document.getElementById("aiChatbotFloatingContainer");
    const aiDrawer = document.getElementById("aiChatbotDrawer");

    if (authSec) authSec.classList.add("hidden");
    if (resultSec) resultSec.classList.add("hidden");
    if (inputSec) inputSec.classList.remove("hidden");

    if (userBox) {
      userBox.classList.remove("hidden");
      userBox.classList.add("flex");
    }

    const isAdmin = accountData.role === "ROLE_ADMIN";
    if (adminBtn) {
      if (isAdmin) {
        adminBtn.classList.remove("hidden");
        adminBtn.classList.add("flex");
      } else {
        adminBtn.classList.add("hidden");
        adminBtn.classList.remove("flex");
      }
    }

    if (userNameText) {
      if (isAdmin) {
        userNameText.innerHTML = `👑 <span class="text-[#facc15] font-black">${accountData.name}</span> <span class="text-[10px] text-[#fef08a] bg-[#713f12] px-1.5 py-0.5 rounded border border-[#eab308] font-bold">최고관리자</span>`;
      } else {
        userNameText.textContent = `👤 ${accountData.name}(${accountData.loginId}) 님`;
      }
    }
    if (vaultBtn) {
      vaultBtn.classList.remove("hidden");
      vaultBtn.classList.add("flex");
    }
    // 로그인 완료 시에만 AI 도사 챗봇 런처 버튼 및 드로어 활성화
    if (headerAiBtn) {
      headerAiBtn.classList.remove("hidden");
      headerAiBtn.classList.add("flex");
    }
    if (aiFabBox) {
      aiFabBox.classList.remove("hidden");
      aiFabBox.classList.add("flex");
    }
    if (aiDrawer) {
      aiDrawer.classList.remove("hidden");
    }
    this.updateAiContextStatus();

    const userNameInput = document.getElementById("userName");
    if (userNameInput && accountData.name) {
      userNameInput.value = accountData.name;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  async logoutAccount() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    this.showAuthGateScreen();
    this.switchAuthTab("login");
    this.showAuthAlert("info", "로그아웃되었습니다. 다시 로그인해주세요.");
  },

  switchAuthTab(tabName, keepAlert = false) {
    const tabs = ["login", "signup", "unlock"];
    const titles = {
      login: "회원 로그인 (號牌 認證)",
      signup: "신규 회원가입 (名簿 登錄)",
      unlock: "휴대폰 SMS 인증 휴면·잠금 해제"
    };

    const activeCls = "py-2.5 px-2 rounded-md font-bold bg-[#231710] text-[#f7d88c] shadow-sm border border-[#b48a4e] transition";
    const inactiveCls = "py-2.5 px-2 rounded-md font-semibold text-[#36281c] hover:text-black transition";

    tabs.forEach(t => {
      const btn = document.getElementById(`authTabBtn-${t}`);
      const pane = document.getElementById(`${t}FormPane`);
      if (btn) btn.className = (t === tabName) ? activeCls : inactiveCls;
      if (pane) {
        if (t === tabName) pane.classList.remove("hidden");
        else pane.classList.add("hidden");
      }
    });

    const cardTitle = document.getElementById("authCardTitle");
    if (cardTitle) cardTitle.textContent = titles[tabName] || titles.login;

    if (!keepAlert) {
      const alertBox = document.getElementById("authAlertBox");
      if (alertBox) alertBox.classList.add("hidden");
    }
  },

  showAuthAlert(type, message) {
    const box = document.getElementById("authAlertBox");
    if (!box) return;
    box.classList.remove("hidden");

    if (type === "success") {
      box.className = "p-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-50 text-emerald-950 text-xs font-bold leading-relaxed";
    } else if (type === "dormant") {
      box.className = "p-3.5 rounded-xl border-2 border-rose-600 bg-rose-950 text-amber-200 text-xs font-extrabold leading-relaxed shadow-md";
    } else if (type === "warning") {
      box.className = "p-3.5 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-950 text-xs font-bold leading-relaxed";
    } else {
      box.className = "p-3.5 rounded-xl border-2 border-rose-400 bg-rose-50 text-rose-950 text-xs font-bold leading-relaxed";
    }
    box.textContent = message;
  },

  showSmsBanner(maskedPhone, message, code, loginId) {
    this.latestDemoSmsCode = code;
    this.latestSmsLoginId = loginId;

    const banner = document.getElementById("smsNotificationBanner");
    const phoneEl = document.getElementById("smsPhoneTargetText");
    const bodyEl = document.getElementById("smsMessageBodyText");
    const codeEl = document.getElementById("smsCodeHighlight");

    if (banner) banner.classList.remove("hidden");
    if (phoneEl) phoneEl.textContent = `수신번호: ${maskedPhone || "010-****-****"}`;
    if (bodyEl) bodyEl.textContent = message || "";
    if (codeEl) codeEl.textContent = code || "------";
  },

  applyDemoSmsCodeToUnlock() {
    this.switchAuthTab("unlock", true);
    const unlockId = document.getElementById("unlockIdInput");
    const unlockCode = document.getElementById("unlockCodeInput");
    if (unlockId && this.latestSmsLoginId) unlockId.value = this.latestSmsLoginId;
    if (unlockCode && this.latestDemoSmsCode) unlockCode.value = this.latestDemoSmsCode;
    this.showAuthAlert("warning", "인증번호가 자동 입력되었습니다. 가입 시 등록한 휴대폰 번호를 입력하고 [SMS 인증번호 확인 및 계정 휴면·오류 초기화] 버튼을 눌러주세요.");
  },

  fillAdminCredentials() {
    this.switchAuthTab("login");
    const idInput = document.getElementById("loginIdInput");
    const pwInput = document.getElementById("loginPwInput");
    if (idInput) idInput.value = "admin";
    if (pwInput) pwInput.value = "admin1234!";
    this.showAuthAlert("warning", "👑 최고관리자(admin) 계정 정보가 입력되었습니다. [천명 만세력 로그인] 버튼을 누르세요.");
  },

  async checkDuplicateLoginId() {
    const idInput = document.getElementById("signupIdInput");
    const msgEl = document.getElementById("signupIdCheckMsg");
    const loginId = idInput ? idInput.value.trim() : "";

    if (this.hasClientSqlInjection(loginId)) {
      this.showAuthAlert("error", "🚨 [SQL 인젝션 차단] 아이디에 허용되지 않는 SQL 예약어 또는 특수기호가 포함되어 있습니다.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/check-id?loginId=${encodeURIComponent(loginId)}`);
      const result = await res.json();
      if (result.success) {
        if (msgEl) {
          msgEl.textContent = "✅ " + result.message;
          msgEl.className = "text-[11px] text-emerald-700 mt-1 font-extrabold";
        }
        this.showAuthAlert("success", "✅ " + result.message);
      } else {
        if (msgEl) {
          msgEl.textContent = "⚠️ " + result.message;
          msgEl.className = "text-[11px] text-rose-700 mt-1 font-extrabold";
        }
        this.showAuthAlert("error", "⚠️ " + result.message);
      }
    } catch (e) {
      this.showAuthAlert("error", "중복 확인 중 서버 통신 오류가 발생했습니다.");
    }
  },

  async handleSignupSubmit(e) {
    e.preventDefault();
    const loginId = document.getElementById("signupIdInput").value.trim();
    const password = document.getElementById("signupPwInput").value;
    const passwordConfirm = document.getElementById("signupPwConfirmInput").value;
    const name = document.getElementById("signupNameInput").value.trim();
    const phoneNumber = document.getElementById("signupPhoneInput").value.trim();

    if (this.hasClientSqlInjection(loginId) || this.hasClientSqlInjection(name) || this.hasClientSqlInjection(phoneNumber)) {
      this.showAuthAlert("error", "🚨 [SQL 인젝션 방어] 입력값에 SQL 공격 의심 구문(SELECT, DROP, OR 1=1, --, ; 등)이 감지되어 차단되었습니다.");
      return;
    }

    if (password !== passwordConfirm) {
      this.showAuthAlert("error", "⚠️ 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password, name, phoneNumber, gender: "M", birthYear: 1996, birthMonth: 5, birthDay: 15 })
      });
      const result = await res.json();
      if (result.success && result.data) {
        this.enterAuthenticatedService(result.data);
      } else {
        this.showAuthAlert("error", result.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      this.showAuthAlert("error", "회원가입 처리 중 오류가 발생했습니다.");
    }
  },

  async handleLoginSubmit(e) {
    e.preventDefault();
    const loginId = document.getElementById("loginIdInput").value.trim();
    const password = document.getElementById("loginPwInput").value;

    if (this.hasClientSqlInjection(loginId) || this.hasClientSqlInjection(password)) {
      this.showAuthAlert("error", "🚨 [SQL 인젝션 방어] 로그인 입력값에 SQL 인젝션 공격 시그니처가 감지되어 즉시 차단되었습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password })
      });
      const result = await res.json();
      const status = result.data;

      // 로그인 성공
      if (result.success && status && status.authenticated) {
        const banner = document.getElementById("smsNotificationBanner");
        if (banner) banner.classList.add("hidden");
        this.enterAuthenticatedService(status);
        return;
      }

      // 로그인 실패 시 횟수 및 단계별 처리
      if (status) {
        const attempts = status.failedAttempts || 0;
        const badge = document.getElementById("loginAttemptCounterBadge");
        if (badge) {
          badge.textContent = `오류 횟수: ${attempts}회 (5회 문자발송 / 10회 계정휴면)`;
        }

        // 5회 이상 실패 또는 10회 휴면화 시 휴대폰 SMS 문자 도착 시뮬레이션 배너 표출
        if (status.smsSent && status.demoSmsCode) {
          this.showSmsBanner(status.maskedPhone, status.smsPreviewMessage, status.demoSmsCode, status.loginId || loginId);
        }

        // 10회 이상 실패로 계정이 휴면화된 경우 -> 휴면 해제 탭으로 자동 전환
        if (status.accountStatus === "DORMANT_LOCKED" || attempts >= 10) {
          const unlockId = document.getElementById("unlockIdInput");
          if (unlockId) unlockId.value = status.loginId || loginId;
          this.switchAuthTab("unlock", true);
          this.showAuthAlert("dormant", result.message);
          return;
        }

        // 5~9회 실패 (휴대폰 문자 발송 + 경고)
        if (attempts >= 5) {
          this.showAuthAlert("error", result.message);
          return;
        }
      }

      // 1~4회 실패 (5회 미만 경고)
      this.showAuthAlert("warning", result.message || "아이디 또는 비밀번호가 일치하지 않습니다.");
    } catch (err) {
      this.showAuthAlert("error", "로그인 서버 통신 중 오류가 발생했습니다.");
    }
  },

  async requestUnlockSmsCode() {
    const loginId = document.getElementById("unlockIdInput").value.trim();
    const phoneNumber = document.getElementById("unlockPhoneInput").value.trim();

    if (!loginId || !phoneNumber) {
      this.showAuthAlert("warning", "휴면 해제할 아이디와 가입 시 등록한 휴대폰 번호를 모두 입력해주세요.");
      return;
    }

    if (this.hasClientSqlInjection(loginId) || this.hasClientSqlInjection(phoneNumber)) {
      this.showAuthAlert("error", "🚨 [SQL 인젝션 방어] 허용되지 않는 문자열이 감지되었습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, phoneNumber })
      });
      const result = await res.json();
      if (result.success && result.data) {
        this.showSmsBanner(result.data.maskedPhone, result.data.smsPreviewMessage, result.data.demoSmsCode, loginId);
        this.showAuthAlert("success", result.message + " 상단 SMS 도착 알림에서 인증번호를 확인하세요.");
      } else {
        this.showAuthAlert("error", result.message || "인증번호 발송에 실패했습니다.");
      }
    } catch (e) {
      this.showAuthAlert("error", "SMS 발송 요청 중 오류가 발생했습니다.");
    }
  },

  async handleSmsUnlockSubmit(e) {
    e.preventDefault();
    const loginId = document.getElementById("unlockIdInput").value.trim();
    const phoneNumber = document.getElementById("unlockPhoneInput").value.trim();
    const verificationCode = document.getElementById("unlockCodeInput").value.trim();
    const newPassword = document.getElementById("unlockNewPwInput").value;

    if (this.hasClientSqlInjection(loginId) || this.hasClientSqlInjection(phoneNumber) || this.hasClientSqlInjection(verificationCode)) {
      this.showAuthAlert("error", "🚨 [SQL 인젝션 방어] 허용되지 않는 문자열이 감지되었습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/sms/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, phoneNumber, verificationCode, newPassword })
      });
      const result = await res.json();
      if (result.success) {
        const banner = document.getElementById("smsNotificationBanner");
        if (banner) banner.classList.add("hidden");
        const badge = document.getElementById("loginAttemptCounterBadge");
        if (badge) badge.textContent = "오류 횟수: 0 / 5회 (초기화 완료)";
        const loginIdEl = document.getElementById("loginIdInput");
        if (loginIdEl) loginIdEl.value = loginId;
        this.switchAuthTab("login", true);
        this.showAuthAlert("success", result.message);
      } else {
        this.showAuthAlert("error", result.message || "인증번호 검증에 실패했습니다.");
      }
    } catch (err) {
      this.showAuthAlert("error", "휴면 해제 처리 중 오류가 발생했습니다.");
    }
  },

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

  populateDateSelects() {
    const curYear = new Date().getFullYear();
    const fillOptions = (elemId, start, end, selectedVal, padZero = false, suffix = "") => {
      const select = document.getElementById(elemId);
      if (!select) return;
      select.innerHTML = "";
      for (let i = start; i <= end; i++) {
        const opt = document.createElement("option");
        const val = padZero && i < 10 ? `0${i}` : `${i}`;
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

  // 3대 서비스 모드 변경 (오늘의 운세 / 사주 / 타로)
  setMode(mode) {
    this.currentMode = mode;
    const btnDaily = document.getElementById("modeBtnDaily");
    const btnSaju = document.getElementById("modeBtnSaju");
    const btnTarot = document.getElementById("modeBtnTarot");

    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const sajuFormCard = document.getElementById("sajuFormCard");
    const tarotStandAloneCard = document.getElementById("tarotStandAloneCard");
    const advFields = document.getElementById("advancedSajuFields");
    const partnerFields = document.getElementById("partnerSection");
    const submitBtnText = document.getElementById("submitBtnText");
    const formBadgeText = document.getElementById("formBadgeText");
    const formTitleText = document.getElementById("formTitleText");

    const activeBtnClass = "py-3 px-2 rounded-md text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-1.5 bg-[#231710] text-[#f7d88c] shadow-md border border-[#b48a4e]";
    const inactiveBtnClass = "py-3 px-2 rounded-md text-xs sm:text-sm font-semibold transition flex items-center justify-center space-x-1.5 text-[#36281c] hover:text-black";

    if (btnDaily) btnDaily.className = (mode === "daily") ? activeBtnClass : inactiveBtnClass;
    if (btnSaju) btnSaju.className = (mode === "saju") ? activeBtnClass : inactiveBtnClass;
    if (btnTarot) btnTarot.className = (mode === "tarot") ? activeBtnClass : inactiveBtnClass;

    if (mode === "tarot") {
      // 🃏 타로 전용 뷰 활성화
      if (sajuFormCard) sajuFormCard.classList.add("hidden");
      if (tarotStandAloneCard) tarotStandAloneCard.classList.remove("hidden");
      if (heroTitle) heroTitle.textContent = "마음을 비추는 3-Card 타로";
      if (heroSubtitle) heroSubtitle.textContent = "질문 주제를 선택하고, 펼쳐진 카드 중 3장을 직접 골라 과거·현재·미래의 현실적 조언을 확인하세요.";
      this.resetTarotSpread();
    } else if (mode === "daily") {
      // ☀️ 오늘의 운세 뷰 활성화
      if (sajuFormCard) sajuFormCard.classList.remove("hidden");
      if (tarotStandAloneCard) tarotStandAloneCard.classList.add("hidden");
      if (advFields) advFields.classList.add("hidden");
      if (partnerFields) partnerFields.classList.remove("expanded");
      if (heroTitle) heroTitle.textContent = "하늘의 기운과 오늘의 천기(天氣)";
      if (heroSubtitle) heroSubtitle.textContent = "오늘 하루의 일진(日辰) 바이오리듬과 시간대별 길흉, 행운의 색상과 방위를 짚어드립니다.";
      if (formBadgeText) formBadgeText.textContent = "☀️ 오늘의 운세 모드 (무료 FREE)";
      if (formTitleText) formTitleText.textContent = "오늘의 운세를 위한 생년월일시(四柱) 입력";
      if (submitBtnText) submitBtnText.textContent = "오늘의 일진 & 운세 무료 풀이 보기 ☀️";
    } else {
      // 📜 정통 사주 뷰 활성화 (연애운·앞으로 나아갈 방향·대운 포함)
      if (sajuFormCard) sajuFormCard.classList.remove("hidden");
      if (tarotStandAloneCard) tarotStandAloneCard.classList.add("hidden");
      if (advFields) advFields.classList.remove("hidden");
      if (partnerFields) partnerFields.classList.add("expanded");
      if (heroTitle) heroTitle.textContent = "정통 만세력 사주팔자(四柱八字)";
      if (heroSubtitle) heroSubtitle.textContent = "KASI 정본 역법으로 사주 4주 8자(무료 프리뷰)와 60갑자 일주론·신살·대운·재물 심층 리포트(500원)를 분석합니다.";
      if (formBadgeText) formBadgeText.textContent = "📜 정통 사주팔자 모드 (원국 무료 · 심층 500원)";
      if (formTitleText) formTitleText.textContent = "사주 원국 도출을 위한 생년월일시(四柱) 입력";
      if (submitBtnText) submitBtnText.textContent = "사주 4주 8자 원국 & 심층 리포트 조회하기 📜";
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

  handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim() || "당신";
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const calendarTypeRadio = document.querySelector('input[name="calendarType"]:checked').value;
    const isLeap = calendarTypeRadio === "lunar_leap";
    const calendarType = calendarTypeRadio.startsWith("lunar") ? "lunar" : "solar";

    const birthYear = parseInt(document.getElementById("birthYear").value, 10);
    const birthMonth = parseInt(document.getElementById("birthMonth").value, 10);
    const birthDay = parseInt(document.getElementById("birthDay").value, 10);

    const isUnknownHour = document.getElementById("unknownHour").checked;
    const birthHour = isUnknownHour ? null : parseInt(document.getElementById("birthHour").value, 10);
    const birthMinute = isUnknownHour ? null : parseInt(document.getElementById("birthMinute").value, 10);

    const adjust30Min = document.getElementById("adjust30Min").checked;
    const dayBoundary = document.getElementById("dayBoundarySelect").value;

    const userInput = {
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
      adjust30Min,
      dayBoundary
    };

    // 사주 원국 계산
    const sajuCalcFn = window.SajuEngine.calculatePillars || window.SajuEngine.calculateSaju;
    this.userSaju = sajuCalcFn.call(window.SajuEngine, userInput);

    // 오늘의 운세 계산
    this.dailyFortune = window.FortuneEngine.calculateDailyFortune(this.userSaju, new Date());

    // 궁합 분석 (선택 시)
    const enablePartner = document.getElementById("enablePartner").checked;
    if (enablePartner) {
      const pName = document.getElementById("partnerName").value.trim() || "상대방";
      const pGender = document.getElementById("partnerGender").value;
      const pYear = parseInt(document.getElementById("partnerYear").value, 10);
      const pMonth = parseInt(document.getElementById("partnerMonth").value, 10);
      const pDay = parseInt(document.getElementById("partnerDay").value, 10);

      this.partnerSaju = sajuCalcFn.call(window.SajuEngine, {
        name: pName,
        gender: pGender,
        calendarType: "solar",
        isLeap: false,
        birthYear: pYear,
        birthMonth: pMonth,
        birthDay: pDay,
        birthHour: 12,
        birthMinute: 0,
        isUnknownHour: true,
        adjust30Min: true,
        dayBoundary: "splitJasi"
      });

      this.compatResult = window.FortuneEngine.calculateCompatibility(this.userSaju, this.partnerSaju);
    } else {
      this.partnerSaju = null;
      this.compatResult = null;
    }

    // 결과 데이터 미리 계산 및 렌더링 준비
    this.renderResults();

    // [유료 게이트키핑] 정통 사주팔자(500원) 모드일 때는 결제를 완료해야만 결과 화면으로 넘어감!
    if (this.currentMode === "saju") {
      this.openPaymentModal("TOSS_PAY");
      return;
    }

    // [무료 모드] 오늘의 운세는 결제 없이 즉시 DB 저장 및 결과 화면으로 전환
    this.saveToDatabase();
    document.getElementById("inputSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.switchResultTab("daily");

    setTimeout(() => {
      this.interactMascot();
    }, 450);
  },

  async saveToDatabase() {
    try {
      if (!this.userSaju) return;
      const s = this.userSaju;
      const f = this.dailyFortune;

      const sajuPayload = {
        name: s.userInfo.name || "사용자",
        gender: (s.userInfo.gender === "female" || s.userInfo.gender === "F") ? "F" : "M",
        birthType: s.userInfo.calendarType ? s.userInfo.calendarType.toUpperCase() : "SOLAR",
        birthYear: s.userInfo.birthYear,
        birthMonth: s.userInfo.birthMonth,
        birthDay: s.userInfo.birthDay,
        birthHour: s.userInfo.birthHour,
        birthMinute: s.userInfo.birthMinute,
        isTimeUnknown: Boolean(s.userInfo.isUnknownHour),
        timeCorrectionApplied: s.userInfo.adjust30Min !== false,
        yearCheongan: s.pillars.year.gan.char,
        yearJiji: s.pillars.year.ji.char,
        monthCheongan: s.pillars.month.gan.char,
        monthJiji: s.pillars.month.ji.char,
        dayCheongan: s.pillars.day.gan.char,
        dayJiji: s.pillars.day.ji.char,
        timeCheongan: s.pillars.time ? s.pillars.time.gan.char : null,
        timeJiji: s.pillars.time ? s.pillars.time.ji.char : null,
        dayMaster: s.pillars.day.gan.char,
        iljuName: s.iljuDetail ? s.iljuDetail.name : `${s.pillars.day.gan.char}${s.pillars.day.ji.char}`,
        zodiacAnimal: s.iljuDetail ? s.iljuDetail.symbol : "수호동물",
        iljuDescription: s.iljuDetail ? (s.iljuDetail.summary || s.iljuDetail.desc || "") : "",
        woodRatio: s.elements ? (s.elements["목"] || 0) : 0,
        fireRatio: s.elements ? (s.elements["화"] || 0) : 0,
        earthRatio: s.elements ? (s.elements["토"] || 0) : 0,
        metalRatio: s.elements ? (s.elements["금"] || 0) : 0,
        waterRatio: s.elements ? (s.elements["수"] || 0) : 0,
        dominantElement: s.dominantElement || "-",
        deficientElement: s.deficientElement || "-",
        strengthStatus: s.strengthStatus || "중화",
        yongsin: s.yongsin || "-",
        analysisText: s.elementAnalysis || "",
        sinsals: (s.sinsals || []).map(sin => ({
          pillarType: sin.pillar || "GENERAL",
          sinsalName: sin.name,
          sinsalType: sin.type || "NEUTRAL",
          description: sin.description || ""
        }))
      };

      const res = await fetch("/api/saju/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sajuPayload)
      });
      const result = await res.json();
      if (result.success) {
        this.lastSavedSajuId = result.data;
        console.log("💾 [천명 DB] 사주 정보가 MySQL에 성공적으로 저장되었습니다 (ID: " + result.data + ")");
      }

      if (f) {
        const fortunePayload = {
          name: s.userInfo.name || "사용자",
          gender: (s.userInfo.gender === "female" || s.userInfo.gender === "F") ? "F" : "M",
          birthYear: s.userInfo.birthYear,
          birthMonth: s.userInfo.birthMonth,
          birthDay: s.userInfo.birthDay,
          fortuneDate: new Date().toISOString().split("T")[0],
          todayGapja: f.todayGapja || "-",
          totalScore: f.totalScore || 75,
          wealthScore: f.wealthScore || 75,
          loveScore: f.loveScore || 75,
          careerScore: f.careerScore || 75,
          healthScore: f.healthScore || 75,
          luckyColor: (f.lucky && f.lucky.color) || "골드",
          luckyNumber: (f.lucky && f.lucky.numbers) || "7",
          luckyDirection: (f.lucky && f.lucky.direction) || "동쪽",
          overallAdvice: f.summary || "오늘 하루도 긍정적인 마음으로 나아가세요."
        };
        await fetch("/api/fortune/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fortunePayload)
        });
      }

      if (this.compatResult && this.partnerSaju) {
        const p = this.partnerSaju;
        const c = this.compatResult;
        const compatPayload = {
          user1Name: s.userInfo.name || "본인",
          user1Gender: (s.userInfo.gender === "female" || s.userInfo.gender === "F") ? "F" : "M",
          user1BirthYear: s.userInfo.birthYear,
          user1BirthMonth: s.userInfo.birthMonth,
          user1BirthDay: s.userInfo.birthDay,
          user2Name: p.userInfo.name || "상대방",
          user2Gender: (p.userInfo.gender === "female" || p.userInfo.gender === "F") ? "F" : "M",
          user2BirthYear: p.userInfo.birthYear,
          user2BirthMonth: p.userInfo.birthMonth,
          user2BirthDay: p.userInfo.birthDay,
          score: c.totalScore || 85,
          grade: c.grade || "천생연분",
          cheonganHarmony: c.cheonganDesc || "",
          jijiHarmony: c.jijiDesc || "",
          relationshipAdvice: c.advice || ""
        };
        await fetch("/api/compatibility/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compatPayload)
        });
      }
    } catch (err) {
      console.warn("MySQL DB 비동기 저장 알림: 백엔드 서버 상태 확인 필요", err);
    }
  },

  resetToHome() {
    if (!this.currentAccount) {
      this.showAuthGateScreen();
      return;
    }
    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("inputSection").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

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

  renderResults() {
    const s = this.userSaju;
    const f = this.dailyFortune;

    // 0. 마스코트 파트너
    const dayJiChar = s.pillars.day.ji.char;
    const yearJiChar = s.pillars.year.ji.char;
    const mascot = ZODIAC_MASCOTS[dayJiChar] || ZODIAC_MASCOTS[yearJiChar] || ZODIAC_MASCOTS["자"];
    this.currentMascot = mascot;
    this.mascotQuoteIdx = 0;

    const mascotEmoji = document.getElementById("mascotEmoji");
    const mascotNameTag = document.getElementById("mascotNameTag");
    const mascotQuote = document.getElementById("mascotQuote");
    if (mascotEmoji) mascotEmoji.textContent = mascot.emoji;
    if (mascotNameTag) mascotNameTag.textContent = `수호동물 ${mascot.name} ${mascot.emoji}`;
    if (mascotQuote) {
      mascotQuote.textContent = `"${s.userInfo.name}님, ${mascot.greeting} 오늘 하루도 내가 든든하게 지켜줄게! 💖"`;
    }

    // 1. 프로필 요약 카드
    document.getElementById("resUserName").textContent = s.userInfo.name;
    document.getElementById("resSolarDate").textContent = s.userInfo.solarDateString;
    document.getElementById("resLunarDate").textContent = s.userInfo.lunarDate ? `${s.userInfo.lunarDate.year}년 ${s.userInfo.lunarDate.month}월 ${s.userInfo.lunarDate.day}일` : "-";
    document.getElementById("resGender").textContent = s.userInfo.genderKr;
    document.getElementById("resHourDesc").textContent = s.userInfo.isUnknownHour ? "시간 모름" : `${s.userInfo.birthHour}시 ${s.userInfo.birthMinute}분`;

    document.getElementById("resIljuAnimalSymbol").textContent = s.iljuDetail.symbol;
    document.getElementById("resStrengthBadge").textContent = s.strengthStatus;

    // 오늘의 운세 점수
    document.getElementById("resTotalScore").textContent = f.totalScore;
    let scoreGrade = "평온(平溫)";
    if (f.totalScore >= 95) scoreGrade = "대대길(大大吉)";
    else if (f.totalScore >= 88) scoreGrade = "대길(大吉)";
    else if (f.totalScore >= 80) scoreGrade = "길(吉)";
    document.getElementById("resScoreGrade").textContent = scoreGrade;

    // "내 사주가 좋은 이유 3가지"
    const blessingContainer = document.getElementById("blessingContainer");
    if (blessingContainer) {
      blessingContainer.innerHTML = "";
      s.blessingPoints.forEach((b, idx) => {
        const bCard = document.createElement("div");
        bCard.className = `p-4 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-1.5 animate-slide-up`;
        bCard.style.animationDelay = `${idx * 120}ms`;
        bCard.innerHTML = `
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-400 text-[10px] font-extrabold">${b.badge}</span>
            <span class="text-slate-500 font-mono text-[10px] font-bold">POINT ${b.step}</span>
          </div>
          <h5 class="text-xs font-extrabold text-slate-900 font-serif-kr">${b.title}</h5>
          <p class="text-xs text-slate-700 font-medium leading-relaxed">${b.desc}</p>
        `;
        blessingContainer.appendChild(bCard);
      });
    }

    // 🔮 모드별 카테고리 완전 분리 & 헤더 뱃지 스위칭
    const reportTitle = document.getElementById("resReportTitle");
    const blessingBtnContainer = document.getElementById("blessingBtnContainer");
    const blessingSection = document.getElementById("blessingSection");
    const resultNavTabs = document.getElementById("resultNavTabs");
    const dailyScoreBox = document.getElementById("resDailyScoreBox");
    const sajuDestinyBox = document.getElementById("resSajuDestinyBox");

    if (this.currentMode === "daily") {
      // [오늘의 운세 모드]: 운세 점수 뱃지만 노출, 사주 관련 탭/뱃지 일체 격리
      if (reportTitle) reportTitle.textContent = "님의 오늘의 운세 보고서";
      if (dailyScoreBox) dailyScoreBox.classList.remove("hidden");
      if (sajuDestinyBox) sajuDestinyBox.classList.add("hidden");
      if (blessingBtnContainer) blessingBtnContainer.classList.add("hidden");
      if (blessingSection) blessingSection.classList.remove("expanded");
      if (resultNavTabs) resultNavTabs.classList.add("hidden");

      // 탭 패널도 오늘의 운세 탭만 활성화
      const panes = document.querySelectorAll(".tab-pane");
      panes.forEach(p => p.classList.add("hidden"));
      const dailyPane = document.getElementById("tabContent-daily");
      if (dailyPane) dailyPane.classList.remove("hidden");
    } else {
      // [정통 사주 모드]: 사주 체질 및 용신 뱃지 노출, 운세 점수 숨김, 사주 네비게이션 탭 노출
      if (reportTitle) reportTitle.textContent = "님의 정통 사주명식 & 미래 로드맵 보고서";
      if (dailyScoreBox) dailyScoreBox.classList.add("hidden");
      if (sajuDestinyBox) sajuDestinyBox.classList.remove("hidden");

      const destinyGrade = document.getElementById("resSajuDestinyGrade");
      const yongsinBadge = document.getElementById("resSajuYongsinBadge");
      if (destinyGrade) destinyGrade.textContent = s.strengthStatus;
      if (yongsinBadge) yongsinBadge.textContent = s.yongsin;

      if (blessingBtnContainer) blessingBtnContainer.classList.remove("hidden");
      if (resultNavTabs) {
        resultNavTabs.classList.remove("hidden");
        const tabBtnDaily = document.getElementById("tabBtn-daily");
        if (tabBtnDaily) tabBtnDaily.classList.add("hidden");
        const tabBtnSaju = document.getElementById("tabBtn-saju");
        if (tabBtnSaju) tabBtnSaju.classList.remove("hidden");
        const tabBtnFuture = document.getElementById("tabBtn-future");
        if (tabBtnFuture) tabBtnFuture.classList.remove("hidden");
      }

      // 사주 전용 앞으로 나아갈 방향 렌더링
      this.renderFutureRoadmap(s);
    }

    // 2. 오늘의 운세 내용 채우기
    document.getElementById("dailyThemeTitle").textContent = f.theme;
    document.getElementById("dailySummaryText").textContent = f.summary;
    document.getElementById("dailyActionText").textContent = f.action;
    document.getElementById("dailyAvoidText").textContent = f.avoid;
    document.getElementById("dailyTenGodBadge").textContent = f.todayTenGod;

    document.getElementById("idxMoneyScore").textContent = `${f.scores.money}%`;
    document.getElementById("idxLoveScore").textContent = `${f.scores.love}%`;
    document.getElementById("idxHealthScore").textContent = `${f.scores.health}%`;
    document.getElementById("idxCareerScore").textContent = `${f.scores.career}%`;

    // 12운성 및 합·충 신호등 렌더링
    const tsBadge = document.getElementById("dailyTwelveStageBadge");
    const tsDesc = document.getElementById("dailyTwelveStageDesc");
    if (f.twelveStage && tsBadge && tsDesc) {
      tsBadge.textContent = `${f.twelveStage.name}(${f.twelveStage.hanja}) · ${f.twelveStage.badge} (${f.twelveStage.power}점)`;
      tsDesc.textContent = f.twelveStage.desc;
    }

    const hcList = document.getElementById("dailyHapChungList");
    if (hcList && f.hapChungSignals) {
      hcList.innerHTML = "";
      f.hapChungSignals.forEach(sig => {
        const badgeCls = sig.type === "HAP"
          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
          : sig.type === "CHUNG"
            ? "bg-rose-100 text-rose-900 border-rose-300"
            : "bg-slate-100 text-slate-800 border-slate-300";
        const row = document.createElement("div");
        row.className = "flex items-start space-x-1.5 text-xs";
        row.innerHTML = `
          <span class="px-2 py-0.5 rounded-md border text-[10px] font-black shrink-0 ${badgeCls}">${sig.label}</span>
          <span class="text-stone-800 font-medium leading-snug">${sig.desc}</span>
        `;
        hcList.appendChild(row);
      });
    }

    // 유료 사주 500원 잠금 초기화 (결제 전 잠금 상태 적용)
    this.applyPaywallState(false, null);
    this.updateAiContextStatus();

    document.getElementById("luckyColor").textContent = f.lucky.color;
    document.getElementById("luckyNumbers").textContent = f.lucky.numbers;
    document.getElementById("luckyDirection").textContent = f.lucky.direction;
    document.getElementById("luckyFood").textContent = f.lucky.food;

    const hourlyContainer = document.getElementById("hourlyContainer");
    hourlyContainer.innerHTML = "";
    f.hourlyFlow.forEach(h => {
      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-slate-50 border border-slate-300 flex flex-col justify-between space-y-2 overflow-hidden shadow-sm";
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs flex-wrap gap-1">
          <span class="text-slate-900 font-extrabold text-xs">${h.time}</span>
          <div class="flex items-center space-x-1 shrink-0">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-900 border border-indigo-200">${h.tenGodBadge || '기운'}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${h.statusBadgeClass || 'bg-amber-100 text-amber-900'}">${h.status}</span>
          </div>
        </div>
        <p class="text-xs text-slate-700 font-medium leading-relaxed" style="word-break: keep-all; overflow-wrap: break-word;">${h.desc}</p>
      `;
      hourlyContainer.appendChild(card);
    });

    // 3. 정통 사주명식 & 💖 연애운 통합 렌더링
    this.renderPillarsTable(s.pillars);

    // 사주 안의 연애운 렌더링
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

    document.getElementById("iljuTitle").textContent = `${s.iljuDetail.name} (${s.iljuDetail.symbol})`;
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
        div.className = "p-3 rounded-2xl bg-slate-50 border border-slate-300 space-y-1";
        div.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-xs font-extrabold text-slate-900 font-serif-kr">${item.name}</span>
            <span class="text-[11px] font-bold text-slate-600">${item.type}</span>
          </div>
          <div class="text-xs text-indigo-700 font-bold">위치: ${item.position || "사주 원국"}</div>
          <p class="text-xs text-slate-700 font-medium">${item.modern}</p>
        `;
        sinsalContainer.appendChild(div);
      });
    } else {
      sinsalContainer.innerHTML = `<p class="text-xs text-slate-600 font-medium col-span-2">사주의 균형이 온화하여 특수한 흉살이 없으며 평탄한 복록을 누립니다.</p>`;
    }

    // 대운 렌더링
    document.getElementById("daeunMeta").textContent = `대운수: ${s.daeunNumber}세 (${s.isForward ? "순행" : "역행"})`;
    const daeunContainer = document.getElementById("daeunContainer");
    daeunContainer.innerHTML = "";
    s.daeunList.forEach(d => {
      const dCard = document.createElement("div");
      dCard.className = "p-2 rounded-2xl bg-slate-50 border border-slate-300 text-center";
      dCard.innerHTML = `
        <div class="text-[10px] text-amber-900 font-extrabold">${d.startAge}~${d.endAge}세</div>
        <div class="font-serif-kr text-sm font-extrabold text-slate-900 my-0.5">${d.ganHanja}${d.jiHanja}</div>
        <div class="text-[10px] text-slate-700 font-bold">${d.name}</div>
        <div class="text-[9px] text-slate-500 font-medium">${d.tenGod}</div>
      `;
      daeunContainer.appendChild(dCard);
    });

    // 4. 오행 밸런스
    const counts = s.elementCounts;
    const pcts = s.elementPercentages;

    const setElementUI = (key, countId, barId) => {
      const c = counts[key] || 0;
      const p = pcts[key] || 0;
      const labelEl = document.getElementById(countId);
      const barEl = document.getElementById(barId);
      if (labelEl) {
        labelEl.textContent = `${c}개 (${p}%)`;
      }
      if (barEl) {
        setTimeout(() => {
          barEl.style.width = `${Math.min(100, p * 1.5)}%`;
        }, 100);
      }
    };

    setElementUI("목", "woodCountLabel", "barWood");
    setElementUI("화", "fireCountLabel", "barFire");
    setElementUI("토", "earthCountLabel", "barEarth");
    setElementUI("금", "metalCountLabel", "barMetal");
    setElementUI("수", "waterCountLabel", "barWater");

    document.getElementById("diagStrengthText").textContent = `${s.strengthStatus} (신약·신강 지수: ${s.strengthScore}점)`;
    document.getElementById("diagPowerSummary").textContent = s.isSinGang
      ? "일간(자신)을 생조하는 비겁과 인성의 힘이 왕성하여 주체성이 매우 강하고 독립심과 추진력이 뛰어난 체질입니다."
      : "식상, 재성, 관성의 설기(洩氣)가 많아 섬세하고 기민하며, 타인과의 조화와 환경 적응력이 뛰어난 체질입니다.";
    document.getElementById("diagYongsinDesc").textContent = `사주의 과열되거나 부족한 기운을 다스려주는 가장 소중한 수호 글자는 [${s.yongsin}] 기운입니다. 삶에서 이 기운을 가까이할 때 가장 큰 행운과 도약이 찾아옵니다.`;

    const missingContainer = document.getElementById("missingElementsContainer");
    if (missingContainer) {
      missingContainer.innerHTML = "";
      if (s.missingElements && s.missingElements.length > 0) {
        s.missingElements.forEach(m => {
          const card = document.createElement("div");
          card.className = "p-3 rounded-2xl bg-rose-50 border border-rose-300 space-y-1 text-xs";
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-rose-950">⚠️ 원국에 없는 오행: ${m.name} (0개)</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold">결핍 기운</span>
            </div>
            <p class="text-xs text-slate-800 font-medium">• <strong>특징:</strong> ${m.lack}</p>
            <p class="text-xs text-emerald-900 font-bold">• <strong>개운 처방:</strong> ${m.remedy}</p>
          `;
          missingContainer.appendChild(card);
        });
      } else {
        missingContainer.innerHTML = `
          <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 col-span-2 text-center text-xs">
            <span class="font-extrabold text-emerald-950 block mb-0.5">🎉 오행구족(五行具足) 사주</span>
            <p class="text-xs text-slate-700 font-medium">목·화·토·금·수의 5대 기운이 결핍 없이 골고루 존재하여, 삶의 굴곡을 유연하게 넘기는 원만한 사주입니다.</p>
          </div>
        `;
      }
    }

    const missingTenGodsContainer = document.getElementById("missingTenGodsContainer");
    if (missingTenGodsContainer) {
      missingTenGodsContainer.innerHTML = "";
      if (s.missingTenGods && s.missingTenGods.length > 0) {
        s.missingTenGods.forEach(mt => {
          const card = document.createElement("div");
          card.className = "p-3 rounded-2xl bg-amber-50 border border-amber-300 space-y-1 text-xs";
          card.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-amber-950">${mt.type} : ${mt.title}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold">특화 잠재력</span>
            </div>
            <p class="text-xs text-slate-800 font-medium leading-relaxed">${mt.meaning}</p>
          `;
          missingTenGodsContainer.appendChild(card);
        });
      }
    }

    // 5. 재물 & 커리어
    document.getElementById("wealthDnaDesc").textContent = `${s.userInfo.name} 님의 사주는 ${s.iljuDetail.wealthStyle}`;
    document.getElementById("wealthStyleDesc").textContent = s.isSinGang 
      ? "추진력과 주체성을 바탕으로 규모 있는 부를 일구는 사업·투자형에 최적화되어 있습니다." 
      : "정밀한 분석과 안정적인 전문 라이선스를 기반으로 실속 있는 알짜배기 자산을 축적합니다.";
    document.getElementById("careerFieldsDesc").textContent = `전문직, 기획, IT 플랫폼, 미디어 및 ${s.yongsin} 오행 관련 특화 산업 분야에서 큰 두각을 나타냅니다.`;
    document.getElementById("wealthTimingDesc").textContent = `대운에서 [${s.yongsin}] 기운이 도래하는 인생 전성기 대운에 막강한 재물과 명예를 거머쥡니다.`;

    if (window.lucide) window.lucide.createIcons();
  },

  // 🧭 사주 전용: 앞으로 나아갈 방향 & 미래 전략 렌더링
  renderFutureRoadmap(s) {
    const yongsin = s.yongsin || "목";
    const ilju = s.iljuDetail || { name: "갑자", symbol: "푸른 쥐", strength: "", caution: "" };

    const yongsinFields = {
      "목": {
        field: "🌱 목(木) 기운: 기획·콘텐츠 크리에이티브, 교육·인재 육성, 바이오·친환경",
        direction: `본원은 [${ilju.name}]으로, 창조적 성장과 확장을 돕는 [목(木)] 기운이 가장 강력한 용신(用神)입니다. 새로운 씨앗을 뿌리고 아이디어를 구체화하는 기획, 교육, 브랜딩, 창작 분야에서 잠재력이 극대화됩니다. 남의 방식을 모방하기보다 자신만의 오리지널 철학을 세울 때 인생의 커다란 도약이 시작됩니다.`,
        action: `매일 아침 새로운 지식을 습득하는 루틴을 만들고, 중장기적 성장 로드맵을 시각화하여 한 걸음씩 실행하세요.`
      },
      "화": {
        field: "🔥 화(火) 기운: IT 미디어·엔터테인먼트, 마케팅·홍보, 디자인·예술 혁신",
        direction: `본원은 [${ilju.name}]으로, 열정과 표현력을 폭발시키는 [화(火)] 기운이 핵심 용신입니다. 대중 앞에서 매력을 발산하거나 플랫폼, 영상, 디자인, 마케팅처럼 사람들의 시선을 사로잡는 무대에서 독보적인 성공을 거둘 수 있습니다. 스스로를 세상에 당당하게 드러내세요.`,
        action: `소극적인 태도를 벗어나 적극적으로 네트워크를 넓히고, 직관적인 결과물을 세상에 과감히 발표하세요.`
      },
      "토": {
        field: "⛰️ 토(土) 기운: 부동산·자산 관리, 플랫폼 중개, 컨설팅, 조직 경영",
        direction: `본원은 [${ilju.name}]으로, 신뢰와 포용력을 상징하는 [토(土)] 기운이 핵심 용신입니다. 사람과 사람, 자본과 정보를 연결하는 중개 및 플랫폼 비즈니스, 자산 운용에서 탁월한 수완을 발휘합니다. 묵직하고 흔들리지 않는 신용이 최고의 재산입니다.`,
        action: `단기 시세 차익보다는 10년을 바라보는 든든한 실물 자산과 신뢰 기반의 협력 파트너십을 구축하세요.`
      },
      "금": {
        field: "⚔️ 금(金) 기운: 금융·투자 분석, 법률·행정, 정밀 테크·엔지니어링, 전문 라이선스",
        direction: `본원은 [${ilju.name}]으로, 냉철한 결단과 시스템 완성을 뜻하는 [금(金)] 기운이 핵심 용신입니다. 복잡한 문제를 명확하게 규격화하고 마무리 짓는 금융, 법률, 데이터, 엔지니어링 등 전문 기술 분야에서 압도적인 전문성을 확보할 수 있습니다.`,
        action: `원칙과 프로세스를 명확히 세우고, 불필요한 인간관계와 낭비 요소를 과감히 정리하는 단호함을 유지하세요.`
      },
      "수": {
        field: "💧 수(水) 기운: 글로벌 무역·유통, 심리·데이터 분석, 전략 기획, 자유 전문직",
        direction: `본원은 [${ilju.name}]으로, 깊은 지혜와 유연한 흐름을 뜻하는 [수(水)] 기운이 핵심 용신입니다. 경계를 뛰어넘는 글로벌 비즈니스, 전략 기획, 인간 심리 분석 및 자유로운 지식 창업에서 물처럼 막힘없이 큰 부와 명예를 축적합니다.`,
        action: `고정관념에 갇히지 말고 상황에 유연하게 대처하며, 깊은 사색과 독서를 통해 통찰력을 날카롭게 벼리세요.`
      }
    };

    const info = yongsinFields[yongsin] || yongsinFields["목"];

    const fieldEl = document.getElementById("futureFieldText");
    const dirEl = document.getElementById("futureDirectionDesc");
    const actEl = document.getElementById("futureActionText");

    if (fieldEl) fieldEl.textContent = info.field;
    if (dirEl) dirEl.textContent = info.direction;
    if (actEl) actEl.textContent = info.action;

    // 대운으로 보는 3대 도약 타이밍
    const milesEl = document.getElementById("futureMilestonesContainer");
    if (milesEl) {
      milesEl.innerHTML = "";
      const daeun = s.daeunList || [];
      const selectedDaeun = daeun.slice(1, 4).length === 3 ? daeun.slice(1, 4) : daeun.slice(0, 3);
      const phases = [
        { label: "1차 도약기 (기반 구축)", badge: "도약기" },
        { label: "2차 전환기 (인생 최대 황금기)", badge: "황금기" },
        { label: "3차 수확기 (결실과 완성)", badge: "수확기" }
      ];

      selectedDaeun.forEach((d, idx) => {
        const ph = phases[idx] || { label: "주요 대운 변곡점", badge: "변곡점" };
        const card = document.createElement("div");
        card.className = "p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 text-xs";
        card.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold">${ph.badge}</span>
            <span class="font-extrabold text-indigo-900">${d.startAge}~${d.endAge}세</span>
          </div>
          <h5 class="font-serif-kr text-xs font-black text-slate-900">${d.name} (${d.ganHanja}${d.jiHanja}) 대운</h5>
          <p class="text-[11px] text-slate-700 font-medium">십신: <strong>${d.tenGod}</strong> 흐름 속에서 ${idx === 1 ? "인생 최고의 역량 발휘와 재정적 확장" : (idx === 0 ? "전문성 연마와 핵심 발판 마련" : "장기적 안정과 명예로운 결실")}이 성취됩니다.</p>
        `;
        milesEl.appendChild(card);
      });
    }

    // 피해야 할 함정과 방패 전략
    const trapTitleEl = document.getElementById("futureTrapTitle");
    const trapDescEl = document.getElementById("futureTrapDesc");
    const cautionText = ilju.caution || "무리한 감정적 결정이나 성급함을 경계하세요.";
    if (trapTitleEl) trapTitleEl.textContent = "⚠️ 인생에서 반드시 경계해야 할 핵심 함정";
    if (trapDescEl) {
      trapDescEl.textContent = `당신의 성향상 "${cautionText}"라는 취약점이 있습니다. 특히 대운의 교차기나 감정이 격해졌을 때 성급하게 직장을 옮기거나 큰돈을 베팅하는 것을 피해야 합니다. 중요한 결정 앞에서는 최소 3일간의 숙려 기간을 두는 '냉철한 방패 전략'을 반드시 지키세요.`;
    }

    // 미래 개운(開運) 일상 가이드
    const remedyColorMap = {
      "목": "초록색·청색 계열 패션 / 동쪽(東) 방위 책상 배치 / 실내 반려식물",
      "화": "붉은색·주황색·와인 포인트 / 남쪽(南) 방위 / 밝은 조명 인테리어",
      "토": "황토색·베이지·브라운 / 중앙 및 남서 방위 / 도자기 및 흙 화분",
      "금": "화이트·실버·골드 메탈 / 서쪽(西) 방위 / 깔끔한 미니멀리즘 소품",
      "수": "블랙·네이비·딥블루 / 북쪽(北) 방위 / 충분한 수분 섭취와 수족관"
    };

    const remedyHabitMap = {
      "목": "아침 10분 산책과 독서, 하루 목표를 손글씨로 적는 기록 습관",
      "화": "자신감 넘치는 스피치 연습과 운동을 통한 땀 배출 루틴",
      "토": "일정한 기상 시간 유지와 흔들리지 않는 감정 일기 작성",
      "금": "매주 불필요한 물건과 모바일 앱을 정리하는 디톡스 습관",
      "수": "잠들기 전 15분 명상과 클래식 음악 감상, 깊은 사색"
    };

    const remedyPersonMap = {
      "목": "나의 비전에 긍정적인 자극을 주고 용기를 북돋아주는 성장 지향형 멘토",
      "화": "열정적이고 솔직하며 유쾌한 에너지를 전파해주는 리더형 인연",
      "토": "입이 무겁고 믿음직하며 어떤 상황에서도 든든하게 받쳐주는 조력자",
      "금": "냉철한 피드백으로 군더더기를 걷어내주는 원칙주의자 전문가",
      "수": "폭넓은 식견과 유연성으로 다양한 관점의 해답을 열어주는 지혜로운 참모"
    };

    const colorEl = document.getElementById("futureRemedyColor");
    const habitEl = document.getElementById("futureRemedyHabit");
    const personEl = document.getElementById("futureRemedyPerson");

    if (colorEl) colorEl.textContent = remedyColorMap[yongsin] || remedyColorMap["목"];
    if (habitEl) habitEl.textContent = remedyHabitMap[yongsin] || remedyHabitMap["목"];
    if (personEl) personEl.textContent = remedyPersonMap[yongsin] || remedyPersonMap["목"];
  },

  renderPillarsTable(pillars) {
    const setPillarBadge = (ganBadgeId, jiBadgeId, ganObj, jiObj, tenGodGanId, tenGodJiId, tenGodGan, tenGodJi, jijangganId, jiChar) => {
      const gEl = document.getElementById(ganBadgeId);
      const jEl = document.getElementById(jiBadgeId);
      if (gEl && ganObj) {
        gEl.className = `w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-lg sm:text-xl font-black my-1 shadow-sm ${this.getElementClass(ganObj.element)}`;
        gEl.innerHTML = `<span>${ganObj.hanja}</span><span class="text-[10px] font-sans font-bold opacity-80">${ganObj.char}</span>`;
      }
      if (jEl && jiObj) {
        jEl.className = `w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl flex flex-col items-center justify-center font-serif-kr text-lg sm:text-xl font-black my-1 shadow-sm ${this.getElementClass(jiObj.element)}`;
        jEl.innerHTML = `<span>${jiObj.hanja}</span><span class="text-[10px] font-sans font-bold opacity-80">${jiObj.char}</span>`;
      }
      if (document.getElementById(tenGodGanId)) document.getElementById(tenGodGanId).textContent = tenGodGan || "-";
      if (document.getElementById(tenGodJiId)) document.getElementById(tenGodJiId).textContent = tenGodJi || "-";
      if (document.getElementById(jijangganId) && jiChar) {
        document.getElementById(jijangganId).textContent = `${window.SajuEngine.formatJijanggan(jiChar)}`;
      }
    };

    // 년주, 월주, 일주
    setPillarBadge("yearGanBadge", "yearJiBadge", pillars.year.gan, pillars.year.ji, "yearTenGodGan", "yearTenGodJi", pillars.year.tenGodGan, pillars.year.tenGodJi, "yearJijanggan", pillars.year.ji.char);
    setPillarBadge("monthGanBadge", "monthJiBadge", pillars.month.gan, pillars.month.ji, "monthTenGodGan", "monthTenGodJi", pillars.month.tenGodGan, pillars.month.tenGodJi, "monthJijanggan", pillars.month.ji.char);
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

  getElementClass(elem) {
    switch (elem) {
      case "목": return "element-wood";
      case "화": return "element-fire";
      case "토": return "element-earth";
      case "금": return "element-metal";
      case "수": return "element-water";
      default: return "";
    }
  },

  switchResultTab(tabName) {
    // 사주 심층 탭(미래 전략 / 오행 밸런스 / 재물 커리어)은 500원 결제 전 클릭 시 결제 모달 호출
    if ((tabName === "future" || tabName === "element" || tabName === "wealth") && !this.isPremiumUnlocked) {
      this.openPaymentModal("TOSS_PAY");
      return;
    }

    this.activeTab = tabName;
    const tabBtns = document.querySelectorAll(".result-tab-btn");
    tabBtns.forEach(btn => {
      btn.className = "result-tab-btn tab-btn px-3.5 py-2 rounded-xl font-bold whitespace-nowrap modern-chip text-slate-800 hover:text-black";
    });

    const activeBtn = document.getElementById(`tabBtn-${tabName}`);
    if (activeBtn) {
      activeBtn.className = "result-tab-btn tab-btn px-3.5 py-2 rounded-xl font-bold whitespace-nowrap active-tab bg-slate-900 text-white";
    }

    const panes = document.querySelectorAll(".tab-pane");
    panes.forEach(p => p.classList.add("hidden"));

    const activePane = document.getElementById(`tabContent-${tabName}`);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // ==========================================================================
  // 💳 500원 유료 사주 간편결제 (토스페이 · 카카오페이 · 네이버페이) & MySQL 보관함
  // ==========================================================================
  goToPaidSajuFromDaily() {
    // 결제를 완료해야만 사주팔자 화면으로 넘어가도록 먼저 결제 모달을 호출
    this.openPaymentModal("TOSS_PAY");
  },

  applyPaywallState(unlocked, receipt) {
    this.isPremiumUnlocked = Boolean(unlocked);
    this.lastReceipt = receipt || null;

    const container = document.getElementById("sajuPaywallContainer");
    const overlay = document.getElementById("sajuPaywallOverlay");
    const banner = document.getElementById("sajuPaidReceiptBanner");
    const meta = document.getElementById("sajuPaidReceiptMeta");

    if (container) {
      if (this.isPremiumUnlocked) {
        container.classList.add("paywall-unlocked");
      } else {
        container.classList.remove("paywall-unlocked");
      }
    }

    if (overlay) {
      if (this.isPremiumUnlocked) {
        overlay.classList.add("hidden");
      } else {
        overlay.classList.remove("hidden");
      }
    }

    if (banner) {
      if (this.isPremiumUnlocked) {
        banner.classList.remove("hidden");
        if (meta && receipt) {
          meta.textContent = `결제수단: ${receipt.paymentMethodKr || "간편결제"} · 결제금액: ${receipt.amount || 500}원 · 주문번호: ${receipt.merchantUid || "-"}`;
        }
      } else {
        banner.classList.add("hidden");
      }
    }
  },

  openPaymentModal(defaultMethod = "TOSS_PAY") {
    const dialog = document.getElementById("paymentDialog");
    if (!dialog) return;

    const targetUserEl = document.getElementById("payModalTargetUser");
    if (targetUserEl && this.userSaju) {
      targetUserEl.textContent = `${this.userSaju.userInfo.name} 님 (${this.userSaju.userInfo.solarDateString})`;
    }

    this.cancelFinalConfirmStep();
    this.selectPaymentMethod(defaultMethod);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  },

  closePaymentModal() {
    const dialog = document.getElementById("paymentDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  },

  selectPaymentMethod(method) {
    this.selectedPayMethod = method;
    const methods = [
      { key: "TOSS_PAY", nameKr: "토스페이", activeBorder: "border-2 border-[#0064FF] bg-blue-50/70", activeText: "text-[#0064FF]", btnBg: "bg-[#0064FF] text-white" },
      { key: "KAKAO_PAY", nameKr: "카카오페이", activeBorder: "border-2 border-yellow-400 bg-yellow-50/80", activeText: "text-amber-900", btnBg: "bg-[#FEE500] text-[#191919]" },
      { key: "NAVER_PAY", nameKr: "네이버페이", activeBorder: "border-2 border-[#03C75A] bg-emerald-50/70", activeText: "text-[#03C75A]", btnBg: "bg-[#03C75A] text-white" }
    ];

    methods.forEach(m => {
      const btn = document.getElementById(`payMethodBtn-${m.key}`);
      const chk = document.getElementById(`payCheck-${m.key}`);
      if (!btn || !chk) return;

      if (m.key === method) {
        btn.className = `w-full p-3 rounded-2xl ${m.activeBorder} flex items-center justify-between transition text-left shadow-xs`;
        chk.className = `text-xs font-black ${m.activeText}`;
        chk.textContent = "● 선택됨";

        const submitBtn = document.getElementById("confirmPaySubmitBtn");
        const submitTxt = document.getElementById("confirmPayBtnText");
        if (submitBtn) {
          submitBtn.className = `w-full py-3.5 rounded-2xl font-black text-sm ${m.btnBg} hover:opacity-95 transition shadow-lg flex items-center justify-center space-x-2`;
        }
        if (submitTxt) {
          submitTxt.textContent = `${m.nameKr}로 500원 결제하고 결과 화면으로 이동`;
        }
        const qEl = document.getElementById("payFinalConfirmQuestion");
        if (qEl) {
          qEl.textContent = `선택하신 [${m.nameKr}]로 500원을 결제하시겠습니까?`;
        }
      } else {
        btn.className = "w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between transition text-left";
        chk.className = "text-xs font-bold text-slate-400";
        chk.textContent = "○ 선택";
      }
    });
  },

  executePaymentCheckout() {
    const methodKr = this.selectedPayMethod === "KAKAO_PAY"
      ? "카카오페이"
      : this.selectedPayMethod === "NAVER_PAY"
        ? "네이버페이"
        : "토스페이";
    const qEl = document.getElementById("payFinalConfirmQuestion");
    if (qEl) {
      qEl.textContent = `선택하신 [${methodKr}]로 500원을 결제하시겠습니까?`;
    }
    const confirmBox = document.getElementById("payFinalConfirmBox");
    const initGroup = document.getElementById("payInitialBtnGroup");
    if (confirmBox) confirmBox.classList.remove("hidden");
    if (initGroup) initGroup.classList.add("hidden");
  },

  cancelFinalConfirmStep() {
    const confirmBox = document.getElementById("payFinalConfirmBox");
    const initGroup = document.getElementById("payInitialBtnGroup");
    if (confirmBox) confirmBox.classList.add("hidden");
    if (initGroup) initGroup.classList.remove("hidden");
  },

  async approveFinalPayment() {
    const approveBtn = document.getElementById("realCheckoutApproveBtn");
    if (approveBtn) {
      approveBtn.disabled = true;
      approveBtn.textContent = "승인 처리 중...";
    }

    try {
      const s = this.userSaju;
      const payload = {
        name: s ? s.userInfo.name : "홍길동",
        gender: (s && (s.userInfo.gender === "female" || s.userInfo.gender === "F")) ? "F" : "M",
        birthYear: s ? s.userInfo.birthYear : 1996,
        birthMonth: s ? s.userInfo.birthMonth : 5,
        birthDay: s ? s.userInfo.birthDay : 15,
        sajuRecordId: this.lastSavedSajuId,
        productType: "SAJU_FULL_REPORT",
        productName: "천명(天命) 정통 사주팔자 · 대운 · 심층 리포트 열람권",
        paymentMethod: this.selectedPayMethod,
        amount: 500
      };

      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result && result.success && result.data) {
        // 1. 결제 성공 시 사주 원장 데이터를 MySQL DB에 저장
        await this.saveToDatabase();

        // 2. 사주 모드로 전환 및 결과 렌더링
        this.currentMode = "saju";
        this.renderResults();
        this.applyPaywallState(true, result.data);

        // 3. 결제 모달 닫기 및 입력 화면 -> 사주 결과 화면으로 전환!
        this.closePaymentModal();
        document.getElementById("inputSection").classList.add("hidden");
        document.getElementById("resultSection").classList.remove("hidden");
        this.switchResultTab("saju");
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (window.confetti) {
          window.confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.4 }
          });
        }
      } else {
        alert("결제 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error("결제 처리 오류:", err);
      alert("결제 서버 통신 중 오류가 발생했습니다.");
    } finally {
      if (approveBtn) {
        approveBtn.disabled = false;
        approveBtn.textContent = "네, 500원 결제 승인";
      }
      this.cancelFinalConfirmStep();
      this.selectPaymentMethod(this.selectedPayMethod);
    }
  },

  async openHistoryModal() {
    const dialog = document.getElementById("historyDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    const payBox = document.getElementById("paymentHistoryListBox");
    const sajuBox = document.getElementById("sajuHistoryListBox");

    try {
      const [payRes, sajuRes] = await Promise.all([
        fetch("/api/payment/history?limit=10").then(r => r.json()),
        fetch("/api/history/recent?limit=10").then(r => r.json())
      ]);

      if (payBox) {
        const list = (payRes && payRes.data) || [];
        if (list.length === 0) {
          payBox.innerHTML = `<div class="p-3 rounded-xl bg-stone-50 text-center text-stone-500">아직 500원 결제 내역이 없습니다.</div>`;
        } else {
          payBox.innerHTML = list.map(p => {
            const badge = p.payment_method === "KAKAO_PAY"
              ? `<span class="px-2 py-0.5 rounded bg-[#FEE500] text-[#191919] font-black text-[10px]">카카오페이</span>`
              : p.payment_method === "NAVER_PAY"
                ? `<span class="px-2 py-0.5 rounded bg-[#03C75A] text-white font-black text-[10px]">네이버페이</span>`
                : `<span class="px-2 py-0.5 rounded bg-[#0064FF] text-white font-black text-[10px]">토스페이</span>`;
            return `
              <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8ded2] flex items-center justify-between">
                <div>
                  <div class="flex items-center space-x-1.5 mb-0.5">
                    ${badge}
                    <span class="font-extrabold text-stone-900">${p.user_name} 님 (${p.ilju_name || "사주리포트"})</span>
                  </div>
                  <div class="text-[11px] text-stone-500">주문번호: ${p.merchant_uid} · ${String(p.paid_at || "").replace("T", " ").slice(0, 19)}</div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-black text-emerald-700">${p.amount}원</span>
                  <span class="block text-[10px] font-bold text-emerald-800">결제완료(PAID)</span>
                </div>
              </div>
            `;
          }).join("");
        }
      }

      if (sajuBox) {
        const sList = (sajuRes && sajuRes.data) || [];
        if (sList.length === 0) {
          sajuBox.innerHTML = `<div class="p-3 rounded-xl bg-stone-50 text-center text-stone-500">저장된 사주 기록이 없습니다.</div>`;
        } else {
          sajuBox.innerHTML = sList.map(s => `
            <div class="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <span class="font-extrabold text-stone-900">${s.name} (${s.birth_year}.${s.birth_month}.${s.birth_day})</span>
                <span class="ml-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">${s.ilju_name} · ${s.zodiac_animal}</span>
                <div class="text-[11px] text-stone-600 mt-0.5">
                  4주: ${s.year_cheongan}${s.year_jiji}년 ${s.month_cheongan}${s.month_jiji}월 ${s.day_cheongan}${s.day_jiji}일 ${s.time_cheongan || "-"}${s.time_jiji || "-"}시 · 체질: ${s.strength_status || "-"} (용신: ${s.yongsin || "-"})
                </div>
              </div>
              <span class="text-[10px] text-stone-400 font-mono">#${s.saju_id}</span>
            </div>
          `).join("");
        }
      }
    } catch (e) {
      if (payBox) payBox.innerHTML = `<div class="p-3 rounded-xl bg-rose-50 text-rose-800">DB 내역 조회 실패</div>`;
    }
  },

  closeHistoryModal() {
    const dialog = document.getElementById("historyDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  },

  // ==========================================================================
  // 👑 천명(天命) 최고 관리자 전용 대시보드 및 관제실 컨트롤러
  // ==========================================================================
  openAdminModal() {
    const dialog = document.getElementById("adminDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    this.loadAdminDashboard();
  },

  closeAdminModal() {
    const dialog = document.getElementById("adminDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  },

  async loadAdminDashboard() {
    try {
      // 1. 시스템 통합 통계 조회
      const statsRes = await fetch("/api/admin/stats");
      const statsJson = await statsRes.json();
      if (statsJson.success && statsJson.data) {
        const d = statsJson.data;
        const totalEl = document.getElementById("adminStatTotalAccounts");
        const activeEl = document.getElementById("adminStatActiveAccounts");
        const dormantEl = document.getElementById("adminStatDormantAccounts");
        const totalAmountEl = document.getElementById("adminStatTotalAmount");
        const totalPayEl = document.getElementById("adminStatTotalPayments");
        const totalAiEl = document.getElementById("adminStatTotalAi");

        if (totalEl) totalEl.textContent = `${d.totalAccounts || 0}명`;
        if (activeEl) activeEl.textContent = d.activeAccounts || 0;
        if (dormantEl) dormantEl.textContent = `${d.dormantAccounts || 0}명`;
        if (totalAmountEl) totalAmountEl.textContent = `${(d.totalPaymentAmount || 0).toLocaleString()}원`;
        if (totalPayEl) totalPayEl.textContent = d.totalPayments || 0;
        if (totalAiEl) totalAiEl.textContent = `${d.totalAiConsultations || 0}회`;
      }

      // 2. 전체 회원 목록 조회
      const listRes = await fetch("/api/admin/accounts");
      const listJson = await listRes.json();
      const tbody = document.getElementById("adminAccountTableBody");
      if (!tbody) return;

      if (!listJson.success || !listJson.data || listJson.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-stone-500 font-serif-kr">등록된 회원이 없습니다.</td></tr>`;
        return;
      }

      tbody.innerHTML = listJson.data.map(acc => {
        const isDormant = acc.accountStatus === "DORMANT_LOCKED";
        const isWarn = acc.accountStatus === "WARNING_SMS_SENT";
        const statusBadge = isDormant
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">🔒 휴면잠금(10회)</span>`
          : isWarn
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">⚠️ 경고문자(5회+)</span>`
          : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">정상 ACTIVE</span>`;

        const roleBadge = acc.role === "ROLE_ADMIN"
          ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-400">👑 최고관리자</span>`
          : `<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">일반회원</span>`;

        const actionBtn = (isDormant || acc.failedAttempts > 0)
          ? `<button type="button" onclick="App.unlockAccountByAdmin(${acc.id}, '${acc.loginId}')" class="px-2.5 py-1 rounded bg-[#8c1d1d] hover:bg-[#a31d1d] text-white text-[10px] font-bold transition shadow-xs">🔓 잠금·오류 초기화</button>`
          : `<span class="text-stone-400 text-[10px]">정상 유지</span>`;

        return `
          <tr class="hover:bg-[#fbf7ee] transition">
            <td class="py-2.5 px-3 font-mono font-bold text-[#1b140e]">${acc.loginId}</td>
            <td class="py-2.5 px-3 font-semibold text-stone-800">${acc.name}</td>
            <td class="py-2.5 px-3 text-stone-600 font-mono text-[11px]">${acc.phoneNumber || "-"}</td>
            <td class="py-2.5 px-3 text-center">${roleBadge}</td>
            <td class="py-2.5 px-3 text-center font-bold ${acc.failedAttempts >= 5 ? 'text-rose-600' : 'text-stone-700'}">${acc.failedAttempts}회</td>
            <td class="py-2.5 px-3 text-center">${statusBadge}</td>
            <td class="py-2.5 px-3 text-center">${actionBtn}</td>
          </tr>
        `;
      }).join("");

    } catch (err) {
      console.error("관리자 대시보드 로드 실패:", err);
    }
  },

  async unlockAccountByAdmin(accId, loginId) {
    if (!confirm(`계정 [${loginId}]의 오류 횟수 및 휴면 잠금을 즉시 초기화/해제하시겠습니까?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/accounts/${accId}/unlock`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        alert(`✅ ${json.message}`);
        this.loadAdminDashboard();
      } else {
        alert(`❌ 해제 실패: ${json.message}`);
      }
    } catch (err) {
      alert("서버 통신 오류가 발생했습니다.");
    }
  },

  // ==========================================================================
  // 🧙‍♂️ 내장 AI 명리 도사 챗봇 컨트롤러 (사주·일진·오행 연동 & 실시간 타이핑 효과)
  // ==========================================================================
  isAiChatOpen: false,

  toggleAiChatbot(forceState) {
    if (!this.currentAccount && forceState !== false) return;
    const drawer = document.getElementById("aiChatbotDrawer");
    const hint = document.getElementById("aiChatbotHintBubble");
    if (!drawer) return;

    this.isAiChatOpen = typeof forceState === "boolean" ? forceState : !this.isAiChatOpen;
    if (this.isAiChatOpen) {
      drawer.classList.remove("hidden-drawer");
      if (hint) hint.classList.add("hidden");
      this.updateAiContextStatus();
      const input = document.getElementById("aiChatInput");
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      drawer.classList.add("hidden-drawer");
      if (hint) hint.classList.remove("hidden");
    }
  },

  updateAiContextStatus() {
    const statusEl = document.getElementById("aiChatContextStatus");
    if (!statusEl) return;
    if (this.userSaju) {
      const s = this.userSaju;
      const f = this.dailyFortune;
      const iljuName = s.iljuDetail ? s.iljuDetail.name : `${s.pillars.day.gan.char}${s.pillars.day.ji.char}`;
      statusEl.textContent = `📜 ${s.userInfo.name} 님 (${iljuName} · 용신 ${s.yongsin || "-"} · 오늘 ${f ? f.totalScore : 85}점) 연동 중`;
    } else if (this.currentAccount) {
      statusEl.textContent = `👤 ${this.currentAccount.name} 님 로그인됨 · 사주 입력 시 정밀 연동`;
    } else {
      statusEl.textContent = "사주·일진·오행 실시간 연동 AI 상담";
    }
  },

  askAiQuickQuestion(questionText) {
    if (!this.isAiChatOpen) {
      this.toggleAiChatbot(true);
    }
    this.sendAiChatMessage(questionText);
  },

  handleAiChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("aiChatInput");
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    input.value = "";
    this.sendAiChatMessage(msg);
  },

  async sendAiChatMessage(userText) {
    const listEl = document.getElementById("aiChatMessageList");
    if (!listEl) return;

    if (this.hasClientSqlInjection(userText)) {
      this.appendAiMessageBubble("🛡️ 보안 알림", "허용되지 않는 SQL 인젝션 의심 구문이 포함되어 요청이 차단되었습니다.", null, false);
      return;
    }

    // 1. 사용자 질문 말풍선 추가
    const userRow = document.createElement("div");
    userRow.className = "flex justify-end animate-slide-up";
    const safeUserDiv = document.createElement("div");
    safeUserDiv.className = "p-3 rounded-2xl rounded-tr-xs bg-[#8c1d1d] text-[#fff6df] border border-[#d4a359] shadow-xs max-w-[82%] font-medium leading-relaxed";
    safeUserDiv.textContent = userText;
    userRow.appendChild(safeUserDiv);
    listEl.appendChild(userRow);
    listEl.scrollTop = listEl.scrollHeight;

    // 2. AI 도사 생각 중(로딩 점 3개) 말풍선 추가
    const loadingRow = document.createElement("div");
    loadingRow.className = "flex items-start space-x-2 animate-slide-up";
    loadingRow.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-[#8c1d1d] text-[#fff6df] border border-[#d4a359] flex items-center justify-center text-sm shrink-0">🧙‍♂️</div>
      <div class="p-3 rounded-2xl rounded-tl-xs bg-[#fffdf9] border border-[#c8b08a] flex items-center space-x-1.5">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="text-[11px] text-[#5c4d3c] font-bold ml-1">천기(天氣)를 읽는 중...</span>
      </div>
    `;
    listEl.appendChild(loadingRow);
    listEl.scrollTop = listEl.scrollHeight;

    // 3. 백엔드 AI 명리 도사 API 호출
    const s = this.userSaju;
    const f = this.dailyFortune;
    const payload = {
      message: userText,
      userName: s ? s.userInfo.name : (this.currentAccount ? this.currentAccount.name : "도반"),
      gender: s ? s.userInfo.gender : "M",
      iljuName: s && s.iljuDetail ? s.iljuDetail.name : null,
      dayMaster: s ? s.pillars.day.gan.char : null,
      zodiacAnimal: s && s.iljuDetail ? s.iljuDetail.symbol : null,
      strengthStatus: s ? s.strengthStatus : null,
      yongsin: s ? s.yongsin : null,
      deficientElement: s && s.missingElements && s.missingElements.length > 0 ? s.missingElements.map(m => m.name).join(", ") : null,
      todayTenGod: f ? f.todayTenGod : null,
      todayTwelveStage: f && f.twelveStage ? `${f.twelveStage.name}(${f.twelveStage.hanja})` : null,
      todayScore: f ? f.totalScore : null,
      luckyColor: f && f.lucky ? f.lucky.color : null,
      luckyFood: f && f.lucky ? f.lucky.food : null,
      luckyDirection: f && f.lucky ? f.lucky.direction : null,
      sinsalNames: s && s.sinsals && s.sinsals.length > 0 ? s.sinsals.map(x => x.name).join("·") : null
    };

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      loadingRow.remove();

      if (result && result.success && result.data) {
        const d = result.data;
        this.appendAiMessageBubble(d.intentBadge || "🧙‍♂️ AI 명리 도사", d.reply, d.followUpTip, true);
      } else {
        this.appendAiMessageBubble("🧙‍♂️ AI 명리 도사", (result && result.message) || "잠시 천기를 읽는 중 혼선이 있었습니다. 다시 질문해 주세요.", null, false);
      }
    } catch (err) {
      loadingRow.remove();
      this.appendAiMessageBubble("🧙‍♂️ AI 명리 도사", "서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", null, false);
    }
  },

  appendAiMessageBubble(badgeTitle, replyText, followUpTip, useTypewriter = true) {
    const listEl = document.getElementById("aiChatMessageList");
    if (!listEl) return;

    const row = document.createElement("div");
    row.className = "flex items-start space-x-2 animate-slide-up";

    const formattedHtml = String(replyText || "")
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#8c1d1d] font-black'>$1</strong>")
      .replace(/\n/g, "<br/>");

    row.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-[#8c1d1d] text-[#fff6df] border border-[#d4a359] flex items-center justify-center text-sm shrink-0 shadow-xs">🧙‍♂️</div>
      <div class="p-3 rounded-2xl rounded-tl-xs bg-[#fffdf9] border border-[#c8b08a] text-[#2c2219] shadow-xs space-y-1.5 max-w-[86%]">
        <div class="inline-block px-2 py-0.5 rounded bg-[#f5e4c3] text-[#5c2d0c] border border-[#b48a4e] text-[10px] font-black">${badgeTitle}</div>
        <div class="ai-reply-body leading-relaxed font-medium text-xs"></div>
        ${followUpTip ? `<div class="pt-1.5 border-t border-[#e8dcc8] text-[11px] text-[#6b563e] font-bold">${followUpTip}</div>` : ""}
      </div>
    `;
    listEl.appendChild(row);

    const bodyEl = row.querySelector(".ai-reply-body");
    if (!useTypewriter || !bodyEl) {
      if (bodyEl) bodyEl.innerHTML = formattedHtml;
      listEl.scrollTop = listEl.scrollHeight;
      return;
    }

    // 동적 타이핑 스트리밍 효과
    let idx = 0;
    const step = 4;
    const plainLen = formattedHtml.length;
    const timer = setInterval(() => {
      idx += step;
      if (idx >= plainLen) {
        bodyEl.innerHTML = formattedHtml;
        clearInterval(timer);
      } else {
        // HTML 태그 중간이 잘리지 않도록 태그 보정
        let slice = formattedHtml.slice(0, idx);
        const lastOpen = slice.lastIndexOf("<");
        const lastClose = slice.lastIndexOf(">");
        if (lastOpen > lastClose) {
          slice = formattedHtml.slice(0, lastOpen);
        }
        bodyEl.innerHTML = slice;
      }
      listEl.scrollTop = listEl.scrollHeight;
    }, 16);
  },

  // 🐾 마스코트 상호작용
  interactMascot(e) {
    if (!this.currentMascot) {
      this.currentMascot = ZODIAC_MASCOTS["진"] || Object.values(ZODIAC_MASCOTS)[0];
    }
    const quotes = this.currentMascot.quotes || [];
    this.mascotQuoteIdx = ((this.mascotQuoteIdx || 0) + 1) % quotes.length;
    
    const quoteEl = document.getElementById("mascotQuote");
    if (quoteEl) {
      quoteEl.textContent = `"${quotes[this.mascotQuoteIdx]}"`;
      quoteEl.classList.remove("quote-flash");
      void quoteEl.offsetWidth;
      quoteEl.classList.add("quote-flash");
    }

    const avatarContainer = document.getElementById("mascotAvatarContainer");
    if (avatarContainer) {
      avatarContainer.classList.remove("mascot-tap-pop");
      void avatarContainer.offsetWidth;
      avatarContainer.classList.add("mascot-tap-pop");
    }

    const clientX = (e && e.clientX) ? e.clientX : (window.innerWidth / 2);
    const clientY = (e && e.clientY) ? e.clientY : (window.innerHeight / 3);
    this.spawnMascotParticles(clientX, clientY);

    if (window.confetti) {
      try {
        window.confetti({
          particleCount: 24,
          spread: 50,
          origin: { y: Math.max(0.15, (clientY / window.innerHeight) - 0.05) },
          colors: ["#f59e0b", "#f43f5e", "#a855f7", "#06b6d4", "#10b981"]
        });
      } catch (err) {}
    }
  },

  spawnMascotParticles(x, y) {
    const emojis = ["💖", "✨", "⭐", "🍀", "🎉", "🌸", "🥰", "💫", "🍯"];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("div");
      p.className = "floating-particle";
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = `${x - 14 + (Math.random() * 32 - 16)}px`;
      p.style.top = `${y - 14 + (Math.random() * 24 - 12)}px`;
      if (p.style && p.style.setProperty) {
        p.style.setProperty("--dx", `${(Math.random() - 0.5) * 70}px`);
      }
      if (document.body && document.body.appendChild) {
        document.body.appendChild(p);
      }
      setTimeout(() => { if (p.remove) p.remove(); }, 850);
    }
  },

  // ==========================================================================
  // 🃏 3-Card 대화형 타로 시스템 (실제 타로 카드 리딩처럼 3장 직접 선택 및 종합 해석)
  // ==========================================================================

  initTarotDeck() {
    const allCards = window.TarotData || [];
    if (allCards.length === 0) return;

    // 전체 22장 중 12장을 무작위 셔플하여 펼침 덱 구성
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    this.tarotDeckCards = shuffled.slice(0, 12);
    this.tarotPickedCards = [];

    this.renderTarotDeck();
  },

  renderTarotDeck() {
    const grid = document.getElementById("tarotDeckGrid");
    if (!grid) return;
    grid.innerHTML = "";

    this.tarotDeckCards.forEach((card, idx) => {
      const cardEl = document.createElement("div");
      cardEl.className = "tarot-pickable-card";
      cardEl.id = `pickCard-${idx}`;
      cardEl.setAttribute("onclick", `App.pick3CardTarot(${idx}, event)`);
      cardEl.innerHTML = `
        <div class="tarot-card-seal">🎴</div>
        <div class="tarot-card-pattern"></div>
        <span class="tarot-card-number">${idx + 1}</span>
      `;
      grid.appendChild(cardEl);
    });

    this.updateTarotPickStateUI();
  },

  setTarotCategory(cat) {
    this.tarotCategory = cat;
    const cats = ["love", "career", "money", "mind"];
    const catLabels = {
      love: "💖 연애 & 사랑",
      career: "💼 진로 & 이직",
      money: "💰 금전 & 사업",
      mind: "🕊️ 마음 치유 & 조언"
    };

    cats.forEach(c => {
      const btn = document.getElementById(`tarotCat-${c}`);
      if (btn) {
        if (c === cat) {
          btn.className = "px-3.5 py-1.5 rounded-full font-bold bg-[#8c1d1d] text-[#fff6df] border border-[#d4a359] shadow-sm transition";
        } else {
          btn.className = "px-3.5 py-1.5 rounded-full font-bold bg-[#efe5d4] text-[#36281c] hover:bg-[#e3d3b9] border border-[#c2aa84] transition";
        }
      }
    });

    // 카테고리가 바뀌면 기존에 뽑았던 카드를 초기화하고 덱을 새로 셔플하여 다시 3장을 뽑게 함
    this.resetTarotSpread();

    const promptText = document.getElementById("tarotPickPromptText");
    if (promptText) {
      promptText.textContent = `👇 [${catLabels[cat] || "새로운 고민"}] 주제로 카드가 새로 셔플되었습니다! 카드를 3장 다시 골라주세요 (0/3)`;
      promptText.className = "text-xs font-bold text-[#8c1d1d] animate-pulse";
    }
  },

  pick3CardTarot(deckIdx, e) {
    if (this.tarotPickedCards.length >= 3) return;
    const cardEl = document.getElementById(`pickCard-${deckIdx}`);
    if (cardEl && cardEl.classList.contains("picked")) return;

    const card = this.tarotDeckCards[deckIdx];
    if (!card) return;

    this.tarotPickedCards.push({ deckIdx, card });
    if (cardEl) {
      cardEl.classList.add("picked");
    }

    const clientX = (e && e.clientX) ? e.clientX : (window.innerWidth / 2);
    const clientY = (e && e.clientY) ? e.clientY : (window.innerHeight / 2);
    this.spawnMascotParticles(clientX, clientY);

    this.updateTarotPickStateUI();
  },

  updateTarotPickStateUI() {
    const countBadge = document.getElementById("tarotPickCountBadge");
    const count = this.tarotPickedCards.length;
    if (countBadge) {
      countBadge.textContent = `${count} / 3장 선택됨`;
    }

    const slotNames = ["과거 / 원인", "현재 / 조언", "미래 / 결말"];
    for (let i = 0; i < 3; i++) {
      const previewEl = document.getElementById(`slotPreview-${i}`);
      if (previewEl) {
        if (i < count) {
          const picked = this.tarotPickedCards[i].card;
          const shortName = picked.nameKr ? picked.nameKr.split(" (")[0] : picked.name;
          previewEl.className = "p-2 rounded-xl bg-indigo-600 text-white text-center text-xs font-bold py-3 shadow-sm border border-indigo-700 transition animate-scale-pop";
          previewEl.innerHTML = `✓ ${slotNames[i]}<br><span class="text-[11px] font-extrabold opacity-95">${shortName}</span>`;
        } else {
          previewEl.className = "p-2 rounded-xl bg-white border border-dashed border-indigo-300 text-center text-xs font-bold text-slate-400 py-3";
          previewEl.innerHTML = `${i + 1}. ${slotNames[i]}`;
        }
      }
    }

    const promptText = document.getElementById("tarotPickPromptText");
    const actionBox = document.getElementById("tarotRevealActionBox");

    if (count === 3) {
      if (promptText) {
        promptText.textContent = "✨ 3장의 카드를 모두 골랐습니다! 아래 버튼을 눌러 종합 타로 해석을 확인하세요.";
        promptText.className = "text-xs font-black text-indigo-900";
      }
      if (actionBox) actionBox.classList.remove("hidden");
    } else {
      if (promptText) {
        promptText.textContent = `👇 마음을 가다듬고, 끌리는 카드를 ${3 - count}장 더 골라주세요 (${count}/3)`;
        promptText.className = "text-xs font-bold text-indigo-700 animate-pulse";
      }
      if (actionBox) actionBox.classList.add("hidden");
    }
  },

  reveal3CardReading() {
    if (this.tarotPickedCards.length < 3) return;

    const spreadSec = document.getElementById("tarotSpreadSection");
    const revealSec = document.getElementById("tarotRevealedSection");
    if (spreadSec) spreadSec.classList.add("hidden");
    if (revealSec) revealSec.classList.remove("hidden");

    this.populateRevealedTarotCards();
    this.saveTarotReadingToDb();

    // 3장의 카드 순차적 3D 플립 애니메이션
    for (let i = 0; i < 3; i++) {
      const inner = document.getElementById(`slotInner-${i}`);
      if (inner) {
        inner.classList.remove("flipped");
        setTimeout(() => {
          inner.classList.add("flipped");
        }, 150 + i * 220);
      }
    }

    if (window.confetti) {
      try {
        window.confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    if (window.lucide) window.lucide.createIcons();
  },

  async saveTarotReadingToDb() {
    try {
      if (this.tarotPickedCards.length < 3) return;
      const c2 = this.tarotPickedCards[1].card;
      const cat = this.tarotCategory || "love";
      const payload = {
        userId: null,
        cardNumber: typeof c2.id === "number" ? c2.id : 0,
        cardNameKr: String(c2.nameKr || c2.name || "타로 카드").slice(0, 48),
        cardNameEn: String(c2.nameEn || cat.toUpperCase()).slice(0, 48),
        isReversed: false,
        keyword: String(Array.isArray(c2.keywords) ? c2.keywords.join(", ") : (c2.keyword || "타로 3장 리딩")).slice(0, 95),
        interpretation: c2.summary || "3-Card 타로 점괘",
        advice: c2.generalAdvice || c2.loveAdvice || "현실을 직시하고 실천하세요."
      };
      await fetch("/api/tarot/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("타로 DB 저장 알림:", e);
    }
  },

  populateRevealedTarotCards() {
    if (this.tarotPickedCards.length < 3) return;
    const cat = this.tarotCategory || "love";

    const getAdviceByCat = (card, positionIdx) => {
      let baseText = "";
      if (cat === "love") baseText = card.loveAdvice || card.generalAdvice;
      else if (cat === "career") baseText = card.careerAdvice || card.generalAdvice;
      else if (cat === "money") baseText = card.moneyAdvice || card.generalAdvice;
      else baseText = card.mindAdvice || card.generalAdvice;

      if (positionIdx === 0) {
        // 과거 / 원인
        return `${card.realityCheck || ""} ${card.summary || ""}`.trim();
      } else if (positionIdx === 1) {
        // 현재 / 조언
        return baseText;
      } else {
        // 미래 / 결말
        if (card.nature === "harsh") {
          return `⚠️ [파국·단절의 경고] ${baseText}`;
        } else if (card.nature === "warning") {
          return `⚠️ [정체·기만의 주의] ${baseText}`;
        } else if (card.nature === "caution") {
          return `⚖️ [조건부 결말] 리스크를 냉정히 통제하지 못하면 실패합니다. ${baseText}`;
        } else {
          return `✨ [성취의 길] 안일함을 버리고 현재의 뼈아픈 대가를 치렀을 때만 도달합니다. ${baseText}`;
        }
      }
    };

    const cards = this.tarotPickedCards.map(p => p.card);

    for (let i = 0; i < 3; i++) {
      const c = cards[i];
      const nameEl = document.getElementById(`cardName-${i}`);
      const sumEl = document.getElementById(`cardSummary-${i}`);
      const advEl = document.getElementById(`cardAdv-${i}`);

      if (nameEl) nameEl.textContent = c.nameKr;
      if (sumEl) sumEl.textContent = c.summary;
      if (advEl) advEl.textContent = getAdviceByCat(c, i);
    }

    // 현실 직시 종합 스토리 리딩
    const catNames = {
      love: "연애 & 사랑",
      career: "진로 & 이직",
      money: "금전 & 사업",
      mind: "마음 치유 & 현실 자각"
    };

    const storyEl = document.getElementById("tarotComprehensiveStory");
    if (storyEl) {
      const c1 = cards[0];
      const c2 = cards[1];
      const c3 = cards[2];

      let futureSynthesis = "";
      if (c3.nature === "harsh") {
        futureSynthesis = `미래 카드인 [${c3.nameKr}]은 헛된 희망고문을 거부합니다. 지금 당장 과거의 미련을 끊고 현재의 잘못된 흐름을 과감히 도려내지 않는다면, 피할 수 없는 파국과 혹독한 대가를 치르게 될 것임을 엄중히 경고합니다.`;
      } else if (c3.nature === "warning") {
        futureSynthesis = `미래의 [${c3.nameKr}] 카드는 안갯속 정체와 기만을 가리키고 있습니다. 눈앞의 달콤한 환상이나 확인되지 않은 낙관론에 속지 마세요. 발이 묶이고 뒤통수를 맞지 않으려면 지금 확실한 안전장치를 걸어 잠가야 합니다.`;
      } else if (c3.nature === "caution") {
        futureSynthesis = `미래의 [${c3.nameKr}]은 양날의 검입니다. 저절로 얻어지는 행운이란 결코 없으며, 현재 [${c2.nameKr}]이 지적하는 취약점과 나태함을 고치지 않으면 그 어떤 성취도 사상누각처럼 무너집니다. 철저한 현실 점검이 유일한 해법입니다.`;
      } else {
        futureSynthesis = `미래의 [${c3.nameKr}]은 빛을 향하고 있으나, 이는 과거 [${c1.nameKr}]의 과오를 완전히 청산하고 현재 [${c2.nameKr}]의 뼈아픈 조언을 묵묵히 실행했을 때에만 열리는 '조건부 결실'입니다. 근거 없는 방심은 금물입니다.`;
      }

      storyEl.innerHTML = `
        <span class="text-indigo-950 font-extrabold block mb-2 text-xs border-b border-indigo-200 pb-1.5 flex items-center justify-between">
          <span>【${catNames[cat] || "종합"} 현실 직시 3단계 스토리】</span>
          <span class="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">희망고문 없는 팩트 리딩</span>
        </span>
        <span class="block mb-2">
          <strong class="text-indigo-950 font-bold block mb-0.5">1단계 과거 (원인과 팩트):</strong>
          [${c1.nameKr}] — ${c1.realityCheck} 과거에 ${c1.summary}
        </span>
        <span class="block mb-2">
          <strong class="text-rose-950 font-bold block mb-0.5">2단계 현재 (뼈아픈 현실 직언):</strong>
          [${c2.nameKr}] — 지금 눈가리고 아웅 할 때가 아닙니다. ${getAdviceByCat(c2, 1)}
        </span>
        <span class="block">
          <strong class="text-slate-950 font-bold block mb-0.5">3단계 미래 (현실적 결말 & 엄중한 경고):</strong>
          [${c3.nameKr}] — ${futureSynthesis}
        </span>
      `;
    }
  },

  toggleSlotFlip(idx) {
    const inner = document.getElementById(`slotInner-${idx}`);
    if (inner) {
      inner.classList.toggle("flipped");
    }
  },

  resetTarotSpread() {
    this.tarotPickedCards = [];
    const spreadSec = document.getElementById("tarotSpreadSection");
    const revealSec = document.getElementById("tarotRevealedSection");
    const actionBox = document.getElementById("tarotRevealActionBox");

    if (revealSec) revealSec.classList.add("hidden");
    if (spreadSec) spreadSec.classList.remove("hidden");
    if (actionBox) actionBox.classList.add("hidden");

    for (let i = 0; i < 3; i++) {
      const inner = document.getElementById(`slotInner-${i}`);
      if (inner) inner.classList.remove("flipped");
    }

    this.initTarotDeck();
  },

  copyResultText() {
    if (!this.userSaju || !this.dailyFortune) return;
    const s = this.userSaju;
    const f = this.dailyFortune;

    const text = `[천명(天命) 사주 분석 & 오늘의 운세]
• 이름: ${s.userInfo.name} (${s.userInfo.genderKr})
• 생년월일: ${s.userInfo.solarDateString}
• 일주: ${s.iljuDetail.name} (${s.iljuDetail.symbol})
• 연애 기질: ${s.iljuDetail.loveStyle}
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
        title: "천명(天命) - 오늘의 운세 · 사주 · 타로",
        text: "한국천문연구원 역법 기반 고정밀 사주 만세력과 오늘의 운세, 타로 카드를 확인해보세요!",
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
