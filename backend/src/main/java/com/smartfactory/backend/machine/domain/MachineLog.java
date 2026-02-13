package com.smartfactory.backend.machine.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "machine_logs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MachineLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @Column(name = "machine_id", nullable = false)
    private String machineId;

    // 🏭 [추가] 상태와 생산량, 주문 정보 (분석의 핵심)
    private String status;          // 당시 상태 (RUNNING, STOPPED...)

    @Column(name = "production_count")
    private int productionCount;    // 당시 누적 생산량 (생산 속도 분석용)

    @Column(name = "order_name")
    private String orderName;       // 당시 작업 중이던 주문명 (예: Galaxy S24 Mainboard)

    // 물리 센서 데이터
    private double temperature;
    private double vibration;
    private int rpm;

    // private double powerUsage; // (삭제 추천: 시뮬레이션에서 계산 안 하므로 불필요하면 제거)

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;
}