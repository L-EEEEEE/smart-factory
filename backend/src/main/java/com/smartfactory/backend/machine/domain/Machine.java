package com.smartfactory.backend.machine.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "machines")
@Data                       // Lombok: Getter, Setter 자동 생성
@Builder                    // Lombok: 디자인 패턴(Builder) 사용 가능
@AllArgsConstructor         // Lombok: 모든 필드를 포함한 생성자
@NoArgsConstructor          // Lombok: 기본 생성자 (JPA 필수!)
public class Machine {

    @Id // Primary Key (기본키) 지정
    private String id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String type;   // ROBOT_ARM, CONVEYOR, etc.
    @Column(nullable = false)
    private String status; // RUNNING, WARNING, ERROR...

    private String client;     // 발주처 (고객사)
    private String orderName;  // 주문명 (작업 이름)

    private double temperature;
    private int rpm;
    private double vibration;
    private int productionCount;
    private String lastUpdated;
}