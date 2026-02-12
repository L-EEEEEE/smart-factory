package com.smartfactory.backend.material.repository;

import com.smartfactory.backend.material.domain.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {
    // 품목 코드로 자재 찾기
    Optional<Material> findByItemCode(String itemCode);

    // 재고가 안전 재고보다 적은 자재들 찾기 (경고용)
    // List<Material> findByCurrentStockLessThan(int safetyStock); (필요시 주석 해제)
}