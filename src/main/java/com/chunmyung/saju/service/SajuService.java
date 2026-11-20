package com.chunmyung.saju.service;

import com.chunmyung.saju.dto.*;
import com.chunmyung.saju.entity.*;
import com.chunmyung.saju.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SajuService {

    private final UserRepository userRepository;
    private final SajuRecordRepository sajuRecordRepository;
    private final DailyFortuneRepository dailyFortuneRepository;
    private final CompatibilityRepository compatibilityRepository;
    private final TarotRepository tarotRepository;
    private final SajuJdbcRepository sajuJdbcRepository;

    /**
     * 사용자 정보 조회 또는 신규 등록 (Upsert 로직)
     */
    @Transactional
    public UserEntity findOrCreateUser(String name, String gender, String birthType,
                                      Integer year, Integer month, Integer day,
                                      Integer hour, Integer minute,
                                      Boolean isTimeUnknown, Boolean timeCorrectionApplied) {
        return userRepository.findByNameAndBirthYearAndBirthMonthAndBirthDay(name, year, month, day)
                .map(existingUser -> {
                    existingUser.setGender(gender);
                    existingUser.setBirthType(birthType != null ? birthType : "SOLAR");
                    existingUser.setBirthHour(hour);
                    existingUser.setBirthMinute(minute);
                    existingUser.setIsTimeUnknown(Boolean.TRUE.equals(isTimeUnknown));
                    existingUser.setTimeCorrectionApplied(timeCorrectionApplied == null || timeCorrectionApplied);
                    return existingUser;
                })
                .orElseGet(() -> {
                    UserEntity newUser = UserEntity.builder()
                            .name(name)
                            .gender(gender)
                            .birthType(birthType != null ? birthType : "SOLAR")
                            .birthYear(year)
                            .birthMonth(month)
                            .birthDay(day)
                            .birthHour(hour)
                            .birthMinute(minute)
                            .isTimeUnknown(Boolean.TRUE.equals(isTimeUnknown))
                            .timeCorrectionApplied(timeCorrectionApplied == null || timeCorrectionApplied)
                            .build();
                    return userRepository.save(newUser);
                });
    }

    /**
     * 사주팔자 분석 결과 DB 저장 (사주원장, 오행분석, 신살들 엔티티 연관관계 매핑)
     */
    @Transactional
    public Long saveSajuRecord(SajuSaveRequestDto req) {
        log.info("==> [DB 저장] 사주 분석 저장 요청: 사용자={}", req.getName());

        UserEntity user = findOrCreateUser(
                req.getName(), req.getGender(), req.getBirthType(),
                req.getBirthYear(), req.getBirthMonth(), req.getBirthDay(),
                req.getBirthHour(), req.getBirthMinute(),
                req.getIsTimeUnknown(), req.getTimeCorrectionApplied()
        );

        // 1. 사주 원장 엔티티 생성
        SajuRecordEntity sajuRecord = SajuRecordEntity.builder()
                .user(user)
                .yearCheongan(req.getYearCheongan())
                .yearJiji(req.getYearJiji())
                .monthCheongan(req.getMonthCheongan())
                .monthJiji(req.getMonthJiji())
                .dayCheongan(req.getDayCheongan())
                .dayJiji(req.getDayJiji())
                .timeCheongan(req.getTimeCheongan())
                .timeJiji(req.getTimeJiji())
                .dayMaster(req.getDayMaster())
                .iljuName(req.getIljuName())
                .zodiacAnimal(req.getZodiacAnimal())
                .iljuDescription(req.getIljuDescription())
                .build();

        // 2. 오행 밸런스 엔티티 연관관계 설정
        if (req.getWoodRatio() != null) {
            FiveElementsEntity fiveElements = FiveElementsEntity.builder()
                    .sajuRecord(sajuRecord)
                    .woodRatio(req.getWoodRatio())
                    .fireRatio(req.getFireRatio())
                    .earthRatio(req.getEarthRatio())
                    .metalRatio(req.getMetalRatio())
                    .waterRatio(req.getWaterRatio())
                    .dominantElement(req.getDominantElement() != null ? req.getDominantElement() : "-")
                    .deficientElement(req.getDeficientElement() != null ? req.getDeficientElement() : "-")
                    .strengthStatus(req.getStrengthStatus() != null ? req.getStrengthStatus() : "중화")
                    .yongsin(req.getYongsin() != null ? req.getYongsin() : "-")
                    .analysisText(req.getAnalysisText())
                    .build();
            sajuRecord.setFiveElements(fiveElements);
        }

        // 3. 신살 목록 연관관계 설정
        if (req.getSinsals() != null && !req.getSinsals().isEmpty()) {
            List<SinsalEntity> sinsalEntities = new ArrayList<>();
            for (SajuSaveRequestDto.SinsalDto sDto : req.getSinsals()) {
                SinsalEntity sinsal = SinsalEntity.builder()
                        .sajuRecord(sajuRecord)
                        .pillarType(sDto.getPillarType() != null ? sDto.getPillarType() : "GENERAL")
                        .sinsalName(sDto.getSinsalName())
                        .sinsalType(sDto.getSinsalType() != null ? sDto.getSinsalType() : "NEUTRAL")
                        .description(sDto.getDescription())
                        .build();
                sinsalEntities.add(sinsal);
            }
            sajuRecord.setSinsals(sinsalEntities);
        }

        SajuRecordEntity saved = sajuRecordRepository.save(sajuRecord);
        log.info("==> [DB 저장 완료] 사주 원장 ID={}", saved.getId());
        return saved.getId();
    }

    /**
     * 일일 운세 저장
     */
    @Transactional
    public Long saveDailyFortune(DailyFortuneSaveRequestDto req) {
        UserEntity user = findOrCreateUser(
                req.getName(), req.getGender(), "SOLAR",
                req.getBirthYear(), req.getBirthMonth(), req.getBirthDay(),
                null, null, true, true
        );

        LocalDate date = req.getFortuneDate() != null ? req.getFortuneDate() : LocalDate.now();

        DailyFortuneEntity fortune = dailyFortuneRepository.findByUserIdAndFortuneDate(user.getId(), date)
                .orElseGet(() -> DailyFortuneEntity.builder()
                        .user(user)
                        .fortuneDate(date)
                        .build());

        fortune.setTodayGapja(req.getTodayGapja());
        fortune.setTotalScore(req.getTotalScore());
        fortune.setWealthScore(req.getWealthScore());
        fortune.setLoveScore(req.getLoveScore());
        fortune.setCareerScore(req.getCareerScore());
        fortune.setHealthScore(req.getHealthScore());
        fortune.setLuckyColor(req.getLuckyColor());
        fortune.setLuckyNumber(req.getLuckyNumber());
        fortune.setLuckyDirection(req.getLuckyDirection());
        fortune.setOverallAdvice(req.getOverallAdvice());

        DailyFortuneEntity saved = dailyFortuneRepository.save(fortune);
        return saved.getId();
    }

    /**
     * 궁합 기록 저장
     */
    @Transactional
    public Long saveCompatibility(CompatibilitySaveRequestDto req) {
        UserEntity user1 = findOrCreateUser(
                req.getUser1Name(), req.getUser1Gender(), "SOLAR",
                req.getUser1BirthYear(), req.getUser1BirthMonth(), req.getUser1BirthDay(),
                null, null, true, true
        );

        UserEntity user2 = findOrCreateUser(
                req.getUser2Name(), req.getUser2Gender(), "SOLAR",
                req.getUser2BirthYear(), req.getUser2BirthMonth(), req.getUser2BirthDay(),
                null, null, true, true
        );

        CompatibilityEntity compat = CompatibilityEntity.builder()
                .user1(user1)
                .user2(user2)
                .score(req.getScore())
                .grade(req.getGrade())
                .cheonganHarmony(req.getCheonganHarmony())
                .jijiHarmony(req.getJijiHarmony())
                .relationshipAdvice(req.getRelationshipAdvice())
                .build();

        return compatibilityRepository.save(compat).getId();
    }

    /**
     * 타로 점괘 저장
     */
    @Transactional
    public Long saveTarotReading(TarotSaveRequestDto req) {
        UserEntity user = null;
        if (req.getUserId() != null) {
            user = userRepository.findById(req.getUserId()).orElse(null);
        }

        TarotEntity tarot = TarotEntity.builder()
                .user(user)
                .cardNumber(req.getCardNumber())
                .cardNameKr(req.getCardNameKr())
                .cardNameEn(req.getCardNameEn())
                .isReversed(Boolean.TRUE.equals(req.getIsReversed()))
                .keyword(req.getKeyword())
                .interpretation(req.getInterpretation())
                .advice(req.getAdvice())
                .build();

        return tarotRepository.save(tarot).getId();
    }

    /**
     * JDBC 직접 쿼리 실행: 최근 사주 분석 기록 및 통계 조회
     */
    public List<Map<String, Object>> getRecentSajuListViaJdbc(int limit) {
        return sajuJdbcRepository.findRecentSajuHistory(limit);
    }

    /**
     * JDBC 연결 상태 진단
     */
    public boolean testJdbcConnection() {
        return sajuJdbcRepository.checkJdbcConnection();
    }
}
