package com.smartfactory.backend.material.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Getter @Setter
@NoArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String itemCode; // 품목 코드 (예: MAT-001)

    @Column(nullable = false)
    private String itemName; // 자재명 (예: 철판, 나사)

    @Column(nullable = false)
    private String category; // 분류 (예: 원자재, 부품, 완제품)

    private int currentStock; // 현재 재고량

    private int safetyStock;  // 안전 재고량 (이 밑으로 떨어지면 경고)

    private double unitPrice; // 단가

    @Column(updatable = false)
    private LocalDateTime createdAt; // 등록일

    private LocalDateTime updatedAt; // 수정일

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}