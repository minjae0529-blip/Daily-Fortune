package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.SajuRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SajuRecordRepository extends JpaRepository<SajuRecordEntity, Long> {
    List<SajuRecordEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
}
