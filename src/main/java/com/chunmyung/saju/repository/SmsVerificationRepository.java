package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.SmsVerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SmsVerificationRepository extends JpaRepository<SmsVerificationEntity, Long> {
    Optional<SmsVerificationEntity> findFirstByLoginIdAndIsVerifiedFalseOrderByCreatedAtDesc(String loginId);
}
