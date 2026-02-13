package com.smartfactory.backend.machine.controller;

import com.smartfactory.backend.machine.domain.MachineLog;
import com.smartfactory.backend.machine.repository.MachineLogRepository;
import com.smartfactory.backend.machine.domain.Machine;
import com.smartfactory.backend.machine.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final SimulationService simulationService;
    private final MachineLogRepository machineLogRepository;

    // [초기 데이터] 화면 on -> "현재 기계 목록 조회"
    @GetMapping
    public List<Machine> getAllMachines() {
        // 서비스가 기억하고 있는 최신 기계 리스트를 반환
        return simulationService.getMachines();
    }

    // [명령] "1번 기계 정지" (버튼 클릭 시 호출)
    @PostMapping("/{id}/control")
    public void controlMachine(@PathVariable String id, @RequestBody Map<String, String> payload) {
        // payload: { "command": "STOP" }
        String command = payload.get("command");

        System.out.println("Command received: " + command + " for " + id);

        // 서비스에게 명령 전달
        simulationService.controlMachine(id, command);
    }

    @GetMapping("/{id}/logs")
    public List<MachineLog> getMachineLogs(@PathVariable String id) {
        return machineLogRepository.findTop100ByMachineIdOrderByRecordedAtDesc(id);
    }
}