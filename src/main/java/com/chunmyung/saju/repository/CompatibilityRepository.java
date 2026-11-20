package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.CompatibilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompatibilityRepository extends JpaRepository<CompatibilityEntity, Long> {
    List<CompatibilityEntity> findByUser1IdOrderByCreatedAtDesc(Long user1Id);
}
