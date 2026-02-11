package com.smartfactory.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "machine_logs") // DB의 machine_logs 테이블과 연결
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MachineLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment (1, 2, 3...)
    private Long logId;

    @Column(name = "machine_id", nullable = false)
    private String machineId; // 어떤 기계의 로그인지 (예: MAC-1000)

    private double temperature;
    private double vibration;
    private int rpm;
    private double powerUsage;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt; // 기록된 시간
}
