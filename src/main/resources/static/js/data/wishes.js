/**
 * 천명(天命) 밤하늘 소원 연등 광장 커뮤니티 데이터
 * - 다른 도반들이 띄운 소원 연등 목록
 * - 따뜻한 응원(추천) 시스템
 * - 주간 1위 소원 명예의 전당 연동
 */

const INITIAL_COMMUNITY_WISHES = [
  {
    id: 101,
    category: "🌿 건강·장수",
    author: "어머니의 딸 김도반",
    text: "다음 주 어머니 큰 수술 무사히 잘 마치시고, 다시 환하게 웃으시며 온 가족 모여 따뜻한 밥상 함께할 수 있기를 간절히 기도합니다.",
    cheers: 284,
    date: "2026. 11. 22.",
    isWeeklyTop: true
  },
  {
    id: 102,
    category: "🎓 시험·합격",
    author: "새벽별 임용고시생",
    text: "3년 동안 하루도 쉬지 않고 준비한 중등 임용고시, 이번에는 반드시 합격하여 아이들에게 온기와 희망을 전하는 참된 교사가 되고 싶습니다.",
    cheers: 196,
    date: "2026. 11. 21.",
    isWeeklyTop: false
  },
  {
    id: 103,
    category: "🏡 가족·화목",
    author: "두 아이의 가장",
    text: "우리 네 식구 누구 하나 아프지 않고, 서로 양보하고 배려하며 날마다 웃음꽃 피는 한 해가 되기를 소망합니다. 지친 퇴근길에 언제나 힘이 되는 가족이길.",
    cheers: 153,
    date: "2026. 11. 20.",
    isWeeklyTop: false
  },
  {
    id: 104,
    category: "💰 사업·재물",
    author: "골목길 청년 사장",
    text: "작은 동네 빵집 개업 후 버텨온 2년의 시간, 올해는 부채도 갚고 직원들과 함께 환하게 웃을 수 있는 결실의 해가 되길 간절히 축원합니다.",
    cheers: 128,
    date: "2026. 11. 21.",
    isWeeklyTop: false
  },
  {
    id: 105,
    category: "💖 애정·인연",
    author: "따뜻한 봄날",
    text: "서로의 부족함을 너그럽게 감싸주고, 비바람 치는 날에도 든든한 평생의 버팀목이 되어줄 소중한 인연을 만나 아름다운 가정을 꾸리고 싶습니다.",
    cheers: 105,
    date: "2026. 11. 19.",
    isWeeklyTop: false
  },
  {
    id: 106,
    category: "🕊️ 마음·평안",
    author: "마음챙김 도반",
    text: "오랫동안 가슴을 짓누르던 불안감과 자책을 내려놓고, 온전히 나 자신을 인정하고 사랑하며 하루하루 평온하게 살아갈 수 있는 지혜와 용기를 주세요.",
    cheers: 92,
    date: "2026. 11. 22.",
    isWeeklyTop: false
  },
  {
    id: 107,
    category: "🌿 건강·장수",
    author: "손녀 민지",
    text: "요양병원에 계신 사랑하는 할머니께서 올 겨울 잔병치레 없이 따뜻하게 보내시고, 봄날에 함께 꽃구경 갈 수 있도록 기력을 회복하시길 빕니다.",
    cheers: 84,
    date: "2026. 11. 23.",
    isWeeklyTop: false
  },
  {
    id: 108,
    category: "🎓 시험·합격",
    author: "취준생 달빛",
    text: "수많은 불합격 통보에 흔들리지 않고 끝까지 걸어가겠습니다. 올 상반기에는 저의 열정과 잠재력을 펼칠 수 있는 좋은 직장에 꼭 입사하기를 기원합니다.",
    cheers: 76,
    date: "2026. 11. 23.",
    isWeeklyTop: false
  }
];

window.INITIAL_COMMUNITY_WISHES = INITIAL_COMMUNITY_WISHES;
