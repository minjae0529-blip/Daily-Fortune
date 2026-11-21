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

    // 1. 사용자 질문 말풍선 추가 및 히스토리 기록
    this.aiChatHistory = this.aiChatHistory || [];
    this.aiChatHistory.push({
      role: "user",
      text: userText,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    });

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
        this.aiChatHistory.push({
          role: "ai",
          badge: d.intentBadge || "🧙‍♂️ AI 명리 도사",
          text: d.reply,
          tip: d.followUpTip,
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
        });
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

// ==========================================================================
  // 📥 카테고리별 인터랙티브 서책 자료 내보내기 (PDF 대체 독립형 HTML 서책)
  // ==========================================================================
  currentExportPreviewTab: "daily",
  aiChatHistory: [],

  openExportModal() {
    if (!this.userSaju && !this.dailyFortune && (!this.tarotPickedCards || this.tarotPickedCards.length === 0)) {
      alert("먼저 사주 또는 오늘의 운세를 분석한 후 내보내기를 이용해주세요.");
      return;
    }
    const dialog = document.getElementById("exportDialog");
    if (!dialog) return;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    this.updateExportPreview();
  },

  closeExportModal() {
    const dialog = document.getElementById("exportDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  },

  toggleAllExportCategories(checkAll) {
    const ids = ["exportCatDaily", "exportCatSaju", "exportCatElements", "exportCatSinsal", "exportCatFuture", "exportCatTarot", "exportCatAi", "exportCatMascot"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = checkAll;
    });
    this.updateExportPreview();
  },

  switchExportPreviewTab(tabKey) {
    this.currentExportPreviewTab = tabKey;
    const tabs = ["daily", "saju", "element", "sinsal", "future", "tarot", "ai"];
    tabs.forEach(t => {
      const btn = document.getElementById(`exportPrevTabBtn-${t}`);
      if (btn) {
        if (t === tabKey) {
          btn.className = "px-2.5 py-1 rounded-md font-bold bg-[#231710] text-[#f7d88c] shadow-sm";
        } else {
          btn.className = "px-2.5 py-1 rounded-md font-semibold text-stone-700 hover:text-black";
        }
      }
    });
    this.updateExportPreview();
  },

  updateExportPreview() {
    const box = document.getElementById("exportPreviewContentBox");
    if (!box) return;

    const s = this.userSaju;
    const f = this.dailyFortune;
    const tab = this.currentExportPreviewTab || "daily";

    const safe = (val, def = "-") => (val !== undefined && val !== null && val !== "") ? val : def;
    const getTenGodName = (tg) => {
      if (!tg) return "-";
      if (typeof tg === "string") return tg.split("(")[0];
      return tg.name || tg.hanja || "-";
    };

    const TWELVE_STAGES_TABLE = {
      "갑": { "해": "장생", "자": "목욕", "축": "관대", "인": "건록", "묘": "제왕", "진": "쇠", "사": "병", "오": "사", "미": "묘", "신": "절", "유": "태", "술": "양" },
      "을": { "오": "장생", "사": "목욕", "진": "관대", "묘": "건록", "인": "제왕", "축": "쇠", "자": "병", "해": "사", "술": "묘", "유": "절", "신": "태", "미": "양" },
      "병": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "정": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "무": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "기": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "경": { "사": "장생", "오": "목욕", "미": "관대", "신": "건록", "유": "제왕", "술": "쇠", "해": "병", "자": "사", "축": "묘", "인": "절", "묘": "태", "진": "양" },
      "신": { "자": "장생", "해": "목욕", "술": "관대", "유": "건록", "신": "제왕", "미": "쇠", "오": "병", "사": "사", "진": "묘", "묘": "절", "인": "태", "축": "양" },
      "임": { "신": "장생", "유": "목욕", "술": "관대", "해": "건록", "자": "제왕", "축": "쇠", "인": "병", "묘": "사", "진": "묘", "사": "절", "오": "태", "미": "양" },
      "계": { "묘": "장생", "인": "목욕", "축": "관대", "자": "건록", "해": "제왕", "술": "쇠", "유": "병", "신": "사", "미": "묘", "오": "절", "사": "태", "진": "양" }
    };
    const getPillarStage = (dayGanChar, jiChar) => {
      if (!dayGanChar || !jiChar) return "-";
      return (TWELVE_STAGES_TABLE[dayGanChar] && TWELVE_STAGES_TABLE[dayGanChar][jiChar]) || "-";
    };

    if (tab === "daily") {
      if (!f) {
        box.innerHTML = `<div class="text-stone-500 py-6 text-center">오늘의 운세 데이터가 없습니다. 먼저 분석을 진행해주세요.</div>`;
        return;
      }
      const mascot = this.currentMascot || (window.ZODIAC_MASCOTS && s && s.pillars ? window.ZODIAC_MASCOTS[s.pillars.year.ji.char] : null) || {
        emoji: "🐲", name: "청룡이", greeting: "희망찬 푸른 기운이 가득한 날이야!", quotes: ["스스로를 믿고 당당하게 나아가봐! 🌟"]
      };

      const hourlyList = (f.hourlyFlow && f.hourlyFlow.length > 0) ? f.hourlyFlow : [
        { time: "아침 (07:00 ~ 11:00)", tenGodBadge: "정관의 기운", status: "순조(平)", desc: "정갈한 마음가짐으로 하루의 우선순위를 정하고 집중하기 좋은 시간입니다." },
        { time: "오후 (11:00 ~ 17:00)", tenGodBadge: "정재의 기운", status: "최고조(大吉)", desc: "업무 추진력과 결실이 배가되는 시간으로 중요한 협상과 실행에 최적입니다." },
        { time: "저녁 (17:00 ~ 21:00)", tenGodBadge: "식신의 기운", status: "순조(平)", desc: "좋은 사람들과 맛있는 음식을 나누며 따뜻한 대화를 이어가기 좋습니다." },
        { time: "밤 (21:00 ~ 익일 07:00)", tenGodBadge: "정인의 기운", status: "안정(吉)", desc: "차분하게 사색하고 내면의 에너지를 충전하며 내일을 준비하세요." }
      ];

      box.innerHTML = `
        <div class="space-y-3 font-serif-kr">
          <!-- 상단 총운 요약 헤더 -->
          <div class="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start justify-between">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">${safe(f.dateString)}</span>
                <span class="text-xs text-stone-600 font-bold">오늘의 일진: ${safe(f.todayIljin ? f.todayIljin.name : "")} (${safe(f.todayTenGod)})</span>
              </div>
              <h4 class="text-sm sm:text-base font-black text-[#451a03] mt-1">${safe(f.theme)}</h4>
              <p class="text-[11px] text-[#78350f] mt-0.5 leading-relaxed font-sans">${safe(f.summary)}</p>
            </div>
            <div class="text-right shrink-0 ml-2">
              <span class="text-2xl sm:text-3xl font-black text-[#b45309] font-sans">${f.totalScore}점</span>
              <span class="block text-[10px] font-bold text-[#92400e]">${f.totalScore >= 90 ? "대대길(大大吉)" : (f.totalScore >= 80 ? "대길(大吉)" : "평온(平溫)")}</span>
            </div>
          </div>

          <!-- 4대 운세 세부 지수 -->
          <div class="grid grid-cols-4 gap-1.5 text-center font-sans">
            <div class="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <span class="text-[10px] text-amber-800 font-bold block">💰 재물운</span>
              <strong class="text-sm font-black text-amber-900">${f.scores ? f.scores.money : 85}%</strong>
            </div>
            <div class="p-2 rounded-lg bg-rose-50 border border-rose-200">
              <span class="text-[10px] text-rose-800 font-bold block">💖 애정운</span>
              <strong class="text-sm font-black text-rose-900">${f.scores ? f.scores.love : 88}%</strong>
            </div>
            <div class="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <span class="text-[10px] text-emerald-800 font-bold block">🌿 건강운</span>
              <strong class="text-sm font-black text-emerald-900">${f.scores ? f.scores.health : 90}%</strong>
            </div>
            <div class="p-2 rounded-lg bg-sky-50 border border-sky-200">
              <span class="text-[10px] text-sky-800 font-bold block">💼 직업운</span>
              <strong class="text-sm font-black text-sky-900">${f.scores ? f.scores.career : 92}%</strong>
            </div>
          </div>

          <!-- 🐾 12지신 수호동물 파트너 인사 & 명언 -->
          <div class="p-2.5 rounded-xl bg-amber-50/80 border border-amber-300 flex items-center space-x-3">
            <span class="text-3xl shrink-0 select-none">${mascot.emoji}</span>
            <div class="text-xs space-y-0.5">
              <div class="flex items-center space-x-1.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-950">수호동물 ${mascot.name} ${mascot.emoji}</span>
                <span class="text-[10px] text-stone-500 font-medium">나만의 평생 수호 파트너</span>
              </div>
              <p class="font-bold text-stone-900">"${s ? s.userInfo.name : '도반'}님, ${mascot.greeting} 오늘 하루도 내가 든든하게 지켜줄게! 💖"</p>
              <p class="text-[11px] text-amber-900 font-sans font-medium">💬 <em>${mascot.quotes ? mascot.quotes[0] : '너의 직관과 결단을 믿어봐! 오늘은 감이 최고야 ✨'}</em></p>
            </div>
          </div>

          <!-- 12운성 & 합충 신호등 -->
          ${f.twelveStage ? `
          <div class="p-2.5 rounded-lg bg-[#faf4e8] border border-[#d5c19e] text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-[#8c1d1d]">⚡ 12운성 일진 에너지: ${safe(f.twelveStage.name)}(${safe(f.twelveStage.hanja)}) · ${safe(f.twelveStage.badge)} (${f.twelveStage.power}점)</span>
            </div>
            <p class="text-[11px] text-stone-700 leading-relaxed font-sans">${safe(f.twelveStage.desc)}</p>
          </div>
          ` : ''}

          <!-- 합충 신호등 리스트 -->
          ${f.hapChungSignals && f.hapChungSignals.length > 0 ? `
          <div class="space-y-1">
            ${f.hapChungSignals.map(sig => `
              <div class="flex items-start space-x-1.5 text-[11px] p-1.5 rounded bg-white border border-stone-200">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${sig.type === 'HAP' ? 'bg-emerald-100 text-emerald-900' : (sig.type === 'CHUNG' ? 'bg-rose-100 text-rose-900' : 'bg-stone-100 text-stone-800')}">${safe(sig.label)}</span>
                <span class="text-stone-700 font-sans">${safe(sig.desc)}</span>
              </div>
            `).join("")}
          </div>
          ` : ''}

          <!-- 추천 및 주의 행동 -->
          <div class="grid grid-cols-2 gap-2 text-xs font-sans">
            <div class="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
              <strong class="block text-emerald-900 font-bold mb-0.5">✅ 오늘의 추천:</strong>
              <p class="text-[11px] leading-relaxed">${safe(f.action)}</p>
            </div>
            <div class="p-2.5 rounded-lg bg-rose-50 text-rose-950 border border-rose-200">
              <strong class="block text-rose-900 font-bold mb-0.5">⚠️ 오늘의 주의:</strong>
              <p class="text-[11px] leading-relaxed">${safe(f.avoid)}</p>
            </div>
          </div>

          <!-- 행운 아이템 -->
          <div class="p-2.5 rounded-lg bg-white border border-stone-200 text-xs flex flex-wrap gap-x-4 gap-y-1 text-stone-800">
            <span>🎨 행운 컬러: <strong class="text-amber-900">${safe(f.lucky ? f.lucky.color : "-")}</strong></span>
            <span>🔢 행운 번호: <strong class="text-amber-900">${safe(f.lucky ? f.lucky.numbers : "-")}</strong></span>
            <span>🧭 길한 방위: <strong class="text-amber-900">${safe(f.lucky ? f.lucky.direction : "-")}</strong></span>
            <span>🍲 추천 음식: <strong class="text-amber-900">${safe(f.lucky ? f.lucky.food : "-")}</strong></span>
          </div>

          <!-- ⏰ 시간대별 정밀 운세 리듬 & 12시진 흐름표 -->
          <div class="pt-1">
            <span class="font-bold text-stone-900 block mb-1 text-xs">⏰ 시간대별 일진 리듬 & 길흉 흐름표:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto text-[11px] font-sans">
              ${hourlyList.map(slot => `
                <div class="p-2 rounded bg-white border border-stone-200 flex items-center justify-between">
                  <div class="pr-2">
                    <strong class="text-stone-900">${safe(slot.time)}</strong>
                    <span class="text-[10px] text-amber-800 ml-1 font-bold">${safe(slot.tenGodBadge)}</span>
                    <p class="text-[10px] text-stone-500 mt-0.5">${safe(slot.desc)}</p>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-black shrink-0 ${slot.status && slot.status.includes('吉') ? 'bg-amber-100 text-amber-900 border border-amber-300' : (slot.status && slot.status.includes('凶') ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-800 border border-slate-300')}">${safe(slot.status)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    } else if (tab === "saju") {
      if (!s) {
        box.innerHTML = `<div class="text-stone-500 py-6 text-center">사주 원국 데이터가 없습니다. 메인 화면에서 사주 분석을 먼저 진행해주세요.</div>`;
        return;
      }
      const p = s.pillars;
      const j = (ji) => {
        const d = {
          "자": "계(癸)", "축": "계·신·기", "인": "무·병·갑", "묘": "을(乙)",
          "진": "을·계·무", "사": "무·경·병", "오": "병·기·정", "미": "정·을·기",
          "신": "무·임·경", "유": "신(辛)", "술": "신·정·무", "해": "무·갑·임"
        };
        return d[ji] || "-";
      };

      const columns = [
        { label: "시주(時柱)", pil: p.time, empty: !p.time },
        { label: "일주(日柱)", pil: p.day, isMaster: true },
        { label: "월주(月柱)", pil: p.month },
        { label: "년주(年柱)", pil: p.year }
      ];

      box.innerHTML = `
        <div class="space-y-3 font-serif-kr">
          <div class="flex items-center justify-between pb-1 border-b border-stone-200">
            <span class="font-bold text-stone-900 text-sm">사주 4주 8자 (四柱八字) 만세력</span>
            <span class="text-xs text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">본원: ${p.day.gan.char}(${p.day.gan.hanja})</span>
          </div>

          <!-- 4주 8자 만세력 테이블 (천간, 지지, 십신, 지장간, 12운성 포함) -->
          <div class="overflow-x-auto">
            <table class="w-full text-center border-collapse text-xs">
              <thead>
                <tr class="bg-[#f5eee3] text-stone-700 border-b border-stone-300">
                  <th class="p-1.5 font-bold">구분</th>
                  ${columns.map(c => `<th class="p-1.5 font-bold">${c.label}</th>`).join("")}
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-200">
                <tr class="bg-amber-50/50">
                  <td class="p-1.5 text-stone-500 font-bold text-[10px]">천간 십신</td>
                  ${columns.map(c => `<td class="p-1.5 text-[11px] font-bold text-amber-900">${c.pil ? (c.isMaster ? '★ 일간(나)' : getTenGodName(c.pil.tenGodGan)) : '모름'}</td>`).join("")}
                </tr>
                <tr class="font-bold text-base">
                  <td class="p-2 text-stone-500 font-bold text-xs bg-stone-50">천간 (天干)</td>
                  ${columns.map(c => `<td class="p-2 ${c.isMaster ? 'text-amber-950 bg-amber-100/60 font-black ring-1 ring-amber-400' : 'text-stone-900'}">${c.pil ? `${c.pil.gan.char}<span class="text-xs text-stone-500 ml-0.5">(${c.pil.gan.hanja})</span>` : '-'}</td>`).join("")}
                </tr>
                <tr class="font-bold text-base">
                  <td class="p-2 text-stone-500 font-bold text-xs bg-stone-50">지지 (地支)</td>
                  ${columns.map(c => `<td class="p-2 ${c.isMaster ? 'text-amber-950 bg-amber-100/60 font-black ring-1 ring-amber-400' : 'text-stone-900'}">${c.pil ? `${c.pil.ji.char}<span class="text-xs text-stone-500 ml-0.5">(${c.pil.ji.hanja})</span>` : '-'}</td>`).join("")}
                </tr>
                <tr class="bg-amber-50/50">
                  <td class="p-1.5 text-stone-500 font-bold text-[10px]">지지 십신</td>
                  ${columns.map(c => `<td class="p-1.5 text-[11px] font-bold text-stone-700">${c.pil ? getTenGodName(c.pil.tenGodJi) : '모름'}</td>`).join("")}
                </tr>
                <tr class="bg-stone-50">
                  <td class="p-1.5 text-stone-500 font-bold text-[10px]">12운성</td>
                  ${columns.map(c => `<td class="p-1.5 text-[11px] font-bold text-[#8c1d1d]">${c.pil ? getPillarStage(p.day.gan.char, c.pil.ji.char) : '모름'}</td>`).join("")}
                </tr>
                <tr>
                  <td class="p-1.5 text-stone-500 font-bold text-[10px] bg-stone-50">지장간</td>
                  ${columns.map(c => `<td class="p-1.5 text-[10px] text-stone-500 font-sans">${c.pil ? j(c.pil.ji.char) : '모름'}</td>`).join("")}
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 60갑자 일주론 상세 해설 (본원 성향, 강점, 주의점, 연애 스타일, 재물 스타일) -->
          <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
            <div class="flex items-center justify-between pb-1 border-b border-amber-200">
              <span class="font-bold text-amber-950 text-sm">🌿 60갑자 일주론 심층 분석: ${safe(s.iljuDetail.name)} (${safe(s.iljuDetail.symbol)})</span>
              <span class="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">기질: ${safe(s.iljuDetail.nature)}</span>
            </div>
            <p class="text-[11px] text-stone-800 leading-relaxed font-sans pt-0.5"><strong>본원 성향:</strong> ${safe(s.iljuDetail.desc)}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans pt-1">
              <div class="p-2 rounded bg-white border border-stone-200">
                <strong class="text-emerald-900 block mb-0.5">✨ 타고난 강점:</strong>
                <span class="text-stone-700">${safe(s.iljuDetail.strength)}</span>
              </div>
              <div class="p-2 rounded bg-white border border-stone-200">
                <strong class="text-rose-900 block mb-0.5">⚠️ 주의할 점:</strong>
                <span class="text-stone-700">${safe(s.iljuDetail.caution)}</span>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans pt-1">
              <div class="p-2 rounded bg-pink-50/80 border border-pink-200">
                <strong class="text-pink-900 block mb-0.5">💖 연애 스타일:</strong>
                <span class="text-stone-700">${safe(s.iljuDetail.loveStyle)}</span>
              </div>
              <div class="p-2 rounded bg-amber-100/50 border border-amber-300">
                <strong class="text-amber-950 block mb-0.5">💰 재물 스타일:</strong>
                <span class="text-stone-700">${safe(s.iljuDetail.wealthStyle)}</span>
              </div>
            </div>
          </div>

          <!-- 내 사주가 특별히 좋은 이유 3가지 (3대 복록 카드) -->
          ${s.blessingPoints && s.blessingPoints.length > 0 ? `
          <div class="space-y-1.5 pt-1">
            <span class="font-bold text-amber-950 block text-xs">✨ 내 사주가 특별히 좋은 이유 3가지 (3대 타고난 복록):</span>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-sans">
              ${s.blessingPoints.map((pt, idx) => `
                <div class="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs space-y-1">
                  <div class="flex items-center space-x-1.5">
                    <span class="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">${idx + 1}</span>
                    <strong class="text-stone-900 text-xs font-serif-kr">${safe(pt.title)}</strong>
                  </div>
                  <p class="text-[11px] text-stone-600 leading-relaxed">${safe(pt.desc)}</p>
                </div>
              `).join("")}
            </div>
          </div>
          ` : ''}

          <!-- 10년 주기 대운 흐름표 -->
          ${s.daeunList && s.daeunList.length > 0 ? `
          <div class="pt-2">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-stone-900 text-xs">🌊 10년 주기 대운(大運) 흐름표</span>
              <span class="text-[10px] text-stone-500">${s.isForward ? '순행(順行)' : '역행(逆行)'} · 대운수 ${s.daeunNumber || 1}</span>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center font-sans text-[10px]">
              ${s.daeunList.map(d => `
                <div class="p-1.5 rounded-lg border border-stone-200 bg-white">
                  <span class="text-stone-500 block text-[9px]">${d.startAge}~${d.endAge}세</span>
                  <strong class="text-stone-900 text-xs block my-0.5">${d.ganChar}${d.jiChar}</strong>
                  <span class="text-[9px] text-amber-800 font-bold block truncate">${getTenGodName(d.tenGod)}</span>
                </div>
              `).join("")}
            </div>
          </div>
          ` : ''}
        </div>
      `;
    } else if (tab === "element") {
      if (!s) {
        box.innerHTML = `<div class="text-stone-500 py-6 text-center">오행 분석 데이터가 없습니다.</div>`;
        return;
      }
      const elMap = [
        { name: "목(木)", key: "목", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-900 border-emerald-200", pct: s.elements["목"] || 0 },
        { name: "화(火)", key: "화", color: "bg-rose-500", light: "bg-rose-50 text-rose-900 border-rose-200", pct: s.elements["화"] || 0 },
        { name: "토(土)", key: "토", color: "bg-amber-500", light: "bg-amber-50 text-amber-900 border-amber-200", pct: s.elements["토"] || 0 },
        { name: "금(金)", key: "금", color: "bg-slate-400", light: "bg-slate-50 text-slate-900 border-slate-200", pct: s.elements["금"] || 0 },
        { name: "수(水)", key: "수", color: "bg-sky-500", light: "bg-sky-50 text-sky-900 border-sky-200", pct: s.elements["수"] || 0 }
      ];

      box.innerHTML = `
        <div class="space-y-3 font-serif-kr">
          <div class="flex items-center justify-between pb-1 border-b border-stone-200">
            <span class="font-bold text-stone-900 text-sm">☯ 5대 오행 분포 & 사주 체질</span>
            <span class="text-xs text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">체질: ${safe(s.strengthStatus)} (${s.strengthScore || 50}점)</span>
          </div>

          <!-- 5대 오행 비율 게이지 바 -->
          <div class="grid grid-cols-5 gap-1.5 text-center font-sans">
            ${elMap.map(el => `
              <div class="p-2 rounded-xl border ${el.light}">
                <span class="text-[10px] font-bold block">${el.name}</span>
                <strong class="text-sm font-black block my-0.5">${el.pct}%</strong>
                <div class="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div class="${el.color} h-full" style="width: ${el.pct}%;"></div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- 신강/신약 체질 상세 총평 -->
          <div class="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-sans space-y-1">
            <strong class="text-stone-900 font-serif-kr font-bold block">⚖️ 체질 종합 판정:</strong>
            <p class="text-[11px] text-stone-700 leading-relaxed">${safe(s.strengthDesc)}</p>
          </div>

          <!-- 결핍된 오행 개운 처방 -->
          ${s.missingElements && s.missingElements.length > 0 ? `
          <div class="space-y-1.5 pt-1">
            <span class="font-bold text-stone-900 text-xs">💧 결핍된 오행 분석 & 맞춤 개운 비책:</span>
            <div class="space-y-1.5 text-xs font-sans">
              ${s.missingElements.map(m => `
                <div class="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-amber-950 font-bold font-serif-kr text-xs">${safe(m.name)} 기운 결핍</strong>
                    <span class="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-bold">보완 필요</span>
                  </div>
                  <p class="text-[11px] text-stone-600 leading-relaxed">${safe(m.desc)}</p>
                  <p class="text-[11px] text-emerald-800 font-medium">🌿 <strong>생활 개운법:</strong> ${safe(m.remedy)}</p>
                </div>
              `).join("")}
            </div>
          </div>
          ` : `
          <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-sans">
            🎉 <strong>오행구족(五行具足):</strong> 사주 원국에 5가지 오행이 모두 고르게 분포하여 한쪽으로 치우침이 없는 원만한 조화를 이루고 있습니다.
          </div>
          `}

          <!-- 없는 십신 특화 잠재력 카드 -->
          ${s.missingTenGods && s.missingTenGods.length > 0 ? `
          <div class="space-y-1.5 pt-1">
            <span class="font-bold text-stone-900 text-xs">🌟 없는 십신(十神)의 숨겨진 잠재력:</span>
            <div class="space-y-1.5 text-xs font-sans">
              ${s.missingTenGods.map(tg => `
                <div class="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-stone-900 font-bold text-xs font-serif-kr">${safe(tg.title)}</strong>
                    <span class="text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded font-bold">특수 재능</span>
                  </div>
                  <p class="text-[11px] text-stone-700 leading-relaxed">${safe(tg.desc)}</p>
                </div>
              `).join("")}
            </div>
          </div>
          ` : ''}

          <!-- 수호 용신 처방 소견 -->
          <div class="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-xs font-sans space-y-1">
            <div class="flex items-center justify-between pb-1 border-b border-amber-200">
              <span class="font-bold text-amber-950 font-serif-kr text-xs">🛡️ 내 인생의 수호 용신(用神): ${safe(s.yongsin)}</span>
              <span class="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">최고의 길신</span>
            </div>
            <p class="text-[11px] text-stone-700 leading-relaxed pt-0.5">${safe(s.yongsinDesc)}</p>
          </div>
        </div>
      `;
    } else if (tab === "sinsal") {
      if (!s || !s.sinsal || s.sinsal.length === 0) {
        box.innerHTML = `<div class="text-stone-500 py-6 text-center">신살 데이터가 없거나 평온한 사주 원국입니다.</div>`;
        return;
      }
      box.innerHTML = `
        <div class="space-y-2.5 font-serif-kr">
          <div class="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span class="font-bold text-stone-900 text-sm">🔮 사주 8대 핵심 신살(神煞) 분석</span>
            <span class="text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">${s.sinsal.length}개 신살 보유</span>
          </div>
          <div class="space-y-2">
            ${s.sinsal.map(sal => {
              const isGood = sal.type && (sal.type.includes("길") || sal.type.includes("귀인") || sal.type.includes("복"));
              return `
                <div class="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <strong class="text-sm font-black ${isGood ? 'text-[#8c1d1d]' : 'text-stone-900'}">${safe(sal.name)}</strong>
                    <div class="space-x-1">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">${safe(sal.type)}</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 text-stone-700 font-bold">${safe(sal.position)}</span>
                    </div>
                  </div>
                  <p class="text-[11px] text-stone-700 font-sans leading-relaxed pt-0.5">${safe(sal.modern || sal.desc)}</p>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    } else if (tab === "future") {
      if (!s) {
        box.innerHTML = `<div class="text-stone-500 py-6 text-center">미래 전략 데이터가 없습니다.</div>`;
        return;
      }
      const careerAdvice = s.iljuDetail.careerAdvice || `전문직, 기획, IT 플랫폼, 미디어 및 [${s.yongsin}] 오행 관련 특화 산업 분야에서 큰 두각을 나타냅니다.`;
      const wealthAdvice = s.iljuDetail.wealthAdvice || `${s.userInfo.name} 님의 사주는 ${s.iljuDetail.wealthStyle}`;
      const riskText = s.isSinGang ?
        "신강(身强) 사주는 주체성과 결단력이 뛰어나지만, 과도한 자신감으로 인한 무리한 레버리지 투자나 지인과의 보증·동업 갈등을 가장 경계해야 합니다. 현금 유동성을 항상 30% 이상 확보하고 분산 투자를 원칙으로 삼으세요." :
        "신약(身弱) 사주는 세밀한 분석력과 신중함이 돋보이나, 귀가 얇아지거나 불안감에 쫓겨 고점 매수·손절매를 반복할 위험이 있습니다. 독단적 판단보다는 공신력 있는 금융 상품과 우량 배당 자산 중심의 안정형 포트폴리오를 유지하세요.";

      box.innerHTML = `
        <div class="space-y-3 font-serif-kr">
          <!-- 미래 인생 나침반 -->
          <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5">
            <span class="font-bold text-amber-950 text-sm block">🧭 미래 인생 나침반 (용신 기반 최적 행로)</span>
            <p class="text-[11px] text-stone-700 font-sans leading-relaxed">${safe(s.compass ? s.compass.actionPlan : "당신의 수호 용신 에너지를 적극 활용하여 장기적인 전문성과 주도성을 확보하세요.")}</p>
          </div>

          <!-- 10년 대운으로 보는 3대 도약 타이밍 -->
          <div class="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2 font-sans">
            <span class="font-bold text-indigo-950 font-serif-kr text-sm block">🚀 10년 대운으로 보는 3대 도약 타이밍</span>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div class="p-2 rounded-lg bg-white border border-indigo-100">
                <strong class="text-indigo-900 block text-xs">1차 도약기 (${s.daeunList && s.daeunList[1] ? s.daeunList[1].startAge : 17}~${s.daeunList && s.daeunList[1] ? s.daeunList[1].endAge : 26}세)</strong>
                <p class="text-[10px] text-stone-600 mt-0.5">전문 역량의 토대를 닦고 독자적인 커리어 발판을 단단히 다지는 결정적 시기</p>
              </div>
              <div class="p-2 rounded-lg bg-white border border-indigo-100">
                <strong class="text-indigo-900 block text-xs">2차 황금기 (${s.daeunList && s.daeunList[2] ? s.daeunList[2].startAge : 27}~${s.daeunList && s.daeunList[2] ? s.daeunList[2].endAge : 36}세)</strong>
                <p class="text-[10px] text-stone-600 mt-0.5">인생 최대의 에너지와 기회가 결합하여 폭발적인 성취와 명예를 획득하는 전성기</p>
              </div>
              <div class="p-2 rounded-lg bg-white border border-indigo-100">
                <strong class="text-indigo-900 block text-xs">3차 수확기 (${s.daeunList && s.daeunList[3] ? s.daeunList[3].startAge : 37}~${s.daeunList && s.daeunList[3] ? s.daeunList[3].endAge : 46}세)</strong>
                <p class="text-[10px] text-stone-600 mt-0.5">구축된 자산과 네트워크를 바탕으로 풍요로운 결실을 거두고 시스템을 완성하는 시기</p>
              </div>
            </div>
          </div>

          <!-- 경계해야 할 함정과 방패 전략 -->
          <div class="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-sans space-y-1">
            <strong class="text-rose-950 font-serif-kr block">🛡️ 인생에서 경계해야 할 함정과 방패 전략:</strong>
            <p class="text-[11px] text-stone-700 leading-relaxed">${safe(s.compass ? s.compass.trapAndShield : s.iljuDetail.caution)}</p>
          </div>

          <!-- 자산 증식 스타일 & 직업군 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
            <div class="p-2.5 rounded-lg bg-white border border-stone-200">
              <strong class="text-amber-950 block font-bold mb-0.5">💰 자산 증식 스타일:</strong>
              <p class="text-[11px] text-stone-600 leading-relaxed">${safe(s.iljuDetail.wealthStyle)}</p>
            </div>
            <div class="p-2.5 rounded-lg bg-white border border-stone-200">
              <strong class="text-stone-900 block font-bold mb-0.5">💼 적성 직업군 & 천직:</strong>
              <p class="text-[11px] text-stone-600 leading-relaxed">${safe(careerAdvice)}</p>
            </div>
          </div>

          <!-- ⚠️ 투자 주의 리스크 관리 & 자산 방어 전략 -->
          <div class="p-2.5 rounded-lg bg-amber-50/90 border border-amber-300 text-xs font-sans space-y-1">
            <strong class="text-amber-950 font-serif-kr block font-bold">⚠️ 평생 재물 & 투자 리스크 관리 지침:</strong>
            <p class="text-[11px] text-stone-700 leading-relaxed">${safe(wealthAdvice)} ${riskText}</p>
          </div>
        </div>
      `;
    } else if (tab === "tarot") {
      const cards = this.tarotPickedCards || [];
      if (cards.length === 0) {
        box.innerHTML = `
          <div class="p-6 text-center text-stone-600 space-y-2 font-serif-kr bg-white rounded-xl border border-dashed border-stone-300">
            <span class="text-3xl block">🎴</span>
            <strong class="text-sm text-stone-800 block">선택된 타로 카드가 없습니다.</strong>
            <p class="text-xs text-stone-500 font-sans leading-relaxed">
              상단 메뉴의 <strong>'🃏 3-Card 타로'</strong>에서 카드를 3장 뽑으시면<br>
              현실 직시 팩트 점괘와 과거·현재·미래 스토리 분석이 서책에 함께 포함됩니다.
            </p>
          </div>
        `;
        return;
      }
      const posNames = ["과거 (Past / 원인과 배경)", "현재 (Present / 뼈아픈 직언)", "미래 (Future / 현실적 결말)"];
      box.innerHTML = `
        <div class="space-y-2.5 font-serif-kr">
          <div class="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span class="font-bold text-stone-900 text-sm">🃏 3-Card 대화형 타로 점괘 심층 리딩</span>
            <span class="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">과거·현재·미래 스프레드</span>
          </div>
          <div class="space-y-2">
            ${cards.map((cObj, idx) => {
              const c = cObj ? (cObj.card || cObj) : {};
              const nameKr = c.nameKr || c.name_kr || c.name || `타로 카드 ${idx + 1}`;
              const nameEn = c.name || c.nameEn || c.name_en || "";
              const displayName = (nameKr.includes("(") || !nameEn) ? nameKr : `${nameKr} (${nameEn})`;
              const summary = c.summary || c.interpretation || "현재 흐름을 직시하고 근본적인 원인을 돌아보세요.";
              const advice = c.generalAdvice || c.advice || c.loveAdvice || c.moneyAdvice || c.careerAdvice || "현실을 냉정히 분석하고 기본에 충실하세요.";
              const realityCheck = c.realityCheck || "";
              const keywords = Array.isArray(c.keywords) ? c.keywords : (c.theme ? c.theme.split(",").map(x => x.trim()) : []);
              const isReversed = !!c.isReversed;

              return `
                <div class="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-stone-500 font-bold">${posNames[idx] || `카드 ${idx+1}`}</span>
                      <strong class="text-sm font-black text-[#8c1d1d] ml-1.5">${safe(displayName)}</strong>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isReversed ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">${isReversed ? '🔄 역방향' : '⬆ 정방향'}</span>
                  </div>
                  ${keywords.length > 0 ? `
                  <div class="flex flex-wrap gap-1 font-sans text-[10px]">
                    ${keywords.map(kw => `<span class="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">#${safe(kw)}</span>`).join("")}
                  </div>
                  ` : ''}
                  <p class="text-[11px] text-stone-700 font-sans leading-relaxed pt-0.5">${safe(summary)}</p>
                  ${realityCheck ? `<p class="text-[11px] text-stone-600 font-sans italic bg-stone-50 p-1.5 rounded">⚡ <strong>현실 팩트 체크:</strong> ${safe(realityCheck)}</p>` : ''}
                  <div class="p-2 rounded bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 font-sans font-medium">
                    💡 <strong>실천 조언:</strong> ${safe(advice)}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    } else if (tab === "ai") {
      const logs = this.aiChatHistory || [];
      if (logs.length === 0) {
        box.innerHTML = `
          <div class="text-stone-600 text-center py-6 space-y-2 font-serif-kr">
            <span class="text-2xl">🧙‍♂️</span>
            <p class="font-bold text-stone-800 text-xs">아직 AI 도사와의 상담 이력이 없습니다.</p>
            <p class="text-[11px] text-stone-500 font-sans">우측 상단 <strong>'🧙‍♂️ AI 명리·꿈해몽 도사'</strong> 챗봇에서 질문을 남기시면 문답 전문이 서책에 함께 포함됩니다.</p>
          </div>
        `;
        return;
      }
      box.innerHTML = `
        <div class="space-y-2.5 font-serif-kr">
          <div class="flex items-center justify-between pb-1.5 border-b border-stone-200">
            <span class="font-bold text-stone-900 text-sm">🧙‍♂️ AI 명리·꿈해몽 도사 실시간 상담록</span>
            <span class="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">총 ${logs.length}건 기록</span>
          </div>
          <div class="space-y-2 text-xs font-sans">
            ${logs.map((chat, idx) => `
              <div class="p-2.5 rounded-xl ${chat.role === 'user' ? 'bg-amber-50/60 border border-amber-200 text-amber-950' : 'bg-white border border-stone-200 text-stone-800'} space-y-1">
                <div class="flex items-center justify-between text-[10px] font-bold">
                  <span class="${chat.role === 'user' ? 'text-amber-900' : 'text-stone-600'}">${chat.role === 'user' ? '🙋‍♂️ 내 질문' : '🧙‍♂️ AI 도사의 처방'}</span>
                  <span class="text-stone-400 font-mono">${chat.time || ''}</span>
                </div>
                <p class="text-[11px] leading-relaxed whitespace-pre-wrap">${safe(chat.text)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }
  },

  copyCategorizedText() {
    if (!this.userSaju && !this.dailyFortune) return;
    const s = this.userSaju;
    const f = this.dailyFortune;
    const lines = [];

    const getTenGodName = (tg) => {
      if (!tg) return "-";
      if (typeof tg === "string") return tg.split("(")[0];
      return tg.name || tg.hanja || "-";
    };

    const TWELVE_STAGES_TABLE = {
      "갑": { "해": "장생", "자": "목욕", "축": "관대", "인": "건록", "묘": "제왕", "진": "쇠", "사": "병", "오": "사", "미": "묘", "신": "절", "유": "태", "술": "양" },
      "을": { "오": "장생", "사": "목욕", "진": "관대", "묘": "건록", "인": "제왕", "축": "쇠", "자": "병", "해": "사", "술": "묘", "유": "절", "신": "태", "미": "양" },
      "병": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "정": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "무": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "기": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "경": { "사": "장생", "오": "목욕", "미": "관대", "신": "건록", "유": "제왕", "술": "쇠", "해": "병", "자": "사", "축": "묘", "인": "절", "묘": "태", "진": "양" },
      "신": { "자": "장생", "해": "목욕", "술": "관대", "유": "건록", "신": "제왕", "미": "쇠", "오": "병", "사": "사", "진": "묘", "묘": "절", "인": "태", "축": "양" },
      "임": { "신": "장생", "유": "목욕", "술": "관대", "해": "건록", "자": "제왕", "축": "쇠", "인": "병", "묘": "사", "진": "묘", "사": "절", "오": "태", "미": "양" },
      "계": { "묘": "장생", "인": "목욕", "축": "관대", "자": "건록", "해": "제왕", "술": "쇠", "유": "병", "신": "사", "미": "묘", "오": "절", "사": "태", "진": "양" }
    };
    const getPillarStage = (dayGanChar, jiChar) => {
      if (!dayGanChar || !jiChar) return "-";
      return (TWELVE_STAGES_TABLE[dayGanChar] && TWELVE_STAGES_TABLE[dayGanChar][jiChar]) || "-";
    };

    lines.push(`=======================================================`);
    lines.push(`  천명(天命) 프리미엄 사주 & 오늘의 운세 리포트`);
    lines.push(`=======================================================`);
    if (s) {
      lines.push(`• 이름: ${s.userInfo.name} (${s.userInfo.genderKr})`);
      lines.push(`• 양력 생년월일: ${s.userInfo.solarDateString}`);
      lines.push(`• 음력 생년월일: ${s.userInfo.lunarDate ? `${s.userInfo.lunarDate.year}년 ${s.userInfo.lunarDate.month}월 ${s.userInfo.lunarDate.day}일` : "-"}`);
      lines.push(`• 60갑자 일주: ${s.iljuDetail.name} (${s.iljuDetail.symbol})`);
      lines.push(``);
    }

    if (f && (document.getElementById("exportCatDaily")?.checked ?? true)) {
      lines.push(`[🌟 1. 오늘의 운세 (${f.dateString})]`);
      lines.push(`• 오늘의 일진: ${f.todayIljin ? f.todayIljin.name : ""} (${f.todayTenGod})`);
      lines.push(`• 종합 총운 점수: ${f.totalScore}점 (${f.totalScore >= 90 ? "대대길" : (f.totalScore >= 80 ? "대길" : "평온")})`);
      lines.push(`• 4대 세부 지수: 재물(${f.scores?.money || 85}%), 애정(${f.scores?.love || 88}%), 건강(${f.scores?.health || 90}%), 직업(${f.scores?.career || 92}%)`);
      lines.push(`• 핵심 테마: ${f.theme}`);
      lines.push(`• 총운 해설: ${f.summary}`);
      if (f.twelveStage) {
        lines.push(`• 12운성 일진 에너지: ${f.twelveStage.name}(${f.twelveStage.hanja}) · ${f.twelveStage.badge} (${f.twelveStage.power}점) - ${f.twelveStage.desc}`);
      }
      lines.push(`• 추천 행동: ${f.action || "-"}`);
      lines.push(`• 주의 행동: ${f.avoid || "-"}`);
      if (f.lucky) {
        lines.push(`• 행운 아이템: 컬러(${f.lucky.color}), 번호(${f.lucky.numbers}), 방위(${f.lucky.direction}), 추천 음식(${f.lucky.food})`);
      }
      const mascot = this.currentMascot || (window.ZODIAC_MASCOTS && s && s.pillars ? window.ZODIAC_MASCOTS[s.pillars.year.ji.char] : null);
      if (mascot) {
        lines.push(`• 12지신 수호 파트너: ${mascot.name} (${mascot.emoji}) - "${mascot.greeting}"`);
      }
      const hourlyList = (f.hourlyFlow && f.hourlyFlow.length > 0) ? f.hourlyFlow : [];
      if (hourlyList.length > 0) {
        lines.push(`• 시간대별 일진 리듬:`);
        hourlyList.forEach(slot => {
          lines.push(`  - ${slot.time}: [${slot.status}] ${slot.tenGodBadge} | ${slot.desc}`);
        });
      }
      lines.push(``);
    }

    if (s && (document.getElementById("exportCatSaju")?.checked ?? true)) {
      const p = s.pillars;
      lines.push(`[📜 2. 사주 원국 (四柱八字) 만세력]`);
      lines.push(`• 시주(時柱): ${p.time ? `${p.time.gan.char}${p.time.ji.char} (${getTenGodName(p.time.tenGodGan)}, 12운성: ${getPillarStage(p.day.gan.char, p.time.ji.char)})` : "모름"}`);
      lines.push(`• 일주(日柱): ${p.day.gan.char}${p.day.ji.char} (★나의본원, 12운성: ${getPillarStage(p.day.gan.char, p.day.ji.char)})`);
      lines.push(`• 월주(月柱): ${p.month.gan.char}${p.month.ji.char} (${getTenGodName(p.month.tenGodGan)}, 12운성: ${getPillarStage(p.day.gan.char, p.month.ji.char)})`);
      lines.push(`• 년주(年柱): ${p.year.gan.char}${p.year.ji.char} (${getTenGodName(p.year.tenGodGan)}, 12운성: ${getPillarStage(p.day.gan.char, p.year.ji.char)})`);
      lines.push(``);
      lines.push(`• 60갑자 일주론 심층 분석:`);
      lines.push(`  - 본원 성향: ${s.iljuDetail.desc}`);
      lines.push(`  - 타고난 강점: ${s.iljuDetail.strength}`);
      lines.push(`  - 주의할 점: ${s.iljuDetail.caution}`);
      lines.push(`  - 연애 스타일: ${s.iljuDetail.loveStyle}`);
      lines.push(`  - 재물 스타일: ${s.iljuDetail.wealthStyle}`);
      if (s.blessingPoints && s.blessingPoints.length > 0) {
        lines.push(`• 내 사주가 특별히 좋은 이유 3가지 (3대 복록):`);
        s.blessingPoints.forEach((pt, idx) => {
          lines.push(`  ${idx + 1}) ${pt.title}: ${pt.desc}`);
        });
      }
      if (s.daeunList && s.daeunList.length > 0) {
        lines.push(`• 10년 주기 대운 흐름 (${s.isForward ? '순행' : '역행'}, 대운수 ${s.daeunNumber || 1}):`);
        s.daeunList.forEach(d => {
          lines.push(`  - ${d.startAge}~${d.endAge}세: ${d.ganChar}${d.jiChar} (${getTenGodName(d.tenGod)})`);
        });
      }
      lines.push(``);
    }

    if (s && (document.getElementById("exportCatElements")?.checked ?? true)) {
      lines.push(`[☯ 3. 오행 밸런스 & 용신 처방]`);
      lines.push(`• 5대 오행 비율: 목(${s.elements["목"] || 0}%), 화(${s.elements["화"] || 0}%), 토(${s.elements["토"] || 0}%), 금(${s.elements["금"] || 0}%), 수(${s.elements["수"] || 0}%)`);
      lines.push(`• 체질 판정: ${s.strengthStatus} (${s.strengthScore || 50}점) - ${s.strengthDesc}`);
      if (s.missingElements && s.missingElements.length > 0) {
        lines.push(`• 결핍된 오행 처방:`);
        s.missingElements.forEach(m => {
          lines.push(`  - ${m.name}: ${m.desc} (처방: ${m.remedy})`);
        });
      } else {
        lines.push(`• 결핍된 오행: 없음 (오행구족의 조화로운 사주)`);
      }
      if (s.missingTenGods && s.missingTenGods.length > 0) {
        lines.push(`• 없는 십신의 잠재력:`);
        s.missingTenGods.forEach(tg => {
          lines.push(`  - ${tg.title}: ${tg.desc}`);
        });
      }
      lines.push(`• 수호 용신(用神): [${s.yongsin}] - ${s.yongsinDesc}`);
      lines.push(``);
    }

    if (s && s.sinsal && (document.getElementById("exportCatSinsal")?.checked ?? true)) {
      lines.push(`[🔮 4. 8대 핵심 신살]`);
      s.sinsal.forEach(sal => {
        lines.push(`• ${sal.name} (${sal.type}, 위치: ${sal.position}): ${sal.modern || sal.desc}`);
      });
      lines.push(``);
    }

    if (s && (document.getElementById("exportCatFuture")?.checked ?? true)) {
      lines.push(`[🧭 5. 미래 진로 & 평생 재물 전략]`);
      lines.push(`• 천직 및 직업 적성: ${s.iljuDetail.careerAdvice || `전문직, 기획, IT 플랫폼, 미디어 및 [${s.yongsin}] 오행 관련 특화 산업 분야`}`);
      lines.push(`• 평생 재물 및 투자 전략: ${s.iljuDetail.wealthAdvice || s.iljuDetail.wealthStyle}`);
      lines.push(`• 자산 증식 스타일: ${s.isSinGang ? "추진력과 주체성을 바탕으로 규모 있는 부를 일구는 사업·투자형" : "정밀한 분석과 안정적인 전문 라이선스를 기반으로 실속 있는 알짜배기 자산 축적"}`);
      if (s.daeunList && s.daeunList.length >= 3) {
        lines.push(`• 10년 대운으로 보는 3대 도약 타이밍:`);
        lines.push(`  1) 1차 도약기 (${s.daeunList[1]?.startAge || s.daeunList[0]?.startAge}~${s.daeunList[1]?.endAge || s.daeunList[0]?.endAge}세): 전문성 연마와 핵심 발판 마련`);
        lines.push(`  2) 2차 황금기 (${s.daeunList[2]?.startAge || s.daeunList[1]?.startAge}~${s.daeunList[2]?.endAge || s.daeunList[1]?.endAge}세): 인생 최고의 역량 발휘와 재정적 확장`);
        lines.push(`  3) 3차 수확기 (${s.daeunList[3]?.startAge || s.daeunList[2]?.startAge}~${s.daeunList[3]?.endAge || s.daeunList[2]?.endAge}세): 결실의 완성과 풍요로운 시스템 구축`);
      }
      lines.push(`• 인생에서 경계할 함정과 방패: ${s.compass?.trapAndShield || s.iljuDetail.caution}`);
      lines.push(``);
    }

    const cards = this.tarotPickedCards || [];
    if (cards.length > 0 && (document.getElementById("exportCatTarot")?.checked ?? true)) {
      const posNames = ["과거(Past)", "현재(Present)", "미래(Future)"];
      lines.push(`[🃏 6. 3-Card 대화형 타로 점괘]`);
      cards.forEach((cObj, idx) => {
        const c = cObj ? (cObj.card || cObj) : {};
        const nameKr = c.nameKr || c.name_kr || c.name || `타로 카드 ${idx + 1}`;
        const nameEn = c.name || c.nameEn || c.name_en || "";
        const summary = c.summary || c.interpretation || "";
        const advice = c.generalAdvice || c.advice || c.loveAdvice || "";
        lines.push(`• [${posNames[idx] || `카드 ${idx+1}`}] ${displayName} - ${c.isReversed ? '역방향' : '정방향'}`);
        if (summary) lines.push(`  - 점괘 해설: ${summary}`);
        if (advice) lines.push(`  - 실천 조언: ${advice}`);
      });
      lines.push(``);
    }

    const aiLogs = this.aiChatHistory || [];
    if (aiLogs.length > 0 && (document.getElementById("exportCatAi")?.checked ?? true)) {
      lines.push(`[🧙‍♂️ 7. AI 명리·꿈해몽 도사 1:1 상담 대화록]`);
      aiLogs.forEach((item, idx) => {
        lines.push(`[#${idx + 1} ${item.role === 'user' ? '도반 질문' : 'AI 도사 처방'}] (${item.time || ''})`);
        lines.push(`${item.text}`);
        lines.push(``);
      });
    }

    lines.push(`=======================================================`);
    lines.push(`  자료 제공: 천명(天命) AI 운세 & 명리 포털`);
    lines.push(`=======================================================`);

    const fullText = lines.join("\n");
    navigator.clipboard.writeText(fullText).then(() => {
      alert("📋 선택하신 모든 카테고리의 상세 자료가 클립보드에 복사되었습니다!\n원하시는 곳(메모장, 카카오톡 등)에 붙여넣기(Ctrl+V) 하세요.");
    }).catch(err => {
      console.error(err);
      alert("클립보드 복사 중 오류가 발생했습니다.");
    });
  },

  downloadInteractiveReportHtml() {
    if (!this.userSaju && !this.dailyFortune && (!this.tarotPickedCards || this.tarotPickedCards.length === 0)) {
      alert("내보낼 운세/사주 데이터가 없습니다.");
      return;
    }

    const s = this.userSaju;
    const f = this.dailyFortune;
    const name = s ? s.userInfo.name : (this.currentAccount ? this.currentAccount.name : "고객");
    const todayStr = f ? f.dateString : new Date().toLocaleDateString("ko-KR");
    const cards = this.tarotPickedCards || [];
    const aiLogs = this.aiChatHistory || [];

    const safeStr = (val, def = "-") => (val !== undefined && val !== null && val !== "") ? String(val).replace(/</g, "&lt;").replace(/>/g, "&gt;") : def;
    const getTenGodName = (tg) => {
      if (!tg) return "-";
      if (typeof tg === "string") return tg.split("(")[0];
      return tg.name || tg.hanja || "-";
    };

    const TWELVE_STAGES_TABLE = {
      "갑": { "해": "장생", "자": "목욕", "축": "관대", "인": "건록", "묘": "제왕", "진": "쇠", "사": "병", "오": "사", "미": "묘", "신": "절", "유": "태", "술": "양" },
      "을": { "오": "장생", "사": "목욕", "진": "관대", "묘": "건록", "인": "제왕", "축": "쇠", "자": "병", "해": "사", "술": "묘", "유": "절", "신": "태", "미": "양" },
      "병": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "정": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "무": { "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절", "자": "태", "축": "양" },
      "기": { "유": "장생", "신": "목욕", "미": "관대", "오": "건록", "사": "제왕", "진": "쇠", "묘": "병", "인": "사", "축": "묘", "자": "절", "해": "태", "술": "양" },
      "경": { "사": "장생", "오": "목욕", "미": "관대", "신": "건록", "유": "제왕", "술": "쇠", "해": "병", "자": "사", "축": "묘", "인": "절", "묘": "태", "진": "양" },
      "신": { "자": "장생", "해": "목욕", "술": "관대", "유": "건록", "신": "제왕", "미": "쇠", "오": "병", "사": "사", "진": "묘", "묘": "절", "인": "태", "축": "양" },
      "임": { "신": "장생", "유": "목욕", "술": "관대", "해": "건록", "자": "제왕", "축": "쇠", "인": "병", "묘": "사", "진": "묘", "사": "절", "오": "태", "미": "양" },
      "계": { "묘": "장생", "인": "목욕", "축": "관대", "자": "건록", "해": "제왕", "술": "쇠", "유": "병", "신": "사", "미": "묘", "오": "절", "사": "태", "진": "양" }
    };
    const getPillarStage = (dayGanChar, jiChar) => {
      if (!dayGanChar || !jiChar) return "-";
      return (TWELVE_STAGES_TABLE[dayGanChar] && TWELVE_STAGES_TABLE[dayGanChar][jiChar]) || "-";
    };

    const incDaily = !!f && (document.getElementById("exportCatDaily")?.checked ?? true);
    const incSaju = !!s && (document.getElementById("exportCatSaju")?.checked ?? true);
    const incElements = !!s && (document.getElementById("exportCatElements")?.checked ?? true);
    const incSinsal = !!s && (document.getElementById("exportCatSinsal")?.checked ?? true);
    const incFuture = !!s && (document.getElementById("exportCatFuture")?.checked ?? true);
    const incTarot = cards.length > 0 && (document.getElementById("exportCatTarot")?.checked ?? true);
    const incAi = aiLogs.length > 0 && (document.getElementById("exportCatAi")?.checked ?? true);

    const navCategories = [];
    if (incDaily) navCategories.push({ id: "daily", name: "🌟 오늘의 운세" });
    if (incSaju) navCategories.push({ id: "saju", name: "📜 사주 원국 (4주8자)" });
    if (incElements) navCategories.push({ id: "elements", name: "☯ 오행 & 용신 처방" });
    if (incSinsal) navCategories.push({ id: "sinsal", name: "🔮 8대 신살 해설" });
    if (incFuture) navCategories.push({ id: "future", name: "🧭 미래 & 재물 전략" });
    if (incTarot) navCategories.push({ id: "tarot", name: "🃏 3-Card 타로 점괘" });
    if (incAi) navCategories.push({ id: "ai", name: "🧙‍♂️ AI 도사 상담록" });

    if (navCategories.length === 0) {
      alert("최소 1개 이상의 카테고리를 선택해주세요.");
      return;
    }

    const firstCatId = navCategories[0].id;
    const mascot = this.currentMascot || (window.ZODIAC_MASCOTS && s && s.pillars ? window.ZODIAC_MASCOTS[s.pillars.year.ji.char] : null) || {
      emoji: "🐲", name: "청룡이", greeting: "희망찬 푸른 기운이 가득한 날이야!", quotes: ["스스로를 믿고 당당하게 나아가봐! 🌟"]
    };

    const hourlyList = (f && f.hourlyFlow && f.hourlyFlow.length > 0) ? f.hourlyFlow : [
      { time: "아침 (07:00 ~ 11:00)", tenGodBadge: "정관의 기운", status: "순조(平)", desc: "정갈한 마음가짐으로 하루의 우선순위를 정하고 집중하기 좋은 시간입니다." },
      { time: "오후 (11:00 ~ 17:00)", tenGodBadge: "정재의 기운", status: "최고조(大吉)", desc: "업무 추진력과 결실이 배가되는 시간으로 중요한 협상과 실행에 최적입니다." },
      { time: "저녁 (17:00 ~ 21:00)", tenGodBadge: "식신의 기운", status: "순조(平)", desc: "좋은 사람들과 맛있는 음식을 나누며 따뜻한 대화를 이어가기 좋습니다." },
      { time: "밤 (21:00 ~ 익일 07:00)", tenGodBadge: "정인의 기운", status: "안정(吉)", desc: "차분하게 사색하고 내면의 에너지를 충전하며 내일을 준비하세요." }
    ];

    const careerAdvice = (s && s.iljuDetail) ? (s.iljuDetail.careerAdvice || `전문직, 기획, IT 플랫폼, 미디어 및 [${s.yongsin}] 오행 관련 특화 산업 분야에서 큰 두각을 나타냅니다.`) : "-";
    const wealthAdvice = (s && s.iljuDetail) ? (s.iljuDetail.wealthAdvice || `${s.userInfo.name} 님의 사주는 ${s.iljuDetail.wealthStyle}`) : "-";
    const riskText = (s && s.isSinGang) ?
      "신강(身强) 사주는 주체성과 결단력이 뛰어나지만, 과도한 자신감으로 인한 무리한 레버리지 투자나 지인과의 보증·동업 갈등을 가장 경계해야 합니다. 현금 유동성을 항상 30% 이상 확보하고 분산 투자를 원칙으로 삼으세요." :
      "신약(身弱) 사주는 세밀한 분석력과 신중함이 돋보이나, 귀가 얇아지거나 불안감에 쫓겨 고점 매수·손절매를 반복할 위험이 있습니다. 독단적 판단보다는 공신력 있는 금융 상품과 우량 배당 자산 중심의 안정형 포트폴리오를 유지하세요.";

    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>천명(天命) 인터랙티브 명리 서책 - ${safeStr(name)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Pretendard:wght@300;400;500;600;700;800&display=swap');

    :root {
      --bg-paper: #fcf9f2;
      --dancheong-red: #8c1d1d;
      --dancheong-red-dark: #6b1515;
      --dancheong-gold: #c59b27;
      --dancheong-gold-light: #f5eed9;
      --dancheong-blue: #1e3a5f;
      --dancheong-green: #1b4d3e;
      --border-ink: #e3d5be;
      --text-main: #231710;
      --text-muted: #6b5c50;
      --card-bg: #ffffff;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
      background-color: var(--bg-paper);
      color: var(--text-main);
      line-height: 1.6;
      background-image: radial-gradient(#eadbc5 1px, transparent 1px);
      background-size: 20px 20px;
      padding-bottom: 60px;
    }

    .font-serif { font-family: 'Noto Serif KR', serif; }

    .header-banner {
      background: linear-gradient(135deg, #1f140e 0%, #3a1a14 50%, #1f140e 100%);
      color: #f7eedc;
      padding: 30px 20px 24px;
      text-align: center;
      border-bottom: 4px solid var(--dancheong-gold);
      position: relative;
    }
    .header-banner::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, var(--dancheong-red), var(--dancheong-gold), var(--dancheong-green), var(--dancheong-blue));
    }
    .header-title {
      font-family: 'Noto Serif KR', serif;
      font-size: 26px;
      font-weight: 900;
      color: #fce8bd;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .header-sub {
      font-size: 13px;
      color: #d6c0a0;
      font-weight: 500;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 20px;
    }

    .user-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.1);
      padding: 6px 14px;
      border-radius: 9999px;
      margin-top: 10px;
      font-size: 12px;
      border: 1px solid rgba(197, 155, 39, 0.4);
    }

    .nav-bar-container {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(252, 249, 242, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border-ink);
      padding: 10px 0;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .nav-tabs {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
      max-width: 860px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .nav-tabs::-webkit-scrollbar { display: none; }
    .tab-btn {
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      border: 1px solid var(--border-ink);
      background: #ffffff;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      font-family: 'Noto Serif KR', serif;
    }
    .tab-btn:hover {
      background: #f5ede0;
      color: var(--text-main);
    }
    .tab-btn.active {
      background: var(--dancheong-red);
      color: #fff6df;
      border-color: var(--dancheong-red-dark);
      box-shadow: 0 2px 6px rgba(140, 29, 29, 0.25);
    }

    .view-control {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      max-width: 860px;
      margin: 0 auto 12px;
      padding: 0 20px;
    }
    .control-btn {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid var(--border-ink);
      background: #fff;
      color: var(--text-muted);
      cursor: pointer;
    }
    .control-btn:hover { background: #f5ede0; color: #000; }

    .category-section {
      display: none;
      background: var(--card-bg);
      border: 1px solid var(--border-ink);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      animation: fadeIn 0.3s ease;
    }
    .category-section.active-panel { display: block; }
    body.show-all .category-section { display: block !important; margin-bottom: 30px; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cat-title {
      font-family: 'Noto Serif KR', serif;
      font-size: 18px;
      font-weight: 900;
      color: var(--dancheong-red);
      border-bottom: 2px solid var(--dancheong-gold-light);
      padding-bottom: 10px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      font-family: 'Pretendard', sans-serif;
    }

    .card-box {
      border: 1px solid var(--border-ink);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 12px;
      background: #fff;
    }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

    table.saju-tbl {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      margin-bottom: 14px;
      font-size: 13px;
    }
    table.saju-tbl th, table.saju-tbl td {
      border: 1px solid var(--border-ink);
      padding: 8px 4px;
    }
    table.saju-tbl th {
      background: #f7eedc;
      color: #4a3525;
      font-weight: 700;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border-ink);
    }

    @media print {
      .nav-bar-container, .view-control { display: none !important; }
      .category-section { display: block !important; page-break-inside: avoid; border: 1px solid #ccc; box-shadow: none; }
      body { background: #fff !important; }
    }
  </style>
</head>
<body>

  <header class="header-banner">
    <h1 class="header-title">천명(天命) 정통 사주 & 인터랙티브 디지털 서책</h1>
    <p class="header-sub">PDF의 한계를 뛰어넘어, 브라우저에서 카테고리별로 자유롭게 열람하는 독립형 운세 비결서</p>
    <div class="user-pill">
      <span>👤 <strong>${safeStr(name)}</strong> 도반</span>
      <span>|</span>
      <span>📅 ${safeStr(todayStr)}</span>
      ${s ? `<span>|</span><span>🧬 ${safeStr(s.iljuDetail ? s.iljuDetail.name : '')} (${safeStr(s.iljuDetail ? s.iljuDetail.symbol : '')})</span>` : ''}
    </div>
  </header>

  <!-- Navigation Bar (Sticky Tabs) -->
  <div class="nav-bar-container">
    <div class="nav-tabs">
      ${navCategories.map((c, idx) => `
        <button type="button" class="tab-btn ${idx === 0 ? 'active' : ''}" onclick="selectCategory('${c.id}', this)">${c.name}</button>
      `).join("")}
    </div>
  </div>

  <div class="view-control">
    <button type="button" class="control-btn" onclick="toggleAllView(this)"><span>📖 전체 한눈에 보기</span></button>
    <button type="button" class="control-btn" onclick="window.print()"><span>🖨️ 인쇄하기</span></button>
    <button type="button" class="control-btn" onclick="copyReportText()"><span>📋 텍스트 복사</span></button>
  </div>

  <div class="container">

    <!-- 1. 오늘의 운세 카테고리 -->
    ${incDaily ? `
    <section id="panel-daily" class="category-section ${firstCatId === 'daily' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>🌟 오늘의 정밀 운세 & 일진 분석 (${safeStr(f.dateString)})</span>
        <span class="badge" style="background:#fef3c7; color:#92400e;">${safeStr(f.todayIljin ? f.todayIljin.name : '')} (${safeStr(f.todayTenGod)})</span>
      </div>

      <div class="card-box" style="background: linear-gradient(to right, #fffbeb, #fef3c7); border-color: #fde68a;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h3 class="font-serif" style="font-size: 16px; font-weight: 800; color: #78350f;">${safeStr(f.theme)}</h3>
            <p style="font-size: 13px; color: #92400e; margin-top: 4px; line-height: 1.6;">${safeStr(f.summary)}</p>
          </div>
          <div style="text-align: right; margin-left: 14px;">
            <span style="font-size: 32px; font-weight: 900; color: #b45309; line-height: 1;">${f.totalScore}점</span>
            <span style="display: block; font-size: 11px; font-weight: 700; color: #b45309; margin-top: 2px;">${f.totalScore >= 90 ? "대대길(大大吉)" : (f.totalScore >= 80 ? "대길(大吉)" : "평온(平溫)")}</span>
          </div>
        </div>
      </div>

      <!-- 4대 운세 세부 지수 -->
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card-box" style="text-align: center; background: #fffbeb; padding: 10px;">
          <span style="font-size: 11px; color: #92400e; font-weight: 700; display: block;">💰 재물운</span>
          <strong style="font-size: 16px; color: #78350f;">${f.scores ? f.scores.money : 85}%</strong>
        </div>
        <div class="card-box" style="text-align: center; background: #fff1f2; padding: 10px;">
          <span style="font-size: 11px; color: #be123c; font-weight: 700; display: block;">💖 애정운</span>
          <strong style="font-size: 16px; color: #881337;">${f.scores ? f.scores.love : 88}%</strong>
        </div>
        <div class="card-box" style="text-align: center; background: #ecfdf5; padding: 10px;">
          <span style="font-size: 11px; color: #047857; font-weight: 700; display: block;">🌿 건강운</span>
          <strong style="font-size: 16px; color: #064e3b;">${f.scores ? f.scores.health : 90}%</strong>
        </div>
        <div class="card-box" style="text-align: center; background: #f0f9ff; padding: 10px;">
          <span style="font-size: 11px; color: #0369a1; font-weight: 700; display: block;">💼 직업운</span>
          <strong style="font-size: 16px; color: #0c4a6e;">${f.scores ? f.scores.career : 92}%</strong>
        </div>
      </div>

      <!-- 🐾 12지신 수호동물 파트너 인사 & 명언 -->
      <div class="card-box" style="background: #fffbeb; border-color: #fde68a; display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
        <span style="font-size: 38px; line-height: 1;">${mascot.emoji}</span>
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span class="badge" style="background: #fde68a; color: #78350f;">수호동물 ${safeStr(mascot.name)} ${mascot.emoji}</span>
            <span style="font-size: 11px; color: #78716c;">평생의 든든한 파트너</span>
          </div>
          <p style="font-size: 13px; font-weight: 700; color: #1c1917;">"${safeStr(name)}님, ${safeStr(mascot.greeting)} 오늘 하루도 내가 든든하게 지켜줄게! 💖"</p>
          <p style="font-size: 12px; color: #92400e; margin-top: 2px;">💬 <em>${safeStr(mascot.quotes ? mascot.quotes[0] : '너의 직관과 결단을 믿어봐! 오늘은 감이 최고야 ✨')}</em></p>
        </div>
      </div>

      ${f.twelveStage ? `
      <div class="card-box" style="background: #fdfbf7; border-color: #e7ddcd; margin-bottom: 12px;">
        <strong style="color: #8c1d1d; font-size: 13px;">⚡ 12운성 일진 에너지: ${safeStr(f.twelveStage.name)}(${safeStr(f.twelveStage.hanja)}) · ${safeStr(f.twelveStage.badge)} (${f.twelveStage.power}점)</strong>
        <p style="font-size: 12px; color: #57534e; margin-top: 4px; line-height: 1.6;">${safeStr(f.twelveStage.desc)}</p>
      </div>
      ` : ''}

      ${f.hapChungSignals && f.hapChungSignals.length > 0 ? `
      <div style="margin-bottom: 12px;">
        ${f.hapChungSignals.map(sig => `
          <div style="padding: 8px 12px; background: #fff; border: 1px solid var(--border-ink); border-radius: 8px; margin-bottom: 6px; font-size: 12px; display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: ${sig.type === 'HAP' ? '#d1fae5; color: #065f46;' : (sig.type === 'CHUNG' ? '#ffe4e6; color: #9f1239;' : '#f5f5f4; color: #292524;')}">${safeStr(sig.label)}</span>
            <span style="color: #44403c;">${safeStr(sig.desc)}</span>
          </div>
        `).join("")}
      </div>
      ` : ''}

      <div class="grid-2" style="margin-bottom: 12px;">
        <div class="card-box" style="background: #f0fdf4; border-color: #bbf7d0;">
          <strong style="color: #166534; font-size: 13px; display: block; margin-bottom: 4px;">✅ 오늘의 추천 행동:</strong>
          <p style="font-size: 12px; color: #14532d; line-height: 1.6;">${safeStr(f.action)}</p>
        </div>
        <div class="card-box" style="background: #fff1f2; border-color: #fecdd3;">
          <strong style="color: #9f1239; font-size: 13px; display: block; margin-bottom: 4px;">⚠️ 오늘의 주의 행동:</strong>
          <p style="font-size: 12px; color: #881337; line-height: 1.6;">${safeStr(f.avoid)}</p>
        </div>
      </div>

      ${f.lucky ? `
      <div class="card-box" style="background: #fafaf9; font-size: 12px; margin-bottom: 12px;">
        🎨 행운의 색: <strong>${safeStr(f.lucky.color)}</strong> · 🔢 행운의 번호: <strong>${safeStr(f.lucky.numbers)}</strong> · 🧭 길한 방위: <strong>${safeStr(f.lucky.direction)}</strong> · 🍲 추천 음식: <strong>${safeStr(f.lucky.food)}</strong>
      </div>
      ` : ''}

      <!-- ⏰ 시간대별 정밀 운세 리듬 & 12시진 흐름표 -->
      <div class="card-box">
        <strong style="color: #4a3525; font-size: 13px; display: block; margin-bottom: 8px;">⏰ 시간대별 일진 리듬 & 길흉 흐름표:</strong>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 8px; font-size: 11px;">
          ${hourlyList.map(slot => `
            <div style="border: 1px solid #e7ddcd; padding: 8px 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; background: #fff;">
              <div style="padding-right: 8px;">
                <strong style="color: #1c1917;">${safeStr(slot.time)}</strong>
                <span style="color: #b45309; font-weight: bold; margin-left: 4px;">${safeStr(slot.tenGodBadge)}</span>
                <p style="color: #78716c; margin-top: 2px;">${safeStr(slot.desc)}</p>
              </div>
              <span class="badge" style="background: ${slot.status && slot.status.includes('吉') ? '#fef3c7; color: #92400e; border: 1px solid #fde68a;' : (slot.status && slot.status.includes('凶') ? '#ffe4e6; color: #9f1239; border: 1px solid #fecdd3;' : '#f5f5f4; color: #292524; border: 1px solid #e7e5e4;')}">${safeStr(slot.status)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    ` : ''}

    <!-- 2. 사주 원국 카테고리 -->
    ${incSaju ? `
    <section id="panel-saju" class="category-section ${firstCatId === 'saju' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>📜 사주 4주 8자 (四柱八字) 원국 만세력</span>
        <span class="badge" style="background:#fee2e2; color:#991b1b;">일간: ${safeStr(s.pillars.day.gan.char)}(${safeStr(s.pillars.day.gan.hanja)})</span>
      </div>

      <table class="saju-tbl">
        <thead>
          <tr>
            <th style="width: 16%;">구분</th>
            <th style="width: 21%;">시주 (時柱)</th>
            <th style="width: 21%; background: #fef3c7; color: #78350f;">★ 일주 (日柱)</th>
            <th style="width: 21%;">월주 (月柱)</th>
            <th style="width: 21%;">년주 (年柱)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #fafaf9;">
            <td style="font-weight: bold; color: #78716c; font-size: 11px;">천간 십신</td>
            <td style="font-weight: bold; color: #b45309;">${s.pillars.time ? getTenGodName(s.pillars.time.tenGodGan) : '모름'}</td>
            <td style="font-weight: 900; color: #78350f; background: #fffbeb;">본원 (나)</td>
            <td style="font-weight: bold; color: #b45309;">${getTenGodName(s.pillars.month.tenGodGan)}</td>
            <td style="font-weight: bold; color: #b45309;">${getTenGodName(s.pillars.year.tenGodGan)}</td>
          </tr>
          <tr style="font-size: 18px; font-weight: 900;">
            <td style="font-size: 12px; color: #78716c;">천간 (天干)</td>
            <td>${s.pillars.time ? `${s.pillars.time.gan.char} (${s.pillars.time.gan.hanja})` : '-'}</td>
            <td style="background: #fffbeb; color: #78350f;">${s.pillars.day.gan.char} (${s.pillars.day.gan.hanja})</td>
            <td>${s.pillars.month.gan.char} (${s.pillars.month.gan.hanja})</td>
            <td>${s.pillars.year.gan.char} (${s.pillars.year.gan.hanja})</td>
          </tr>
          <tr style="font-size: 18px; font-weight: 900;">
            <td style="font-size: 12px; color: #78716c;">지지 (地支)</td>
            <td>${s.pillars.time ? `${s.pillars.time.ji.char} (${s.pillars.time.ji.hanja})` : '-'}</td>
            <td style="background: #fffbeb; color: #78350f;">${s.pillars.day.ji.char} (${s.pillars.day.ji.hanja})</td>
            <td>${s.pillars.month.ji.char} (${s.pillars.month.ji.hanja})</td>
            <td>${s.pillars.year.ji.char} (${s.pillars.year.ji.hanja})</td>
          </tr>
          <tr style="background: #fafaf9;">
            <td style="font-weight: bold; color: #78716c; font-size: 11px;">지지 십신</td>
            <td style="font-weight: bold; color: #57534e;">${s.pillars.time ? getTenGodName(s.pillars.time.tenGodJi) : '모름'}</td>
            <td style="font-weight: bold; color: #78350f; background: #fffbeb;">${getTenGodName(s.pillars.day.tenGodJi)}</td>
            <td style="font-weight: bold; color: #57534e;">${getTenGodName(s.pillars.month.tenGodJi)}</td>
            <td style="font-weight: bold; color: #57534e;">${getTenGodName(s.pillars.year.tenGodJi)}</td>
          </tr>
          <tr style="background: #fff;">
            <td style="font-weight: bold; color: #8c1d1d; font-size: 11px;">12운성</td>
            <td style="font-weight: bold; color: #8c1d1d;">${s.pillars.time ? getPillarStage(s.pillars.day.gan.char, s.pillars.time.ji.char) : '모름'}</td>
            <td style="font-weight: 900; color: #8c1d1d; background: #fffbeb;">${getPillarStage(s.pillars.day.gan.char, s.pillars.day.ji.char)}</td>
            <td style="font-weight: bold; color: #8c1d1d;">${getPillarStage(s.pillars.day.gan.char, s.pillars.month.ji.char)}</td>
            <td style="font-weight: bold; color: #8c1d1d;">${getPillarStage(s.pillars.day.gan.char, s.pillars.year.ji.char)}</td>
          </tr>
        </tbody>
      </table>

      <!-- 60갑자 일주론 상세 해설 -->
      <div class="card-box" style="background: #fffaf0; border-color: #fbd38d; margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fbd38d; padding-bottom: 8px; margin-bottom: 10px;">
          <h3 class="font-serif" style="font-size: 16px; font-weight: 900; color: #7b341e;">🌿 60갑자 일주론 심층 분석: ${safeStr(s.iljuDetail.name)} (${safeStr(s.iljuDetail.symbol)})</h3>
          <span class="badge" style="background: #feebc8; color: #7b341e;">기질: ${safeStr(s.iljuDetail.nature)}</span>
        </div>
        <p style="font-size: 13px; color: #44403c; line-height: 1.7; margin-bottom: 10px;"><strong>본원 성향:</strong> ${safeStr(s.iljuDetail.desc)}</p>
        <div class="grid-2" style="font-size: 12px; margin-bottom: 8px;">
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
            <strong style="color: #276749; display: block; margin-bottom: 4px;">✨ 타고난 강점:</strong>
            <p style="color: #4a5568; line-height: 1.6;">${safeStr(s.iljuDetail.strength)}</p>
          </div>
          <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px;">
            <strong style="color: #9b2c2c; display: block; margin-bottom: 4px;">⚠️ 주의할 점:</strong>
            <p style="color: #4a5568; line-height: 1.6;">${safeStr(s.iljuDetail.caution)}</p>
          </div>
        </div>
        <div class="grid-2" style="font-size: 12px;">
          <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 10px;">
            <strong style="color: #9b2c2c; display: block; margin-bottom: 4px;">💖 연애 스타일:</strong>
            <p style="color: #4a5568; line-height: 1.6;">${safeStr(s.iljuDetail.loveStyle)}</p>
          </div>
          <div style="background: #fffaf0; border: 1px solid #fbd38d; border-radius: 8px; padding: 10px;">
            <strong style="color: #7b341e; display: block; margin-bottom: 4px;">💰 재물 스타일:</strong>
            <p style="color: #4a5568; line-height: 1.6;">${safeStr(s.iljuDetail.wealthStyle)}</p>
          </div>
        </div>
      </div>

      <!-- 3대 복록 카드 -->
      ${s.blessingPoints && s.blessingPoints.length > 0 ? `
      <div style="margin-bottom: 14px;">
        <strong class="font-serif" style="color: #78350f; font-size: 14px; display: block; margin-bottom: 8px;">✨ 내 사주가 특별히 좋은 이유 3가지 (3대 복록):</strong>
        <div class="grid-3">
          ${s.blessingPoints.map((pt, idx) => `
            <div class="card-box" style="margin-bottom: 0;">
              <strong style="color: #b45309; font-size: 12px; display: block; margin-bottom: 4px;">POINT 0${idx + 1}. ${safeStr(pt.title)}</strong>
              <p style="font-size: 11px; color: #57534e; line-height: 1.6;">${safeStr(pt.desc)}</p>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ''}

      <!-- 10년 주기 대운 흐름표 -->
      ${s.daeunList && s.daeunList.length > 0 ? `
      <div class="card-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <strong style="color: #1c1917; font-size: 13px;">🌊 10년 주기 대운(大運) 흐름표</strong>
          <span style="font-size: 11px; color: #78716c;">${s.isForward ? '순행(順行)' : '역행(逆行)'} · 대운수 ${s.daeunNumber || 1}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 6px; text-align: center; font-size: 11px;">
          ${s.daeunList.map(d => `
            <div style="border: 1px solid var(--border-ink); border-radius: 8px; padding: 6px 2px; background: #fafaf9;">
              <span style="font-size: 10px; color: #78716c; display: block;">${d.startAge}~${d.endAge}세</span>
              <strong style="font-size: 13px; color: #1c1917; display: block; margin: 2px 0;">${d.ganChar}${d.jiChar}</strong>
              <span style="font-size: 10px; color: #b45309; font-weight: bold; display: block;">${getTenGodName(d.tenGod)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ''}
    </section>
    ` : ''}

    <!-- 3. 오행 & 용신 카테고리 -->
    ${incElements ? `
    <section id="panel-elements" class="category-section ${firstCatId === 'elements' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>☯ 5대 오행 분포 & 맞춤 용신(用神) 처방</span>
        <span class="badge" style="background:#e0f2fe; color:#0369a1;">체질: ${safeStr(s.strengthStatus)} (${s.strengthScore || 50}점)</span>
      </div>

      <div class="grid-2" style="margin-bottom: 14px;">
        <div class="card-box">
          <strong style="font-size: 13px; color: #1c1917; display: block; margin-bottom: 10px;">5대 오행 비율 & 분포:</strong>
          <div style="space-y: 8px;">
            ${[
              { name: "목(木)", pct: s.elements["목"] || 0, color: "#10b981" },
              { name: "화(火)", pct: s.elements["화"] || 0, color: "#f43f5e" },
              { name: "토(土)", pct: s.elements["토"] || 0, color: "#f59e0b" },
              { name: "금(金)", pct: s.elements["금"] || 0, color: "#94a3b8" },
              { name: "수(水)", pct: s.elements["수"] || 0, color: "#0ea5e9" }
            ].map(el => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 2px;">
                  <span>${el.name}</span>
                  <span>${el.pct}%</span>
                </div>
                <div style="width: 100%; height: 8px; background: #f5f5f4; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${el.pct}%; height: 100%; background: ${el.color};"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="card-box" style="background: #fafaf9;">
          <strong style="font-size: 13px; color: #1c1917; display: block; margin-bottom: 6px;">⚖️ 신강/신약 체질 종합 판정:</strong>
          <p style="font-size: 12px; color: #57534e; line-height: 1.7;">${safeStr(s.strengthDesc)}</p>
          <div style="margin-top: 10px; padding: 10px; background: #fff; border-radius: 8px; border: 1px solid var(--border-ink);">
            <strong style="color: #b45309; font-size: 12px; display: block;">🛡️ 수호 용신(用神): [${safeStr(s.yongsin)}]</strong>
            <p style="font-size: 11px; color: #78716c; margin-top: 2px;">${safeStr(s.yongsinDesc)}</p>
          </div>
        </div>
      </div>

      <!-- 결핍 오행 개운 처방 -->
      ${s.missingElements && s.missingElements.length > 0 ? `
      <div class="card-box" style="margin-bottom: 14px;">
        <strong style="color: #1c1917; font-size: 13px; display: block; margin-bottom: 8px;">💧 결핍된 오행 분석 & 맞춤 개운 비책:</strong>
        <div style="space-y: 8px;">
          ${s.missingElements.map(m => `
            <div style="padding: 10px; background: #fff; border: 1px solid var(--border-ink); border-radius: 8px; margin-bottom: 6px;">
              <strong style="color: #8c1d1d; font-size: 12px;">${safeStr(m.name)} 기운 결핍</strong>
              <p style="font-size: 11px; color: #57534e; margin-top: 2px;">${safeStr(m.desc)}</p>
              <p style="font-size: 11px; color: #047857; font-weight: bold; margin-top: 4px;">🌿 생활 개운 처방: ${safeStr(m.remedy)}</p>
            </div>
          `).join("")}
        </div>
      </div>
      ` : `
      <div class="card-box" style="background: #ecfdf5; border-color: #a7f3d0; margin-bottom: 14px; font-size: 12px; color: #065f46;">
        🎉 <strong>오행구족(五行具足):</strong> 5대 오행이 원국에 고루 조화를 이루어 한쪽으로 결핍되지 않은 평온한 기운입니다.
      </div>
      `}

      <!-- 없는 십신 특화 잠재력 카드 -->
      ${s.missingTenGods && s.missingTenGods.length > 0 ? `
      <div class="card-box">
        <strong style="color: #1c1917; font-size: 13px; display: block; margin-bottom: 8px;">🌟 없는 십신(十神)의 숨겨진 잠재력:</strong>
        <div style="space-y: 8px;">
          ${s.missingTenGods.map(tg => `
            <div style="padding: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; margin-bottom: 6px;">
              <strong style="color: #78350f; font-size: 12px;">${safeStr(tg.title)}</strong>
              <p style="font-size: 11px; color: #92400e; margin-top: 2px;">${safeStr(tg.desc)}</p>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ''}
    </section>
    ` : ''}

    <!-- 4. 8대 신살 카테고리 -->
    ${incSinsal && s && s.sinsal ? `
    <section id="panel-sinsal" class="category-section ${firstCatId === 'sinsal' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>🔮 사주 8대 핵심 신살(神煞) 분석</span>
        <span class="badge" style="background:#f3e8ff; color:#7e22ce;">${s.sinsal.length}개 신살 보유</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${s.sinsal.map(sal => {
          const isGood = sal.type && (sal.type.includes("길") || sal.type.includes("귀인") || sal.type.includes("복"));
          return `
            <div class="card-box" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="font-size: 14px; color: ${isGood ? '#8c1d1d' : '#1c1917'};">${safeStr(sal.name)}</strong>
                <div>
                  <span class="badge" style="background: ${isGood ? '#ecfdf5; color: #065f46;' : '#ffe4e6; color: #9f1239;'}">${safeStr(sal.type)}</span>
                  <span class="badge" style="background: #f5f5f4; color: #57534e;">${safeStr(sal.position)}</span>
                </div>
              </div>
              <p style="font-size: 12px; color: #44403c; line-height: 1.6;">${safeStr(sal.modern || sal.desc)}</p>
            </div>
          `;
        }).join("")}
      </div>
    </section>
    ` : ''}

    <!-- 5. 미래 전략 & 재물 카테고리 -->
    ${incFuture ? `
    <section id="panel-future" class="category-section ${firstCatId === 'future' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>🧭 미래 나침반 & 평생 재물·커리어 전략</span>
        <span class="badge" style="background:#fef3c7; color:#92400e;">10년 대운 도약기 연동</span>
      </div>

      <div class="card-box" style="background: #fffbeb; border-color: #fde68a; margin-bottom: 12px;">
        <strong style="color: #78350f; font-size: 13px; display: block; margin-bottom: 4px;">🧭 미래 인생 나침반 (용신 기반 최적 행로):</strong>
        <p style="font-size: 12px; color: #92400e; line-height: 1.7;">${safeStr(s.compass ? s.compass.actionPlan : "당신의 수호 용신 에너지를 적극 활용하여 장기적인 전문성과 주도성을 확보하세요.")}</p>
      </div>

      <div class="grid-2" style="margin-bottom: 12px;">
        <div class="card-box">
          <strong style="color: #8c1d1d; font-size: 13px; display: block; margin-bottom: 6px;">💼 천직 & 직업 적성:</strong>
          <p style="font-size: 12px; color: #44403c; line-height: 1.7;">${safeStr(careerAdvice)}</p>
        </div>
        <div class="card-box">
          <strong style="color: #b45309; font-size: 13px; display: block; margin-bottom: 6px;">💰 평생 재물 & 자산 증식 스타일:</strong>
          <p style="font-size: 12px; color: #44403c; line-height: 1.7;">${safeStr(s.iljuDetail.wealthStyle)}</p>
        </div>
      </div>

      <div class="card-box" style="margin-bottom: 12px; background: #eef2ff; border-color: #c7d2fe;">
        <strong style="color: #3730a3; font-size: 13px; display: block; margin-bottom: 4px;">🚀 10년 대운으로 보는 3대 도약 타이밍:</strong>
        <div class="grid-3" style="margin-top: 8px;">
          <div style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #c7d2fe;">
            <strong style="color: #3730a3; font-size: 11px; display: block;">1차 도약기 (${s.daeunList && s.daeunList[1] ? s.daeunList[1].startAge : 17}~${s.daeunList && s.daeunList[1] ? s.daeunList[1].endAge : 26}세)</strong>
            <p style="font-size: 10px; color: #4b5563; margin-top: 2px;">전문 역량의 토대를 닦고 독자적인 커리어 발판을 단단히 다지는 결정적 시기</p>
          </div>
          <div style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #c7d2fe;">
            <strong style="color: #3730a3; font-size: 11px; display: block;">2차 황금기 (${s.daeunList && s.daeunList[2] ? s.daeunList[2].startAge : 27}~${s.daeunList && s.daeunList[2] ? s.daeunList[2].endAge : 36}세)</strong>
            <p style="font-size: 10px; color: #4b5563; margin-top: 2px;">인생 최대의 에너지와 기회가 결합하여 폭발적인 성취와 명예를 획득하는 전성기</p>
          </div>
          <div style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #c7d2fe;">
            <strong style="color: #3730a3; font-size: 11px; display: block;">3차 수확기 (${s.daeunList && s.daeunList[3] ? s.daeunList[3].startAge : 37}~${s.daeunList && s.daeunList[3] ? s.daeunList[3].endAge : 46}세)</strong>
            <p style="font-size: 10px; color: #4b5563; margin-top: 2px;">구축된 자산과 네트워크를 바탕으로 풍요로운 결실을 거두고 시스템을 완성하는 시기</p>
          </div>
        </div>
      </div>

      <div class="card-box" style="background: #fff1f2; border-color: #fecdd3; margin-bottom: 12px;">
        <strong style="color: #9f1239; font-size: 13px; display: block; margin-bottom: 4px;">🛡️ 인생에서 경계해야 할 함정과 방패 전략:</strong>
        <p style="font-size: 12px; color: #881337; line-height: 1.7;">${safeStr(s.compass ? s.compass.trapAndShield : s.iljuDetail.caution)}</p>
      </div>

      <!-- ⚠️ 투자 주의 리스크 관리 지침 -->
      <div class="card-box" style="background: #fffaf0; border-color: #fbd38d;">
        <strong style="color: #7b341e; font-size: 13px; display: block; margin-bottom: 4px;">⚠️ 평생 재물 & 투자 리스크 관리 지침:</strong>
        <p style="font-size: 12px; color: #44403c; line-height: 1.7;">${safeStr(wealthAdvice)} ${riskText}</p>
      </div>
    </section>
    ` : ''}

    <!-- 6. 3-Card 타로 점괘 카테고리 -->
    ${incTarot ? `
    <section id="panel-tarot" class="category-section ${firstCatId === 'tarot' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>🃏 3-Card 대화형 타로 점괘 심층 리딩</span>
        <span class="badge" style="background:#e0e7ff; color:#3730a3;">과거·현재·미래 팩트 리딩</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${cards.map((cObj, idx) => {
          const c = cObj ? (cObj.card || cObj) : {};
          const posNames = ["과거 (Past / 원인과 배경)", "현재 (Present / 뼈아픈 직언)", "미래 (Future / 현실적 결말)"];
          const nameKr = c.nameKr || c.name_kr || c.name || `타로 카드 ${idx + 1}`;
          const nameEn = c.name || c.nameEn || c.name_en || "";
          const displayName = (nameKr.includes("(") || !nameEn) ? nameKr : `${nameKr} (${nameEn})`;
          const summary = c.summary || c.interpretation || "현재 흐름을 직시하고 근본적인 원인을 돌아보세요.";
          const advice = c.generalAdvice || c.advice || c.loveAdvice || c.moneyAdvice || c.careerAdvice || "현실을 냉정히 분석하고 기본에 충실하세요.";
          const realityCheck = c.realityCheck || "";
          const keywords = Array.isArray(c.keywords) ? c.keywords : (c.theme ? c.theme.split(",").map(x => x.trim()) : []);
          const isReversed = !!c.isReversed;

          return `
            <div class="card-box" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div>
                  <span style="font-size: 11px; font-weight: 700; color: #78716c;">${posNames[idx] || `카드 ${idx+1}`}</span>
                  <strong style="font-size: 15px; color: #8c1d1d; margin-left: 6px;">${safeStr(displayName)}</strong>
                </div>
                <span style="font-size: 11px; color: ${isReversed ? '#e11d48' : '#16a34a'}; font-weight: bold;">(${isReversed ? '역방향' : '정방향'})</span>
              </div>
              ${keywords.length > 0 ? `
              <div style="margin-bottom: 6px;">
                ${keywords.map(kw => `<span style="font-size: 10px; background: #f5f5f4; color: #57534e; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">#${safeStr(kw)}</span>`).join("")}
              </div>
              ` : ''}
              <p style="font-size: 12px; color: #44403c; line-height: 1.6; margin-bottom: 6px;">${safeStr(summary)}</p>
              ${realityCheck ? `<p style="font-size: 11px; color: #57534e; background: #f5f5f4; padding: 6px 10px; border-radius: 6px; margin-bottom: 6px; font-style: italic;">⚡ <strong>현실 팩트 체크:</strong> ${safeStr(realityCheck)}</p>` : ''}
              <div style="font-size: 11px; background: #faf5ed; padding: 8px 10px; border-radius: 6px; color: #78350f; border-left: 3px solid #b45309;">
                💡 <strong>실천 조언:</strong> ${safeStr(advice)}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </section>
    ` : ''}

    <!-- 7. AI 도사 상담 문답 카테고리 -->
    ${incAi && aiLogs.length > 0 ? `
    <section id="panel-ai" class="category-section ${firstCatId === 'ai' ? 'active-panel' : ''}">
      <div class="cat-title">
        <span>🧙‍♂️ 천명 AI 명리·해몽 도사 1:1 상담 대화록</span>
        <span class="badge" style="background:#ecfdf5; color:#065f46;">AI 도사 대화록</span>
      </div>
      <div style="padding: 10px 0;">
        ${aiLogs.map(item => `
          <div style="margin-bottom: 12px; padding: 12px; border-radius: 10px; background: ${item.role === 'user' ? '#fdf8ee' : '#ffffff'}; border: 1px solid var(--border-ink);">
            <div style="font-size: 11px; font-weight: bold; color: ${item.role === 'user' ? '#8c1d1d' : '#1e3a5f'}; margin-bottom: 4px; display: flex; justify-content: space-between;">
              <span>${item.role === 'user' ? '🙋‍♂️ 도반의 질문' : '🧙‍♂️ AI 도사의 처방'}</span>
              <span style="color: #a8a29e; font-weight: normal;">${safeStr(item.time)}</span>
            </div>
            <p style="font-size: 12px; line-height: 1.7; white-space: pre-wrap; color: #292524;">${safeStr(item.text)}</p>
          </div>
        `).join("")}
      </div>
    </section>
    ` : ''}

  </div>

  <footer class="footer">
    <p>천명(天命) AI 운세 포털 · 한국천문연구원(KASI) 정통 역법 알고리즘 탑재</p>
    <p style="margin-top: 4px; font-size: 11px; color: #a8a29e;">본 문서는 사용자 본인만을 위해 생성된 독립형 인터랙티브 디지털 서책입니다.</p>
  </footer>

  <script>
    let isAllExpanded = false;

    function selectCategory(catId, btnEl) {
      isAllExpanded = false;
      document.body.classList.remove('show-all');
      
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');

      // Update panels
      document.querySelectorAll('.category-section').forEach(sec => sec.classList.remove('active-panel'));
      const target = document.getElementById('panel-' + catId);
      if (target) {
        target.classList.add('active-panel');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function toggleAllView(btnEl) {
      isAllExpanded = !isAllExpanded;
      if (isAllExpanded) {
        document.body.classList.add('show-all');
        btnEl.innerHTML = '<span>📑 카테고리별 탭으로 보기</span>';
      } else {
        document.body.classList.remove('show-all');
        btnEl.innerHTML = '<span>📖 전체 한눈에 보기</span>';
      }
    }

    function copyReportText() {
      const text = document.querySelector('.container').innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('서책 내용 전체가 텍스트로 복사되었습니다!');
      }).catch(() => {
        alert('복사에 실패했습니다.');
      });
    }
  </script>
</body>
</html>`;

    // Download as HTML file
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    a.href = url;
    a.download = `천명_사주운세_인터랙티브_서책_${name}_${dateStr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`🎉 [${name}] 님의 카테고리별 인터랙티브 서책 (.html) 다운로드가 완료되었습니다!\n\nPDF와 달리 다운로드된 파일을 더블클릭하면 브라우저에서 각 카테고리 탭을 직접 눌러가며 편리하게 열람하실 수 있습니다.`);
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
