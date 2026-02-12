package com.smartfactory.backend.member.repository;

import com.smartfactory.backend.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    // ID로 회원 찾기
    Optional<Member> findByUsername(String username);
}