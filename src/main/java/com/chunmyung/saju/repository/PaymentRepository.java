package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    List<PaymentEntity> findByUserIdAndPaymentStatusOrderByPaidAtDesc(Long userId, String paymentStatus);
    Optional<PaymentEntity> findFirstByUserIdAndPaymentStatusOrderByPaidAtDesc(Long userId, String paymentStatus);
}
