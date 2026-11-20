package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.AiChatLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatLogRepository extends JpaRepository<AiChatLogEntity, Long> {
    List<AiChatLogEntity> findTop15ByOrderByCreatedAtDesc();
}
