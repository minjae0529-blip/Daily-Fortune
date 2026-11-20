package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.DailyFortuneEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyFortuneRepository extends JpaRepository<DailyFortuneEntity, Long> {
    List<DailyFortuneEntity> findByUserIdOrderByFortuneDateDesc(Long userId);
    Optional<DailyFortuneEntity> findByUserIdAndFortuneDate(Long userId, LocalDate fortuneDate);
}
