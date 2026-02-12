package com.smartfactory.backend.machine.repository;

import com.smartfactory.backend.machine.domain.MachineLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MachineLogRepository extends JpaRepository<MachineLog, Long> {

    // 특정 기계의 로그를 "최신순으로 100개만" 가져오기
    // 이유: 차트에 수만 개의 점을 다 찍으면 브라우저가 느려지므로, 최근 100개만 출력.
    List<MachineLog> findTop100ByMachineIdOrderByRecordedAtDesc(String machineId);
}