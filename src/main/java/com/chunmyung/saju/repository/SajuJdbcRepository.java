package com.chunmyung.saju.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 * Spring JDBC / JdbcTemplate 기반 Repository
 * 인텔리제이 및 순수 JDBC 연동 학습과 고성능 직접 SQL 쿼리 실행을 지원합니다.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class SajuJdbcRepository {

    private final JdbcTemplate jdbcTemplate;
    private final DataSource dataSource;

    /**
     * JDBC 연결 상태 및 메타데이터 진단
     */
    public boolean checkJdbcConnection() {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            log.info("==> [JDBC OK] Driver: {}, URL: {}, DB Product: {}",
                    metaData.getDriverName(),
                    metaData.getURL(),
                    metaData.getDatabaseProductName());
            return true;
        } catch (SQLException e) {
            log.error("==> [JDBC ERROR] 연결 실패: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * JDBC를 이용한 전체 사용자 수 카운트
     */
    public int countTotalUsers() {
        String sql = "SELECT COUNT(*) FROM users";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count : 0;
    }

    /**
     * JDBC를 이용한 사용자별 최근 사주 4주 8자 조회 (JOIN 쿼리)
     */
    public List<Map<String, Object>> findRecentSajuHistory(int limit) {
        String sql = """
            SELECT 
                u.id AS user_id,
                u.name,
                u.gender,
                u.birth_year,
                u.birth_month,
                u.birth_day,
                s.id AS saju_id,
                s.year_cheongan,
                s.year_jiji,
                s.month_cheongan,
                s.month_jiji,
                s.day_cheongan,
                s.day_jiji,
                s.time_cheongan,
                s.time_jiji,
                s.ilju_name,
                s.zodiac_animal,
                f.wood_ratio,
                f.fire_ratio,
                f.earth_ratio,
                f.metal_ratio,
                f.water_ratio,
                f.strength_status,
                f.yongsin,
                s.created_at
            FROM saju_records s
            INNER JOIN users u ON s.user_id = u.id
            LEFT JOIN five_elements_balances f ON f.saju_record_id = s.id
            ORDER BY s.created_at DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    /**
     * JDBC를 이용한 오행 신강/신약 분포 통계
     */
    public List<Map<String, Object>> getStrengthStatusStatistics() {
        String sql = """
            SELECT strength_status, COUNT(*) as count 
            FROM five_elements_balances 
            GROUP BY strength_status
        """;
        return jdbcTemplate.queryForList(sql);
    }
}
