package com.smartfactory.backend.member.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "members")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    @Id
    @Column(unique = true, nullable = false)
    private String username; // 아이디 (ID)

    @Column(nullable = false)
    private String password; // 암호화된 비밀번호

    @Column(nullable = false)
    private String role; // 권한 (ROLE_ADMIN, ROLE_USER)

    // 단순화를 위해 권한 반환 메서드 추가
    public List<String> getRoles() {
        return Collections.singletonList(role);
    }
}
