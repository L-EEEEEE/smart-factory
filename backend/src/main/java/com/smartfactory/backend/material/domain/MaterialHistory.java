package com.smartfactory.backend.material.domain;

import com.smartfactory.backend.global.constant.TransactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_history")
@Getter @Setter
@NoArgsConstructor
public class MaterialHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ⭐ 어떤 자재에 대한 기록인지 연결 (Foreign Key)
    @ManyToOne(fetch = FetchType.LAZY)  // 이력데이터 조회 시 Material 정보를 다 가져오지 않고 필요할때만(getMaterial 할때만 가져옴)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    // 입고/출고 구분
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    // 수량 (입고면 +, 출고면 - 로 계산하지 않고, 그냥 절대값으로 저장 후 Type으로 판단)
    @Column(nullable = false)
    private int quantity;

    // ⭐ 핵심: 이 작업 직후의 남은 재고량 (스냅샷)
    // 나중에 현재 재고랑 계산이 맞는지 검증할 때 필수. 이 필드 없다면 특정 시점의 재고를 알기 위해 처음부터 모든 IN/OUT 다 계산해야 함.
    private int stockAfterTransaction;

    // 작업자 (로그인한 사용자 ID 또는 이름)
    private String worker;

    // 비고 (예: "A라인 생산 투입", "불량 폐기" 등 사유)
    private String remarks;

    // 작업 일시
    @Column(nullable = false)
    private LocalDateTime transactionDate;

    // 생성자 편의 메서드 (객체 생성과 동시에 시간 기록)
    @PrePersist
    public void prePersist() {
        if (this.transactionDate == null) {
            this.transactionDate = LocalDateTime.now();
        }
    }
}
