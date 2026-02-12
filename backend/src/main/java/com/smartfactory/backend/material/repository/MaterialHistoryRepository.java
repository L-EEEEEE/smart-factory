package com.smartfactory.backend.material.repository;

import com.smartfactory.backend.material.domain.MaterialHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialHistoryRepository extends JpaRepository<MaterialHistory, Long> {

    // 특정 자재의 모든 이력 조회 (최신순 정렬)
    List<MaterialHistory> findByMaterialIdOrderByTransactionDateDesc(Long materialId);

    // 특정 작업자의 이력 조회
    List<MaterialHistory> findByWorker(String worker);
}
