package com.chunmyung.saju.service;

import com.chunmyung.saju.dto.AiChatDtos.*;
import com.chunmyung.saju.entity.AiChatLogEntity;
import com.chunmyung.saju.repository.AiChatLogRepository;
import com.chunmyung.saju.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 천명(天命) 내장형 AI 명리 도사 상담 엔진
 * 사용자의 실시간 사주 원국(일주·용신·신강약·신살) 및 오늘의 일진(십신·12운성) 컨텍스트를 결합하여
 * 질문 의도(Intent)별 맞춤형 명리 해답을 생성하고 MySQL ai_chat_logs 테이블에 기록합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiCounselorService {

    private final AiChatLogRepository aiChatLogRepository;

    @Transactional
    public ChatResponse generateCounselReply(ChatRequest req) {
        String rawMsg = req.getMessage() != null ? req.getMessage().trim() : "";
        SecurityUtils.validateNoSqlInjection(rawMsg);
        String msg = SecurityUtils.sanitizeXss(rawMsg);

        String name = (req.getUserName() != null && !req.getUserName().isBlank()) ? req.getUserName() : "도반(道伴)";
        boolean hasSaju = req.getIljuName() != null && !req.getIljuName().isBlank();
        String ilju = hasSaju ? req.getIljuName() : "귀하의 본원 일주";
        String animal = (req.getZodiacAnimal() != null && !req.getZodiacAnimal().isBlank()) ? req.getZodiacAnimal() : "수호신령";
        String strength = (req.getStrengthStatus() != null && !req.getStrengthStatus().isBlank()) ? req.getStrengthStatus() : "중화(中和)";
        String yongsin = (req.getYongsin() != null && !req.getYongsin().isBlank()) ? req.getYongsin() : "수(水)·목(木)";
        String deficient = (req.getDeficientElement() != null && !req.getDeficientElement().isBlank()) ? req.getDeficientElement() : "조후 보충 오행";
        String tenGod = (req.getTodayTenGod() != null && !req.getTodayTenGod().isBlank()) ? req.getTodayTenGod() : "식신(食神)";
        String twelveStage = (req.getTodayTwelveStage() != null && !req.getTodayTwelveStage().isBlank()) ? req.getTodayTwelveStage() : "건록(建祿)";
        int score = req.getTodayScore() != null ? req.getTodayScore() : 86;
        String luckyColor = (req.getLuckyColor() != null && !req.getLuckyColor().isBlank()) ? req.getLuckyColor() : "황실 골드·비취 그린";
        String luckyFood = (req.getLuckyFood() != null && !req.getLuckyFood().isBlank()) ? req.getLuckyFood() : "따뜻한 차와 제철 한식";
        String luckyDir = (req.getLuckyDirection() != null && !req.getLuckyDirection().isBlank()) ? req.getLuckyDirection() : "동남쪽";
        String sinsals = (req.getSinsalNames() != null && !req.getSinsalNames().isBlank()) ? req.getSinsalNames() : "천을귀인·문창귀인";

        String lower = msg.toLowerCase();
        String intentCategory;
        String intentBadge;
        String reply;
        String followUpTip;

        if (containsAny(lower, "꿈", "해몽", "악몽", "길몽", "태몽", "돼지꿈", "용꿈", "뱀꿈", "똥꿈", "불꿈", "이빨", "치아", "조상", "죽는꿈", "쫓기는")) {
            intentCategory = "DREAM_INTERPRETATION";
            intentBadge = "🌙 동양 정통 꿈해몽(夢兆) 처방";
            String dreamDetail = buildDreamInterpretation(lower, name, ilju, yongsin, tenGod, twelveStage, luckyDir);
            reply = dreamDetail;
            followUpTip = "💡 다른 꿈도 해몽해 드립니다! 예: '돼지꿈 꿨어', '불이 활활 타는 꿈 해몽해줘', '뱀이 나오는 꿈', '이빨 빠지는 꿈' 등 구체적으로 적어보세요.";
        } else if (containsAny(lower, "재물", "돈", "부자", "투자", "주식", "코인", "사업", "금전", "로또", "월급", "자산")) {
            intentCategory = "WEALTH";
            intentBadge = "💰 재물·투자 명리 처방";
            reply = String.format(
                    "허허, %s 님의 재물 기운을 짚어보겠습니다.\n\n" +
                    "1️⃣ **[타고난 재물 그릇]**: %s(%s) 기질을 지닌 귀하의 사주 체질은 **%s**이며, 재물의 물꼬를 터주는 핵심 용신(用神)은 **[%s]** 기운입니다.\n" +
                    "2️⃣ **[오늘과 당면한 금전 흐름]**: 오늘 일진은 **[%s · 12운성 %s]**의 파동이 흐르고 있어 재물 지수는 **%d점**입니다. 단기 투기보다는 문서·계약이나 본업의 전문성을 통한 정재(正財)·식신생재(食神生財) 흐름이 훨씬 유리합니다.\n" +
                    "3️⃣ **[AI 도사의 재물 개운 비책]**: 중요한 금전 결정이나 미팅을 할 때는 **[%s]** 계열 소품을 가까이 두시고, **[%s]** 방위를 활용하시면 막혔던 금전운이 크게 트입니다.",
                    name, ilju, animal, strength, yongsin, tenGod, twelveStage, score, luckyColor, luckyDir
            );
            followUpTip = "💡 더 궁금하시면 '이직이나 사업 시기는 언제가 좋을까?' 또는 '내 용신 채우는 법 알려줘'라고 물어보세요!";
        } else if (containsAny(lower, "연애", "사랑", "결혼", "배우자", "남자친구", "여자친구", "썸", "재회", "이별", "인연", "궁합")) {
            intentCategory = "LOVE";
            intentBadge = "💖 연애·배우자 인연 풀이";
            reply = String.format(
                    "%s 님의 인연줄과 홍실(紅絲)의 기운을 살펴보았습니다.\n\n" +
                    "1️⃣ **[타고난 연애 기질]**: 귀하는 **%s(%s)**의 기운을 타고나 겉으로는 단단해 보여도 내면에 깊은 정과 매력을 품고 있습니다. 원국에 작용하는 **[%s]**의 영향으로 사람들의 시선을 자연스레 끄는 도화·귀인의 기운이 있습니다.\n" +
                    "2️⃣ **[최고의 배우자·연인 궁합]**: 귀하에게 부족하기 쉬운 **[%s]** 기운을 따뜻하게 채워주거나 용신인 **[%s]** 오행을 가진 상대와 만날 때 서로의 복록이 배가되는 천생연분을 이룹니다.\n" +
                    "3️⃣ **[오늘의 애정 조언]**: 오늘은 12운성 **[%s]**의 날이니 자존심을 세우기보다 부드러운 공감과 먼저 건네는 따뜻한 말 한마디가 인연을 급진전시킵니다.",
                    name, ilju, animal, sinsals, deficient, yongsin, twelveStage
            );
            followUpTip = "💡 상대방과의 정밀 점수가 궁금하시면 사주팔자 입력창에서 [궁합 함께 보기]를 체크해 보세요!";
        } else if (containsAny(lower, "직장", "이직", "취업", "진로", "직업", "승진", "시험", "합격", "공부", "커리어", "적성")) {
            intentCategory = "CAREER";
            intentBadge = "💼 천직·이직·합격 나침반";
            reply = String.format(
                    "%s 님의 관운(官運)과 문서운(印運)을 명리학 원전 기준으로 풀어드립니다.\n\n" +
                    "1️⃣ **[천직과 적성 분야]**: **%s(%s)** 일주에 **%s** 체질을 지닌 귀하는 남의 지시에만 얽매이기보다 자기 주도성과 전문 기술·기획력을 발휘하는 분야에서 두각을 나타냅니다. 특히 용신인 **[%s]** 기운과 연결된 산업군이나 문서·자격증 분야에서 큰 성취가 따릅니다.\n" +
                    "2️⃣ **[이직·시험 타이밍]**: 오늘 흐르는 **[%s]** 기운과 12운성 **[%s]** 에너지에 비추어 볼 때, 성급하게 감정에 치우쳐 사표를 내기보다 철저히 다음 자리를 확보한 뒤 움직이는 것이 백전백승의 전략입니다.\n" +
                    "3️⃣ **[문서·합격 개운법]**: 면접이나 중요한 발표 날에는 **[%s]** 음식을 챙겨 드시고 **[%s]** 컬러 포인트를 주시면 귀인의 도움을 받습니다.",
                    name, ilju, animal, strength, yongsin, tenGod, twelveStage, luckyFood, luckyColor
            );
            followUpTip = "💡 사주팔자 결과 화면의 [🧭 앞으로 나아갈 방향 & 미래 전략] 탭에서 10년 대운 도약기도 함께 확인해 보세요!";
        } else if (containsAny(lower, "오늘", "일진", "조심", "시간", "하루", "컨디션", "운세")) {
            intentCategory = "TODAY";
            intentBadge = "☀️ 오늘의 일진·시간대 비책";
            reply = String.format(
                    "%s 님의 오늘 하루 천기(天氣)와 시두법(時頭法) 리듬을 요약해 드립니다.\n\n" +
                    "• **오늘의 종합 운세 지수**: **%d점** (십신 **[%s]** · 12운성 **[%s]**)\n" +
                    "• **오전~오후 핵심 흐름**: 오늘은 내 일간과 당일 일진이 만나 **[%s]**의 에너지가 강하게 작동합니다. 오전에 핵심 업무나 중요한 연락을 먼저 배치하시면 막힘없이 풀립니다.\n" +
                    "• **오늘의 3대 개운(開運) 처방**:\n" +
                    "  - 🎨 **행운 컬러**: %s\n" +
                    "  - 🍲 **추천 개운 음식**: %s\n" +
                    "  - 🧭 **길(吉)한 방위**: %s",
                    name, score, tenGod, twelveStage, tenGod, luckyColor, luckyFood, luckyDir
            );
            followUpTip = "💡 오늘의 운세는 100% 무료로 제공됩니다. 상단 [☀️ 오늘의 운세] 탭에서 아침·오후·저녁·밤 4대 구간 상세 리듬을 확인하세요!";
        } else if (containsAny(lower, "오행", "용신", "개운", "색깔", "음식", "방위", "신강", "신약", "부족", "결핍")) {
            intentCategory = "ELEMENT_YONGSIN";
            intentBadge = "🌱 오행 밸런스 & 용신 처방";
            reply = String.format(
                    "명리학에서 가장 중요한 **억부(抑扶)와 조후(調候) 용신 처방**을 알려드립니다.\n\n" +
                    "1️⃣ **[%s 님의 사주 체질 진단]**: 현재 판정된 사주 체질은 **[%s]**이며, 원국의 균형을 잡아주는 핵심 수호 오행(용신)은 **[%s]**, 보충이 필요한 결핍 기운은 **[%s]**입니다.\n" +
                    "2️⃣ **[일상 속 용신 보충법]**:\n" +
                    "   • **의복·소품**: **%s** 톤의 아이템을 자주 활용하세요.\n" +
                    "   • **식습관(오미 개운)**: **%s** 위주의 식단이 부족한 오행 기운을 빠르게 북돋아 줍니다.\n" +
                    "   • **공간·방위**: 책상이나 침대 머리를 **%s**으로 두거나 해당 방위로 산책하시면 심신이 맑아집니다.",
                    name, strength, yongsin, deficient, luckyColor, luckyFood, luckyDir
            );
            followUpTip = "💡 사주에서 부족한 오행은 흉(凶)이 아니라 의식적으로 채울 때 가장 큰 발복(發福)을 일으키는 열쇠입니다!";
        } else if (containsAny(lower, "신살", "도화", "역마", "귀인", "천을귀인", "백호", "괴강", "화개", "대운", "10년")) {
            intentCategory = "SINSAL_DAEUN";
            intentBadge = "📜 8대 신살 & 10년 대운 해설";
            reply = String.format(
                    "%s 님의 원국에 깃든 **신살(神煞)과 대운(大運)**의 비의를 풀어드립니다.\n\n" +
                    "1️⃣ **[핵심 작용 신살]**: 귀하의 명식에는 **[%s]** 등의 기운이 작용하고 있습니다. 현대 명리학에서 도화살은 대중적 인기와 매력으로, 역마살은 글로벌 활동력과 추진력으로, 백호·괴강은 압도적인 프로페셔널 카리스마로 발현됩니다.\n" +
                    "2️⃣ **[10년 대운의 흐름]**: 사주 원국이 '자동차'라면 대운은 내가 달리는 '고속도로'입니다. 용신인 **[%s]** 기운이 들어오는 대운과 세운(연운)에 인생 최대의 자산 증식과 지위 상승이 일어납니다.",
                    name, sinsals, yongsin
            );
            followUpTip = "💡 500원 프리미엄 사주 리포트를 열람하시면 기둥별 8대 신살과 10년 단위 대운표를 한눈에 확인하실 수 있습니다.";
        } else if (containsAny(lower, "결제", "500원", "가격", "무료", "사용법", "로그인", "휴면", "타로")) {
            intentCategory = "GUIDE";
            intentBadge = "🏮 천명(天命) 이용 안내";
            reply = "천명(天命) 만세력 이용법을 안내해 드립니다.\n\n" +
                    "• **☀️ 오늘의 운세 (무료)**: 로그인 후 생년월일시를 입력하시면 십신·12운성·합충 신호등·시간대별 운세·개운 음식을 **100% 무료**로 즉시 확인하실 수 있습니다.\n" +
                    "• **📜 정통 사주팔자 (500원)**: 평생 사주 4주 8자 원국, 60갑자 일주론, 8대 신살, 10년 대운, 오행 용신, 재물/연애 심층 리포트는 **토스페이·카카오페이·네이버페이 500원** 결제 즉시 열람되며 MySQL DB에 영구 보관됩니다.\n" +
                    "• **🔮 3-Card 타로 (무료)**: 연애·진로·금전·치유 주제별로 카드를 직접 3장 뽑아 과거·현재·미래를 점칠 수 있습니다.";
            followUpTip = "💡 상단 우측 [📜 내 결제·서책 보관함]에서 언제든 결제 영수증과 과거 사주 분석 기록을 다시 볼 수 있습니다.";
        } else {
            intentCategory = "GENERAL_COUNSEL";
            intentBadge = "🧙‍♂️ 천명 AI 도사의 맞춤 문답";
            reply = String.format(
                    "반갑습니다, **%s** 님! 천명(天命) 규장각을 지키는 AI 명리 도사입니다. 🙇‍♂️\n\n" +
                    "현재 연동된 귀하의 기운(**%s · 체질 %s · 용신 %s · 오늘 운세 %d점**)을 바탕으로 살펴보니, 지금은 조급함을 내려놓고 귀하가 가진 **[%s]**의 잠재력을 믿고 한 걸음씩 나아갈 때입니다.\n\n" +
                    "질문하신 **\"%s\"**에 대하여 명리학적 조언을 드리자면, 오늘은 12운성 **[%s]**과 **[%s]**의 기운이 흐르는 날이므로 주변 사람과의 화합을 우선하고 **[%s]** 방위의 기운을 활용하시면 뜻하는 바를 순조롭게 이루실 수 있습니다.",
                    name, ilju, strength, yongsin, score, animal, msg, twelveStage, tenGod, luckyDir
            );
            followUpTip = "💡 아래 추천 질문 버튼(재물운, 연애운, 이직/진로, 오늘 조심할 점, 용신 개운법)을 눌러보시거나 편하게 고민을 적어주세요!";
        }

        AiChatLogEntity saved = aiChatLogRepository.save(AiChatLogEntity.builder()
                .userName(name)
                .iljuName(hasSaju ? ilju : null)
                .yongsin(req.getYongsin())
                .intentCategory(intentCategory)
                .userMessage(msg)
                .aiResponse(reply)
                .build());

        return ChatResponse.builder()
                .chatLogId(saved.getId())
                .intentCategory(intentCategory)
                .intentBadge(intentBadge)
                .reply(reply)
                .followUpTip(followUpTip)
                .build();
    }

    public List<AiChatLogEntity> getRecentChatLogs() {
        return aiChatLogRepository.findTop15ByOrderByCreatedAtDesc();
    }

    private boolean containsAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }

    /**
     * 동양 고전 해몽서(주공해몽·규장각 해몽 비전) 및 사용자 사주 일진 결합 정밀 꿈해몽 생성기
     */
    private String buildDreamInterpretation(String lower, String name, String ilju, String yongsin,
                                            String tenGod, String twelveStage, String luckyDir) {
        String dreamGrade;
        String symbolAnalysis;
        String actionAdvice;

        if (containsAny(lower, "돼지", "똥", "대변", "황금", "금화", "돈", "복권", "재물")) {
            dreamGrade = "🌟 대대길몽(大大吉夢) — 재물·횡재 지수 98점";
            symbolAnalysis = "동양 해몽에서 **돼지·황금·대변(똥)**은 오행상 비옥한 **토(土)와 금(金)의 결실**을 뜻하는 최고 으뜸의 재물 길몽입니다. 특히 몸에 묻거나 집안으로 들어오는 형상이면 뜻밖의 횡재수, 투자 수익, 계약 성사, 목돈 유입이 임박했음을 알리는 천기(天氣)입니다.";
            actionAdvice = "오늘 귀하의 일진(**" + tenGod + " · " + twelveStage + "**)과 맞물려 재물복이 크게 열려 있으니, 망설이던 영업·자산 계획이나 소액의 행운 도전을 **" + luckyDir + "** 방위에서 실행해 보세요.";
        } else if (containsAny(lower, "용", "청룡", "황룡", "호랑이", "대통령", "임금", "왕", "하늘", "날아", "태양", "해", "보름달")) {
            dreamGrade = "👑 제왕길몽(帝王吉夢) — 명예·승진·합격 지수 97점";
            symbolAnalysis = "**용(龍)·호랑이·태양·하늘을 비상하는 꿈**은 사주 명리에서 **정관(正官)과 인성(印星)의 기운이 극에 달한 대길몽**입니다. 시험 합격, 승진, 취업, 당선, 혹은 귀한 인재(태몽)나 평생의 은인(천을귀인)을 만나 이름을 널리 떨칠 징조입니다.";
            actionAdvice = "귀하의 본원(**" + ilju + "**)에 강력한 명예운이 감돌고 있습니다. 중요한 면접·발표·제안이 있다면 오늘 당당하게 주도권을 잡으세요.";
        } else if (containsAny(lower, "불", "화재", "불타", "활활")) {
            dreamGrade = "🔥 번창길몽(繁昌吉夢) — 사업·확장 지수 94점";
            symbolAnalysis = "꿈에서 **불이 활활 타오르는 것**은 오행 **화(火)의 발산 에너지**로, 집안이나 사업체·진행 중인 프로젝트가 들불처럼 번창하고 세력이 크게 확장될 것을 예고하는 길몽입니다. (단, 연기만 자욱하고 불꽃이 없었다면 구설을 조심해야 합니다.)";
            actionAdvice = "귀하의 용신(**" + yongsin + "**) 기운과 조화를 이루면 폭발적인 성장으로 이어지니, 추진 중인 일을 멈추지 말고 밀고 나가세요.";
        } else if (containsAny(lower, "뱀", "구렁이")) {
            dreamGrade = "🐍 지혜·재물 길몽(吉夢) — 통찰·인연 지수 90점";
            symbolAnalysis = "동양 해몽에서 **큰 구렁이나 뱀**은 지혜의 영물이자 지신(地神)으로, **재물 축적·깊은 인연(또는 태몽)·문서 획득**을 상징합니다. 뱀에게 물리거나 뱀이 품으로 들어왔다면 큰 이권이나 귀한 인연이 나에게 귀속되는 길조입니다.";
            actionAdvice = "오늘 12운성 **" + twelveStage + "**의 기운을 타고 직관력이 매우 예리해지니 본인의 첫 느낌과 판단을 믿으셔도 좋습니다.";
        } else if (containsAny(lower, "죽는", "죽었", "시체", "피", "살인", "장례")) {
            dreamGrade = "✨ 역몽(逆夢) 대길조 — 액운 소멸·새출발 지수 93점";
            symbolAnalysis = "꿈에서 **내가 죽거나 시체·붉은 피를 보는 꿈**은 현실과 반대로 풀이하는 대표적인 **역몽(逆夢)이자 재생(再生)의 대길몽**입니다! 그동안 당신을 짓누르던 골칫거리와 액운이 완전히 소멸하고, 새로운 신분·재물·건강으로 거듭남을 뜻합니다.";
            actionAdvice = "과거의 막혔던 매듭이 풀리는 전환점이니 두려워하지 말고 새로운 계약이나 도전을 과감히 시작하세요.";
        } else if (containsAny(lower, "물", "바다", "강", "비", "홍수", "물고기", "잉어")) {
            dreamGrade = "💧 재원길몽(財源吉夢) — 감성·재물 순환 지수 89점";
            symbolAnalysis = "명리학에서 **맑은 물과 바다, 그 속을 헤엄치는 물고기·잉어**는 마르지 않는 **수(水)의 재원(財源)과 지혜, 창작의 원천**을 뜻합니다. 맑은 물이 차오르거나 물고기를 잡았다면 재물과 명예가 함께 들어오는 길조입니다.";
            actionAdvice = "귀하의 용신(**" + yongsin + "**)과 오늘의 **" + tenGod + "** 기운에 맞추어 유연하고 부드러운 소통으로 큰 실리를 챙기세요.";
        } else if (containsAny(lower, "이빨", "치아", "빠지", "깨지")) {
            dreamGrade = "⚠️ 신중경고몽(愼重夢) — 건강·대인 점검 지수 72점";
            symbolAnalysis = "전통 해몽에서 **치아(이빨)가 빠지거나 흔들리는 꿈**은 가족·친지·가까운 동료의 신변 변화나, 내 체력 저하 및 언행으로 인한 구설수를 미리 경계하라는 예지적 경고몽입니다. (단, 앓던 충치가 시원하게 빠졌다면 근심 해소의 길몽입니다.)";
            actionAdvice = "오늘은 무리한 일정이나 날카로운 직설화법을 피하고, 부모님이나 소중한 지인에게 먼저 안부 연락을 건네면 액땜(厄땜)이 됩니다.";
        } else if (containsAny(lower, "쫓기", "도망", "떨어지", "추락", "귀신", "가위")) {
            dreamGrade = "🕊️ 심리해소몽(心理解消夢) — 스트레스 완화·재정비";
            symbolAnalysis = "**누군가에게 쫓기거나 높은 곳에서 떨어지는 꿈**은 현재 현실에서 마감 기한, 책임감, 진로에 대한 무의식적 압박감(편관 칠살의 기운)이 높을 때 나타나는 전형적인 심몽(心夢)입니다.";
            actionAdvice = "흉조가 아니라 '잠시 숨을 고르라'는 몸의 신호입니다. 오늘 귀하의 용신(**" + yongsin + "**) 기운을 보충하는 따뜻한 차를 마시며 완벽주의의 짐을 잠시 내려놓으세요.";
        } else if (containsAny(lower, "조상", "할머니", "할아버지", "돌아가신")) {
            dreamGrade = "🙇 음덕예지몽(陰德豫知夢) — 조상 음덕·귀인 지수 92점";
            symbolAnalysis = "**돌아가신 조상님이 밝고 인자한 표정으로 나타나시거나 물건·음식을 주시는 꿈**은 집안의 음덕(陰德)과 천을귀인의 가호가 작동하여 위기를 넘기고 복록을 얻는 귀한 예지몽입니다.";
            actionAdvice = "조상님이 건네신 말씀이나 상징물을 잘 기억해 두시고, 오늘 중요한 결정을 내릴 때 정직과 정도(正道)를 택하시면 큰 복이 따릅니다.";
        } else {
            dreamGrade = "🌙 천명(天命) 종합 해몽 — 사주·일진 결합 진단";
            symbolAnalysis = "귀하가 꾸신 꿈은 무의식의 거울이자 오늘 흐르는 **" + tenGod + "(12운성 " + twelveStage + ")**의 천기(天氣)가 투영된 영적 신호입니다. 꿈속의 분위기가 밝고 선명했다면 소원 성취의 **길몽(吉夢)**이며, 놀라거나 어두웠다면 미리 조심하여 화를 복으로 바꾸는 **액땜의 계시**입니다.";
            actionAdvice = "**" + name + "** 님의 사주(**" + ilju + " · 용신 " + yongsin + "**) 기운으로 볼 때, 꿈에 나온 핵심 상징(예: 돼지, 용, 뱀, 불, 물, 치아, 조상님, 죽음 등)을 구체적으로 말씀해 주시면 더 정밀하게 길흉을 판별해 드립니다!";
        }

        return String.format(
                "🌙 **%s** 님의 꿈자리와 사주 일진을 대조하여 해몽해 드립니다.\n\n" +
                "• **[해몽 판정]**: **%s**\n" +
                "• **[동양 해몽 원전 풀이]**: %s\n" +
                "• **[사주·일진 결합 행동 지침]**: %s",
                name, dreamGrade, symbolAnalysis, actionAdvice
        );
    }
}
