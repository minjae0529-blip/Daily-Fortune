package com.chunmyung.saju.repository;

import com.chunmyung.saju.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByNameAndBirthYearAndBirthMonthAndBirthDay(
            String name, Integer birthYear, Integer birthMonth, Integer birthDay
    );
}
