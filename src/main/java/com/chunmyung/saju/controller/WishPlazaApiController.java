package com.chunmyung.saju.controller;

import com.chunmyung.saju.dto.ApiResponseDto;
import com.chunmyung.saju.security.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/plaza")
@Tag(name = "천명 3D 연등광장 소원 & 성취 축하 API", description = "연등광장 내부 소원판 동기화, 타 이용자 소원 8개 단위(offset) 조회 및 소원 성취 실시간 축하 API")
public class WishPlazaApiController {

    private final CopyOnWriteArrayList<PlazaWishDto> wishes = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<PlazaFulfillmentDto> fulfillments = new CopyOnWriteArrayList<>();
    private final ConcurrentHashMap<String, AtomicInteger> userCongratsCounter = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(2000L);
    private static final int MAX_CONGRATS_PER_USER = 3;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlazaWishDto {
        private long id;
        private String category;
        private String author;
        private String text;
        private int cheers;
        private String date;
        private boolean fulfilled;
        private String fulfillmentStory;
        private int congratsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlazaFulfillmentDto {
        private long id;
        private long wishId;
        private String category;
        private String author;
        private String wishText;
        private String fulfillmentStory;
        private int congratsCount;
        private String date;
    }

    @PostConstruct
    public void seedInitialData() {
        wishes.add(new PlazaWishDto(101L, "🌿 건강·장수", "어머니의 딸 김도반",
                "다음 주 어머니 큰 수술 무사히 잘 마치시고, 다시 환하게 웃으시며 온 가족 모여 따뜻한 밥상 함께할 수 있기를 간절히 기도합니다.",
                284, "2026. 11. 22.", true, "어머니 수술이 기적처럼 성공적으로 끝나 오늘 일반 병실로 옮기셨습니다! 함께 기도해주신 도반님들 덕분입니다.", 42));
        wishes.add(new PlazaWishDto(102L, "🎓 시험·합격", "새벽별 임용고시생",
                "3년 동안 준비한 중등 임용고시, 이번에는 반드시 합격하여 아이들에게 온기를 전하는 교사가 되고 싶습니다.",
                196, "2026. 11. 21.", false, null, 0));
        wishes.add(new PlazaWishDto(103L, "🏡 가족·화목", "두 아이의 가장",
                "우리 네 식구 아프지 않고 날마다 웃음꽃 피는 한 해가 되기를 소망합니다.",
                153, "2026. 11. 20.", false, null, 0));
        wishes.add(new PlazaWishDto(104L, "💰 재물·번창", "작은식당 사장님",
                "골목 작은 국밥집을 시작한 지 1년이 되었습니다. 찾아오시는 손님들 모두 따뜻한 한 끼에 위로받고 가게도 번창하길 기원합니다.",
                138, "2026. 11. 20.", false, null, 0));
        wishes.add(new PlazaWishDto(105L, "💖 애정·인연", "봄날을 기다리는 이",
                "서로의 아픔을 보듬어주고 사계절을 함께 걸어갈 따뜻하고 선한 인연을 만나고 싶습니다.",
                119, "2026. 11. 19.", false, null, 0));
        wishes.add(new PlazaWishDto(106L, "🕊️ 마음·평안", "밤하늘 나그네",
                "불안과 걱정을 내려놓고 오늘 밤은 깊은 잠을 잘 수 있기를, 내일의 나에게 조금 더 다정해질 수 있기를 바랍니다.",
                104, "2026. 11. 19.", false, null, 0));
        wishes.add(new PlazaWishDto(107L, "🎓 시험·합격", "간호학과 4학년",
                "국가고시 전원 합격하고 환자분들의 손을 따뜻하게 잡아주는 멋진 간호사가 되겠습니다!",
                95, "2026. 11. 18.", false, null, 0));
        wishes.add(new PlazaWishDto(108L, "🌿 건강·장수", "효자 손자",
                "할아버지 할머니 오래오래 건강하셔서 손주 결혼하는 모습까지 꼭 지켜봐 주세요.",
                88, "2026. 11. 18.", false, null, 0));
        wishes.add(new PlazaWishDto(109L, "💰 재물·번창", "청년 창업가 박도반",
                "밤낮으로 준비한 첫 서비스가 세상에 좋은 가치를 전하고 팀원들 모두 보람과 결실을 맺기를 바랍니다.",
                79, "2026. 11. 17.", false, null, 0));
        wishes.add(new PlazaWishDto(110L, "🏡 가족·화목", "예비 신부",
                "다가오는 달에 올리는 결혼식과 새로운 출발에 축복과 평안이 가득하기를 소원합니다.",
                72, "2026. 11. 17.", false, null, 0));
        wishes.add(new PlazaWishDto(111L, "🕊️ 마음·평안", "수험생 어머니",
                "그동안 애쓴 우리 아이가 결과에 상관없이 스스로를 자랑스러워하며 평안한 마음을 갖기를 기도합니다.",
                67, "2026. 11. 16.", false, null, 0));
        wishes.add(new PlazaWishDto(112L, "💖 애정·인연", "오랜 친구",
                "멀어진 소중한 인연과 다시 마음이 닿아 웃으며 안부를 나눌 수 있는 날이 오기를 바랍니다.",
                61, "2026. 11. 16.", false, null, 0));

        fulfillments.add(PlazaFulfillmentDto.builder()
                .id(1001L)
                .wishId(101L)
                .category("🌿 건강·장수")
                .author("어머니의 딸 김도반")
                .wishText("다음 주 어머니 큰 수술 무사히 잘 마치시고, 다시 환하게 웃으시며 온 가족 모여 따뜻한 밥상 함께할 수 있기를 간절히 기도합니다.")
                .fulfillmentStory("어머니 수술이 기적처럼 성공적으로 끝나 오늘 일반 병실로 옮기셨습니다! 연등광장에서 함께 기도해주신 도반님들 진심으로 감사합니다.")
                .congratsCount(42)
                .date("2026. 11. 23.")
                .build());
    }

    @Operation(summary = "연등광장 내부 실시간 상태 조회 (소원 + 성취 축하 목록)")
    @GetMapping("/state")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getPlazaState() {
        return ResponseEntity.ok(ApiResponseDto.ok(
                Map.of(
                        "wishes", wishes,
                        "fulfillments", fulfillments,
                        "totalWishes", wishes.size()
                ),
                "연등광장 실시간 상태를 조회했습니다."
        ));
    }

    @Operation(summary = "타 이용자 소원함 페이지네이션 조회 (기본 limit=8, offset 단위)")
    @GetMapping("/wishes")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getPaginatedWishes(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "8") int limit) {
        int safeOffset = Math.max(0, offset);
        int safeLimit = Math.max(1, Math.min(20, limit));
        int total = wishes.size();
        int end = Math.min(total, safeOffset + safeLimit);
        List<PlazaWishDto> slice = safeOffset < total
                ? new ArrayList<>(wishes.subList(safeOffset, end))
                : List.of();
        return ResponseEntity.ok(ApiResponseDto.ok(
                Map.of(
                        "items", slice,
                        "offset", safeOffset,
                        "limit", safeLimit,
                        "total", total
                ),
                "타 이용자 소원 목록을 조회했습니다."
        ));
    }

    @Operation(summary = "새 소원 등록 (내 소원함 + 타 이용자 소원함 동시 반영)")
    @PostMapping("/wishes")
    public ResponseEntity<ApiResponseDto<PlazaWishDto>> createWish(@RequestBody Map<String, Object> body) {
        String category = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("category", "🌿 건강·장수")));
        String author = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("author", "익명의 도반")));
        String text = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("text", "")));
        if (text.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail("소원 내용을 입력해 주세요."));
        }
        long id = body.get("id") instanceof Number
                ? ((Number) body.get("id")).longValue()
                : idGenerator.incrementAndGet();
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy. MM. dd."));

        PlazaWishDto created = PlazaWishDto.builder()
                .id(id)
                .category(category)
                .author(author.isBlank() ? "익명의 도반" : author)
                .text(text)
                .cheers(1)
                .date(today)
                .fulfilled(false)
                .fulfillmentStory(null)
                .congratsCount(0)
                .build();

        wishes.add(0, created);
        return ResponseEntity.ok(ApiResponseDto.ok(created, "소원이 이루어졌다면, 다시 와서 알려주세요"));
    }

    @Operation(summary = "소원 응원하기")
    @PostMapping("/wishes/{id}/cheer")
    public ResponseEntity<ApiResponseDto<PlazaWishDto>> cheerWish(@PathVariable long id) {
        for (PlazaWishDto w : wishes) {
            if (w.getId() == id) {
                w.setCheers(w.getCheers() + 1);
                return ResponseEntity.ok(ApiResponseDto.ok(w, "도반님의 소원에 따뜻한 응원을 보냈습니다."));
            }
        }
        return ResponseEntity.badRequest().body(ApiResponseDto.fail("해당 소원을 찾을 수 없습니다."));
    }

    @Operation(summary = "소원 성취 소식 등록 (연등광장 내부 접속자들에게 축하 알림 발송)")
    @PostMapping("/fulfillments")
    public ResponseEntity<ApiResponseDto<PlazaFulfillmentDto>> reportFulfillment(@RequestBody Map<String, Object> body) {
        long wishId = body.get("wishId") instanceof Number ? ((Number) body.get("wishId")).longValue() : 0L;
        String category = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("category", "🌟 소원 성취")));
        String author = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("author", "천명 도반")));
        String wishText = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("wishText", "")));
        String story = SecurityUtils.sanitizeXss(String.valueOf(body.getOrDefault("fulfillmentStory", "")));

        if (story.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponseDto.fail("소원이 이루어진 소식을 적어주세요."));
        }

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy. MM. dd."));
        for (PlazaWishDto w : wishes) {
            if (w.getId() == wishId || (!wishText.isBlank() && w.getText().equals(wishText))) {
                w.setFulfilled(true);
                w.setFulfillmentStory(story);
                w.setCongratsCount(Math.max(1, w.getCongratsCount() + 1));
                category = w.getCategory();
                wishText = w.getText();
                break;
            }
        }

        PlazaFulfillmentDto dto = PlazaFulfillmentDto.builder()
                .id(idGenerator.incrementAndGet())
                .wishId(wishId)
                .category(category)
                .author(author)
                .wishText(wishText.isBlank() ? "간절히 품었던 소원" : wishText)
                .fulfillmentStory(story)
                .congratsCount(1)
                .date(today)
                .build();

        fulfillments.add(0, dto);
        return ResponseEntity.ok(ApiResponseDto.ok(dto, "소원 성취 소식이 연등광장에 전해졌습니다! 도반들의 축하를 받아보세요."));
    }

    @Operation(summary = "연등광장 내부에서 소원 성취한 도반에게 축하 보내기 (1인당 최대 3회 허용)")
    @PostMapping("/fulfillments/{id}/congratulate")
    public ResponseEntity<ApiResponseDto<PlazaFulfillmentDto>> congratulate(
            @PathVariable long id,
            @RequestHeader(value = "X-Plaza-Client", required = false) String clientId,
            HttpSession session) {
        String userKey = ((clientId != null && !clientId.isBlank()) ? clientId : session.getId()) + ":" + id;
        AtomicInteger counter = userCongratsCounter.computeIfAbsent(userKey, k -> new AtomicInteger(0));
        if (counter.get() >= MAX_CONGRATS_PER_USER) {
            return ResponseEntity.badRequest().body(
                    ApiResponseDto.fail("축하는 한 명당 최대 " + MAX_CONGRATS_PER_USER + "번까지만 보낼 수 있습니다. (3/3회 완료)")
            );
        }

        for (PlazaFulfillmentDto f : fulfillments) {
            if (f.getId() == id) {
                int myCount = counter.incrementAndGet();
                f.setCongratsCount(f.getCongratsCount() + 1);
                for (PlazaWishDto w : wishes) {
                    if (w.getId() == f.getWishId()) {
                        w.setCongratsCount(f.getCongratsCount());
                        break;
                    }
                }
                return ResponseEntity.ok(ApiResponseDto.ok(
                        f,
                        f.getAuthor() + " 님에게 따뜻한 축하를 전했습니다! (" + myCount + "/" + MAX_CONGRATS_PER_USER + "회)"
                ));
            }
        }
        return ResponseEntity.badRequest().body(ApiResponseDto.fail("해당 성취 소식을 찾을 수 없습니다."));
    }
}
