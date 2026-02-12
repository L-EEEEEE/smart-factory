package com.smartfactory.backend.machine.service;

import com.smartfactory.backend.machine.repository.MachineRepository;
import com.smartfactory.backend.machine.domain.Machine;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.smartfactory.backend.machine.domain.MachineLog;
import com.smartfactory.backend.machine.repository.MachineLogRepository;

import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j // 로그 찍기용
public class SimulationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MachineRepository machineRepository; //
    private final MachineLogRepository machineLogRepository;
    private final Random random = new Random();

    @Getter
    private List<Machine> machines;

    @PostConstruct
    public void init() {
        // 1. 서버 시작 시 DB에서 기계 목록 가져오기
        log.info("📢 Loading machines from Database...");
        machines = machineRepository.findAll();

        if (machines.isEmpty()) {
            log.warn("⚠️ Warning: No machines found in DB! Check init.sql");
        } else {
            log.info("✅ Loaded {} machines.", machines.size());
        }
    }

    private void updateMachineMetrics(Machine m) {
        if (!"RUNNING".equals(m.getStatus()) && !"WARNING".equals(m.getStatus())) {
            return;
        }

        // PCB 장비별 특성 반영
        double tempBase = 0;
        double vibrationBase = 0;

        switch (m.getType()) {
            case "REFLOW": // 리플로우 오븐: 고온 유지 필수
                tempBase = 240.0;
                vibrationBase = 1.0;
                break;
            case "MOUNTER": // 마운터: 모터가 빨리 돌아서 진동/RPM 높음
                tempBase = 45.0;
                vibrationBase = 5.0;
                m.setRpm(3000 + random.nextInt(1000)); // 3000~4000 RPM
                break;
            default: // 일반 장비
                tempBase = 30.0;
                vibrationBase = 2.0;
                m.setRpm(random.nextInt(1000));
        }

        // 랜덤 변동폭 적용 (오븐은 온도 변화가 적고, 마운터는 진동 변화가 큼)
        double volatility = "WARNING".equals(m.getStatus()) ? 5.0 : 1.5;

        // 온도 시뮬레이션 (기존 값에서 조금씩 변하도록)
        double currentTemp = m.getTemperature() == 0 ? tempBase : m.getTemperature();
        double targetTemp = tempBase + (random.nextDouble() - 0.5) * volatility;
        // 서서히 목표 온도로 이동 (Smoothing)
        m.setTemperature(Math.round((currentTemp * 0.9 + targetTemp * 0.1) * 100) / 100.0);

        // 진동 시뮬레이션
        m.setVibration(Math.round((vibrationBase + (random.nextDouble() - 0.5) * volatility) * 100) / 100.0);

        // 생산량 증가 (AOI나 Unloader는 통과할 때마다 증가)
        if (random.nextDouble() > 0.1) m.setProductionCount(m.getProductionCount() + 1);

        // 0.5% 확률로 오븐 온도 저하 등 장애 발생
        if ("RUNNING".equals(m.getStatus()) && random.nextDouble() < 0.005) {
            m.setStatus("WARNING");
        }
    }

    // 제어 로직
    public void controlMachine(String id, String command) {
        machines.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .ifPresent(m -> {
                    if ("STOP".equals(command)) m.setStatus("STOPPED");
                    if ("START".equals(command)) m.setStatus("RUNNING");
                    if ("RESET".equals(command)) {
                        m.setStatus("IDLE");
                        m.setTemperature(40.0);
                    }
                    // (선택사항) 상태 변경은 중요하므로 DB에 저장해도 좋음
                    machineRepository.save(m);
                });
    }

    @Scheduled(fixedRate = 1000)
    public void simulateFactory() {
        if (machines == null || machines.isEmpty()) return;

        for (Machine m : machines) {
            updateMachineMetrics(m);

            // 👇 [핵심] 1초마다 이력 저장 (History Saving)
            // 실제 공장에서는 데이터 양이 많으므로 배치(Batch)로 처리하지만, 포트폴리오용으로는 실시간 저장이 더 직관적임
            if ("RUNNING".equals(m.getStatus()) || "WARNING".equals(m.getStatus())) {
                MachineLog log = MachineLog.builder()
                        .machineId(m.getId())
                        .temperature(m.getTemperature())
                        .vibration(m.getVibration())
                        .rpm(m.getRpm())
                        .powerUsage(m.getPowerUsage())
                        .recordedAt(LocalDateTime.now())
                        .build();

                machineLogRepository.save(log);
            }
        }

        // 실시간 전송 (WebSocket)
        messagingTemplate.convertAndSend("/topic/factory", machines);
    }
}