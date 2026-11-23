/**
 * 오늘의 마음 날씨 & 사주 오행 심리 처방 데이터베이스
 * - 5대 감정 날씨: 맑음(목/화), 구름(토), 비(수), 번개(금/화), 안개(수/토)
 */
const MOOD_HEALING_DATA = {
  sunny: {
    key: "sunny",
    name: "맑음 & 활기 충만",
    emoji: "☀️",
    bgClass: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    borderClass: "border-amber-400/60",
    textClass: "text-amber-950",
    element: "목(木) · 화(火)의 상승 에너지",
    stateDesc: "심장에 생기와 열정이 솟구치고, 무엇이든 해낼 수 있을 것 같은 긍정 에너지가 가득한 상태입니다.",
    prescription: {
      mindset: "솟구치는 에너지를 혼자만 간직하지 말고, 주변 동료나 친구에게 따뜻한 칭찬과 응원으로 흘려보내세요. 베푼 복은 3배로 돌아옵니다.",
      tea: "달콤하고 향긋한 유자차 또는 감귤 홍차",
      color: "선명한 코랄 오렌지 & 포레스트 그린",
      action: "미뤄뒀던 과감한 도전 실행하기, 감사 일기 3줄 작성",
      affirmation: "나는 내 안의 밝은 빛으로 오늘 하루를 환하게 비추고, 나와 주변을 함께 풍요롭게 만든다."
    }
  },
  cloudy: {
    key: "cloudy",
    name: "구름 조금 & 나른함·평온",
    emoji: "⛅",
    bgClass: "from-slate-400/20 via-stone-300/10 to-amber-200/20",
    borderClass: "border-stone-400/60",
    textClass: "text-stone-900",
    element: "토(土)의 완충 & 안정 에너지",
    stateDesc: "특별한 흥분이나 기복 없이 잔잔하지만, 다소 나른하거나 몸이 무겁게 느껴질 수 있는 전환기입니다.",
    prescription: {
      mindset: "무리하게 텐션을 올리려 애쓰지 마세요. 가끔은 '그냥 그렇구나' 하고 흘려보내는 덤덤한 마음이 가장 큰 지혜입니다.",
      tea: "구수하고 속을 편안하게 덥혀주는 둥굴레차 또는 보리차",
      color: "부드러운 크림 베이지 & 웜 그레이",
      action: "가벼운 15분 스트레칭, 좋아하는 잔잔한 어쿠스틱 음악 듣기",
      affirmation: "나는 지금 이 순간의 잔잔한 고요함을 온전히 누리며, 서두르지 않고 나만의 속도로 걷는다."
    }
  },
  rainy: {
    key: "rainy",
    name: "비 & 울적함·마음 지침",
    emoji: "🌧️",
    bgClass: "from-sky-500/20 via-blue-500/10 to-indigo-500/20",
    borderClass: "border-sky-400/60",
    textClass: "text-sky-950",
    element: "수(水)의 과다 & 목(木)의 소생 필요",
    stateDesc: "마음속에 서글픔이나 피로가 고여 있고, 타인의 사소한 말에도 쉽게 상처받을 수 있는 민감한 상태입니다.",
    prescription: {
      mindset: "비가 내려야 대지가 촉촉해지고 새싹이 돋아납니다. 우울함은 당신이 못나서가 아니라, 영혼이 잠시 쉬어가라고 보내는 신호입니다.",
      tea: "몸과 마음을 포근하게 감싸주는 따뜻한 대추차 또는 카모마일차",
      color: "따뜻한 파스텔 핑크 & 온기 있는 밀크티 브라운",
      action: "따뜻한 물로 샤워하기, 나 자신을 꼭 안아주며 '그동안 애썼다' 말해주기",
      affirmation: "어떤 비구름도 하늘에 영원히 머물지 못한다. 내 마음의 하늘에도 곧 맑은 햇살이 다시 비칠 것이다."
    }
  },
  stormy: {
    key: "stormy",
    name: "천둥번개 & 스트레스·분노",
    emoji: "⚡",
    bgClass: "from-rose-500/20 via-red-500/10 to-orange-500/20",
    borderClass: "border-rose-400/60",
    textClass: "text-rose-950",
    element: "화(火)의 과열 & 금(金)의 냉각 필요",
    stateDesc: "가슴속에 화가 치밀거나 뜻대로 풀리지 않는 일로 인해 팽팽한 긴장감과 분노가 폭발하기 직전입니다.",
    prescription: {
      mindset: "분노라는 불길에 기름을 붓지 마세요. 지금 내뱉는 말은 흉기가 되어 나에게 돌아옵니다. 결정을 내리기 전 10초간 숨을 멈추고 식히세요.",
      tea: "머리의 열을 내려주는 상쾌한 박하차(페퍼민트) 또는 시원한 국화차",
      color: "깊고 청량한 딥 네이비 & 청록색(Cyan)",
      action: "4초 들이쉬고 7초 멈추고 8초 내쉬는 '4-7-8 쿨다운 호흡', 빠른 걸음 산책",
      affirmation: "나는 내 감정의 노예가 아니다. 나는 거센 파도 속에서도 내 마음의 키를 단단히 잡을 수 있다."
    }
  },
  foggy: {
    key: "foggy",
    name: "안개 & 답답함·불안·막막함",
    emoji: "🌫️",
    bgClass: "from-purple-500/20 via-indigo-500/10 to-slate-500/20",
    borderClass: "border-purple-400/60",
    textClass: "text-purple-950",
    element: "금(金)의 명쾌함 & 화(火)의 지혜 조명 필요",
    stateDesc: "앞날이 불투명하게 느껴지고 '내가 잘하고 있는 걸까?' 하는 막막한 불안감에 생각이 꼬리를 무는 상태입니다.",
    prescription: {
      mindset: "안개는 억지로 손을 휘젓는다고 걷히지 않습니다. 10년 뒤의 걱정을 지금 끌어오지 말고, '오늘 당장 할 수 있는 단 1가지'에만 집중하세요.",
      tea: "머리를 맑게 깨워주는 향긋한 로즈마리차 또는 은은한 녹차",
      color: "선명한 라벤더 퍼플 & 순백의 화이트",
      action: "머릿속 걱정거리 종이에 마구 적고 찢어버리기, 방 청소나 책상 정리",
      affirmation: "모든 길은 한 걸음에서 시작된다. 앞이 보이지 않아도 내가 내딛는 바로 그 자리가 나의 길이 된다."
    }
  }
};

window.MoodHealingData = MOOD_HEALING_DATA;
