package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.TarotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TarotRepository extends JpaRepository<TarotEntity, Long> {
    List<TarotEntity> findTop10ByOrderByCreatedAtDesc();
}
