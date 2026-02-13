package com.smartfactory.backend.machine.service;

import com.smartfactory.backend.machine.domain.Machine;
import com.smartfactory.backend.machine.domain.MachineLog;
import com.smartfactory.backend.machine.repository.MachineLogRepository;
import com.smartfactory.backend.machine.repository.MachineRepository;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class SimulationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MachineRepository machineRepository;
    private final MachineLogRepository machineLogRepository;
    private final Random random = new Random();

    // 시뮬레이션 중인 기계 목록을 메모리에 캐싱
    @Getter
    private List<Machine> machines;

    @PostConstruct
    public void init() {
        log.info("[Simulation] Loading machines from Database...");
        machines = machineRepository.findAll();

        if (machines.isEmpty()) {
            log.warn("[Simulation] No machines found! Please check 'data.sql'.");
        } else {
            log.info("[Simulation] Loaded {} machines.", machines.size());
        }
    }

    /**
     * 기계 제어 (START, STOP, RESET)
     * - DB와 메모리 리스트를 모두 업데이트합니다.
     */
    @Transactional
    public void controlMachine(String id, String command) {
        Optional<Machine> target = machineRepository.findById(id);

        if (target.isPresent()) {
            Machine m = target.get();

            switch (command) {
                case "START":
                    m.setStatus("RUNNING");
                    break;
                case "STOP":
                    m.setStatus("STOPPED");
                    break;
                case "RESET":
                    m.setStatus("STOPPED");
                    m.setProductionCount(0); // 생산량 초기화
                    m.setTemperature(20.0);  // 온도 초기화
                    break;
            }

            machineRepository.save(m); // DB 저장

            // 메모리 리스트도 갱신 (다시 로딩)
            machines = machineRepository.findAll();
            log.info("⚙️ Machine [{}] Command: {} -> Status: {}", id, command, m.getStatus());
        }
    }

    /**
     * 공장 시뮬레이션 (1초마다 실행)
     * - 각 기계의 타입(PRINTER, OVEN 등)에 따라 온도, RPM, 진동 변화
     * - 생산량 증가 로직
     */
    @Scheduled(fixedRate = 1000)
    @Transactional
    public void simulateFactory() {
        if (machines == null || machines.isEmpty()) return;

        for (Machine m : machines) {
            // 정지 상태면 수치 서서히 하락 (Cooling down)
            if ("STOPPED".equals(m.getStatus())) {
                coolDownMachine(m);
                continue;
            }

            // 가동 중일 때의 로직
            updateMachineMetrics(m);

            // 변경된 상태(생산량, 온도 등)를 DB에 저장 (중요! 안하면 새로고침시 초기화됨)
            machineRepository.save(m);

            // 로그 기록 (이력 데이터)
            saveMachineLog(m);
        }

        // 웹소켓으로 실시간 데이터 전송 (구독자들에게)
        messagingTemplate.convertAndSend("/topic/factory", machines);
    }

    // 기계별 특성 반영 로직
    private void updateMachineMetrics(Machine m) {
        double targetTemp = 25.0;
        double targetRpm = 0;
        double targetVib = 0;

        // data.sql의 타입에 맞춰 설정
        switch (m.getType()) {
            case "OVEN": // Reflow Oven: 고온 유지
                targetTemp = 240.0;
                targetRpm = 1200; // 팬 속도
                targetVib = 0.5;
                break;
            case "MOUNTER": // Chip Mounter: 엄청 빠른 속도와 진동
                targetTemp = 45.0;
                targetRpm = 3000 + random.nextInt(500);
                targetVib = 3.5 + random.nextDouble();
                break;
            case "PRINTER": // Solder Printer: 정밀 작업
                targetTemp = 26.0;
                targetRpm = 500;
                targetVib = 1.2;
                break;
            default: // INSPECTOR, UNLOADER 등
                targetTemp = 30.0;
                targetRpm = 100;
                targetVib = 0.2;
                break;
        }

        // 온도 시뮬레이션 (목표 온도까지 서서히 접근 + 약간의 노이즈)
        double currentTemp = m.getTemperature();
        double noise = (random.nextDouble() - 0.5) * 1.5; // ±0.75도 변동
        if (currentTemp < targetTemp) currentTemp += 2.5; // 가열 속도
        else if (currentTemp > targetTemp + 5) currentTemp -= 1.0; // 과열 시 냉각
        m.setTemperature(Math.round((currentTemp + noise) * 10.0) / 10.0);

        // RPM & 진동 적용
        m.setRpm((int) targetRpm);
        m.setVibration(Math.round(targetVib * 10.0) / 10.0);

        // 생산량 증가 (확률적 증가 - 기계마다 속도 다름)
        // Mounter는 빠르므로 확률 높게
        double productionRate = m.getType().equals("MOUNTER") ? 0.3 : 0.1;
        if (random.nextDouble() < productionRate) {
            m.setProductionCount(m.getProductionCount() + 1);
        }
    }

    // 기계가 꺼졌을 때 서서히 식는 로직
    private void coolDownMachine(Machine m) {
        if (m.getTemperature() > 25.0) {
            m.setTemperature(Math.round((m.getTemperature() - 0.5) * 10.0) / 10.0);
        }
        m.setRpm(0);
        m.setVibration(0);
        machineRepository.save(m); // 식는 과정도 저장
    }

    // 로그 저장 (JPA Entity Builder 사용)
    private void saveMachineLog(Machine m) {
        MachineLog log = MachineLog.builder()
                .machineId(m.getId())
                .temperature(m.getTemperature())
                .rpm(m.getRpm())
                .vibration(m.getVibration())
                .status(m.getStatus())
                .productionCount(m.getProductionCount())
                .orderName(m.getOrderName())                  // 단순히 기계 온도만 기록하는 게 아니라, '어떤 주문(제품)'을 생산할 때 부하가 많이 걸리는지 분석하기 위해 주문명(Order Name)도 이력에 함께 남기도록 설계
                .recordedAt(LocalDateTime.now())
                .build();

        machineLogRepository.save(log);
    }
}