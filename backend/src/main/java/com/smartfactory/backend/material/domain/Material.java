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
    private Long id; // DB 내부 관리용 ID (1, 2, 3...)

    @Column(nullable = false, unique = true)
    private String itemCode; // 품목 코드 (예: MAT-001)

    @Column(nullable = false)
    private String itemName; // 자재명 (예: FR-4 Copper Board)

    @Column(nullable = false)
    private String category; // 분류 (RAW: 원자재, CLIENT: 사급자재, CHEMICAL: 화학약품)

    private int currentStock; // 현재 재고량

    private int safetyStock;  // 안전 재고량 (이 밑으로 떨어지면 경고)

    //[추가] PCB 공장은 단위가 다양함 (장, 리터, 롤, 개)
    @Column(nullable = false)
    private String unit;

    //[추가] 파운드리 핵심: 누구 자재인가? (자사 구매 vs 고객사 지급)
    private String supplier;

    private double unitPrice; // 단가 (원가 계산용)

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