-- 천명(天命) 사주 & 운세 시스템 스키마 DDL
-- 데이터베이스: chunmyung_saju

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 고유 식별자',
    name VARCHAR(50) NOT NULL COMMENT '이름 또는 닉네임',
    gender ENUM('M', 'F') NOT NULL COMMENT '성별 (M: 남성, F: 여성)',
    birth_type ENUM('SOLAR', 'LUNAR', 'LEAP_LUNAR') NOT NULL DEFAULT 'SOLAR' COMMENT '양력, 음력, 윤달',
    birth_year INT NOT NULL COMMENT '출생년도',
    birth_month INT NOT NULL COMMENT '출생월 (1-12)',
    birth_day INT NOT NULL COMMENT '출생일 (1-31)',
    birth_hour INT NULL COMMENT '출생시 (0-23, 모름일 경우 NULL)',
    birth_minute INT NULL COMMENT '출생분 (0-59, 모름일 경우 NULL)',
    is_time_unknown BOOLEAN NOT NULL DEFAULT FALSE COMMENT '출생시간 모름 여부',
    time_correction_applied BOOLEAN NOT NULL DEFAULT TRUE COMMENT '동경 135도 vs 서울 127.5도 30분 시차 보정 적용 여부',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 엔티티';

CREATE TABLE IF NOT EXISTS saju_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사주 원장 식별자',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK)',
    year_cheongan VARCHAR(10) NOT NULL COMMENT '년주 천간 (예: 甲)',
    year_jiji VARCHAR(10) NOT NULL COMMENT '년주 지지 (예: 子)',
    month_cheongan VARCHAR(10) NOT NULL COMMENT '월주 천간',
    month_jiji VARCHAR(10) NOT NULL COMMENT '월주 지지',
    day_cheongan VARCHAR(10) NOT NULL COMMENT '일주 천간 (일간 - 본원)',
    day_jiji VARCHAR(10) NOT NULL COMMENT '일주 지지',
    time_cheongan VARCHAR(10) NULL COMMENT '시주 천간 (시간 미입력 시 NULL)',
    time_jiji VARCHAR(10) NULL COMMENT '시주 지지 (시간 미입력 시 NULL)',
    day_master VARCHAR(10) NOT NULL COMMENT '본원 일간',
    ilju_name VARCHAR(20) NOT NULL COMMENT '일주 명칭 (예: 갑자, 병인)',
    zodiac_animal VARCHAR(20) NOT NULL COMMENT '띠 동물 (예: 청룡, 붉은 호랑이)',
    ilju_description TEXT NULL COMMENT '60갑자 일주론 상세 해설',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '분석 생성 일시',
    CONSTRAINT fk_saju_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사주팔자 만세력 분석 엔티티';

CREATE TABLE IF NOT EXISTS five_elements_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '오행 밸런스 식별자',
    saju_record_id BIGINT NOT NULL COMMENT '사주 원장 ID (FK)',
    wood_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '목(木) 비율 %',
    fire_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '화(火) 비율 %',
    earth_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '토(土) 비율 %',
    metal_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '금(金) 비율 %',
    water_ratio DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '수(水) 비율 %',
    dominant_element VARCHAR(20) NOT NULL COMMENT '가장 강한 오행',
    deficient_element VARCHAR(20) NOT NULL COMMENT '가장 부족한 오행',
    strength_status VARCHAR(30) NOT NULL COMMENT '신강/신약 판정 (극왕, 신강, 중화, 신약, 극약)',
    yongsin VARCHAR(30) NOT NULL COMMENT '조후/억부 추천 용신(用神)',
    analysis_text TEXT NULL COMMENT '오행 분석 종합 소견',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    CONSTRAINT fk_five_elements_saju FOREIGN KEY (saju_record_id) REFERENCES saju_records (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='오행 에너지 비율 및 신강약 엔티티';

CREATE TABLE IF NOT EXISTS sinsal_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '신살 기록 식별자',
    saju_record_id BIGINT NOT NULL COMMENT '사주 원장 ID (FK)',
    pillar_type ENUM('YEAR', 'MONTH', 'DAY', 'TIME', 'GENERAL') NOT NULL COMMENT '해당 기둥 (년/월/일/시/종합)',
    sinsal_name VARCHAR(50) NOT NULL COMMENT '신살 명칭 (천을귀인, 도화살, 역마살 등)',
    sinsal_type ENUM('AUSPICIOUS', 'INAUSPICIOUS', 'NEUTRAL') NOT NULL DEFAULT 'NEUTRAL' COMMENT '길신/흉신/중립 구분',
    description TEXT NOT NULL COMMENT '현대적 신살 해석 및 조언',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    CONSTRAINT fk_sinsal_saju FOREIGN KEY (saju_record_id) REFERENCES saju_records (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='8대 신살 분석 엔티티';

CREATE TABLE IF NOT EXISTS daily_fortunes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '일일 운세 식별자',
    user_id BIGINT NOT NULL COMMENT '사용자 ID (FK)',
    fortune_date DATE NOT NULL COMMENT '운세 날짜 (YYYY-MM-DD)',
    today_gapja VARCHAR(20) NOT NULL COMMENT '오늘의 일진 60갑자 (예: 戊戌)',
    total_score INT NOT NULL COMMENT '종합 운세 점수 (0-100)',
    wealth_score INT NOT NULL COMMENT '재물운 점수 (0-100)',
    love_score INT NOT NULL COMMENT '애정/연애운 점수 (0-100)',
    career_score INT NOT NULL COMMENT '직업/학업운 점수 (0-100)',
    health_score INT NOT NULL COMMENT '건강운 점수 (0-100)',
    lucky_color VARCHAR(30) NOT NULL COMMENT '행운의 컬러',
    lucky_number VARCHAR(20) NOT NULL COMMENT '행운의 숫자',
    lucky_direction VARCHAR(30) NOT NULL COMMENT '행운의 방위',
    overall_advice TEXT NOT NULL COMMENT '오늘의 천기 총평 및 행동 지침',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '기록 일시',
    CONSTRAINT fk_fortune_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='오늘의 일일 운세 엔티티';

CREATE TABLE IF NOT EXISTS compatibility_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '궁합 식별자',
    user1_id BIGINT NOT NULL COMMENT '본인 사용자 ID (FK)',
    user2_id BIGINT NOT NULL COMMENT '상대방 사용자 ID (FK)',
    score INT NOT NULL COMMENT '궁합 지수 (0-100)',
    grade VARCHAR(30) NOT NULL COMMENT '궁합 등급 (천생연분, 백년해로, 상호보완, 노력필요 등)',
    cheongan_harmony TEXT NULL COMMENT '천간 합충극 분석 (생화극제)',
    jiji_harmony TEXT NULL COMMENT '지지 삼합/육합/원진/충 분석',
    relationship_advice TEXT NOT NULL COMMENT '관계 개선 및 사랑 조언',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
    CONSTRAINT fk_compat_user1 FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_compat_user2 FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='2인 궁합 분석 엔티티';

CREATE TABLE IF NOT EXISTS tarot_readings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '타로 기록 식별자',
    user_id BIGINT NULL COMMENT '사용자 ID (선택적 FK, 비회원 가능)',
    card_number INT NOT NULL COMMENT '카드 번호 (0: 바보 ~ 21: 세계)',
    card_name_kr VARCHAR(50) NOT NULL COMMENT '카드 한글명 (예: 0. 바보)',
    card_name_en VARCHAR(50) NOT NULL COMMENT '카드 영문명 (예: The Fool)',
    is_reversed BOOLEAN NOT NULL DEFAULT FALSE COMMENT '역방향 여부',
    keyword VARCHAR(100) NOT NULL COMMENT '핵심 키워드',
    interpretation TEXT NOT NULL COMMENT '점괘 해석 내용',
    advice TEXT NOT NULL COMMENT '카드가 주는 실천 조언',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '뽑은 일시',
    CONSTRAINT fk_tarot_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='타로 카드 점괘 엔티티';

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '결제 고유 식별자',
    user_id BIGINT NOT NULL COMMENT '결제 사용자 ID (FK)',
    saju_record_id BIGINT NULL COMMENT '연동된 사주 원장 ID (FK)',
    merchant_uid VARCHAR(60) NOT NULL UNIQUE COMMENT '가맹점 주문 고유번호 (예: ORD-20261120-123456)',
    product_type VARCHAR(40) NOT NULL DEFAULT 'SAJU_FULL_REPORT' COMMENT '상품 코드 (SAJU_FULL_REPORT 등)',
    product_name VARCHAR(100) NOT NULL COMMENT '결제 상품명',
    payment_method ENUM('TOSS_PAY', 'KAKAO_PAY', 'NAVER_PAY') NOT NULL COMMENT '간편결제 수단 (토스페이, 카카오페이, 네이버페이)',
    amount INT NOT NULL DEFAULT 500 COMMENT '결제 금액 (기본 500원)',
    payment_status ENUM('PAID', 'CANCELLED') NOT NULL DEFAULT 'PAID' COMMENT '결제 상태',
    pg_tid VARCHAR(80) NOT NULL COMMENT 'PG사 거래 승인번호',
    paid_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '결제 승인 일시',
    CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_saju FOREIGN KEY (saju_record_id) REFERENCES saju_records (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='유료 사주 500원 간편결제(토스/카카오/네이버페이) 원장 엔티티';

CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '계정 고유 식별자',
    login_id VARCHAR(40) NOT NULL UNIQUE COMMENT '로그인 아이디 (영문/숫자 4~20자)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'PBKDF2WithHmacSHA256 단방향 암호화 해시',
    password_salt VARCHAR(120) NOT NULL COMMENT '계정별 고유 16바이트 랜덤 Salt',
    name VARCHAR(50) NOT NULL COMMENT '회원 이름 또는 닉네임',
    phone_number VARCHAR(25) NOT NULL COMMENT '휴대폰 번호 (SMS 보안 경고 및 휴면 해제 인증용)',
    gender VARCHAR(10) NOT NULL DEFAULT 'M' COMMENT '성별 (M/F)',
    birth_year INT NULL COMMENT '출생년도',
    birth_month INT NULL COMMENT '출생월',
    birth_day INT NULL COMMENT '출생일',
    failed_attempts INT NOT NULL DEFAULT 0 COMMENT '비밀번호 연속 실패 횟수 (5회 경고문자, 10회 휴면화)',
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' COMMENT '계정 권한 (ROLE_USER: 일반회원, ROLE_ADMIN: 최고관리자)',
    account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' COMMENT '계정 상태 (ACTIVE, WARNING_SMS_SENT, DORMANT_LOCKED)',
    last_failed_at DATETIME NULL COMMENT '마지막 로그인 실패 일시',
    last_login_at DATETIME NULL COMMENT '마지막 로그인 성공 일시',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '회원가입 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='웹 회원가입 및 보안 로그인 계정 엔티티';

CREATE TABLE IF NOT EXISTS sms_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'SMS 인증 고유 식별자',
    login_id VARCHAR(40) NOT NULL COMMENT '대상 로그인 아이디',
    phone_number VARCHAR(25) NOT NULL COMMENT '수신 휴대폰 번호',
    verification_code VARCHAR(10) NOT NULL COMMENT '6자리 인증번호',
    purpose VARCHAR(30) NOT NULL COMMENT '발송 목적 (FAILED_5_ALERT, DORMANT_UNLOCK)',
    message_content VARCHAR(255) NOT NULL COMMENT '발송된 SMS 문자 메시지 전문',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT '인증 완료 여부',
    expires_at DATETIME NOT NULL COMMENT '인증번호 만료 일시 (5분)',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '발송 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='휴대폰 SMS 보안 경고 및 휴면 계정 해제 인증 엔티티';

CREATE TABLE IF NOT EXISTS ai_chat_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'AI 상담 로그 식별자',
    user_name VARCHAR(50) NULL COMMENT '상담 사용자 이름',
    ilju_name VARCHAR(30) NULL COMMENT '연동된 사주 일주명',
    yongsin VARCHAR(30) NULL COMMENT '연동된 추천 용신',
    intent_category VARCHAR(40) NOT NULL COMMENT '질문 의도 분류 (DREAM_INTERPRETATION, WEALTH, LOVE, CAREER 등)',
    user_message TEXT NOT NULL COMMENT '사용자 질문 원문',
    ai_response TEXT NOT NULL COMMENT 'AI 명리·해몽 도사 답변',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '상담 일시'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='내장 AI 명리·꿈해몽 도사 챗봇 상담 이력 엔티티';



