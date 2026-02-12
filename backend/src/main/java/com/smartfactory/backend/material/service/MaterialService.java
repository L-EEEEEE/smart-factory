package com.smartfactory.backend.material.service;

import com.smartfactory.backend.material.domain.Material;
import com.smartfactory.backend.material.domain.MaterialHistory;
import com.smartfactory.backend.material.repository.MaterialHistoryRepository;
import com.smartfactory.backend.material.repository.MaterialRepository;
import com.smartfactory.backend.global.constant.TransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true) // 기본적으로 읽기 전용 (조회 성능 최적화)
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialHistoryRepository materialHistoryRepository;

    /**
     * 자재 등록 (초기 데이터용)
     */
    @Transactional // 쓰기 작업이므로 readOnly = false
    public Material createMaterial(String itemCode, String itemName, String category, int safetyStock, double unitPrice) {
        // 이미 존재하는 코드인지 확인
        if (materialRepository.findByItemCode(itemCode).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 품목 코드입니다: " + itemCode);
        }

        Material material = new Material();
        material.setItemCode(itemCode);
        material.setItemName(itemName);
        material.setCategory(category);
        material.setSafetyStock(safetyStock);
        material.setUnitPrice(unitPrice);
        material.setCurrentStock(0); // 초기 재고는 0

        return materialRepository.save(material);
    }

    /**
     * ⭐ 핵심: 자재 입출고 처리 (트랜잭션)
     */
    @Transactional
    public void processTransaction(String itemCode, int quantity, TransactionType type, String worker, String remarks) {
        // 1. 자재 조회 (없으면 에러)
        Material material = materialRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new IllegalArgumentException("자재를 찾을 수 없습니다. 코드: " + itemCode));

        // 2. 재고 계산
        int currentStock = material.getCurrentStock();
        int newStock = currentStock;

        if (type == TransactionType.INCOMING || type == TransactionType.RETURN) {
            // 입고 또는 반품이면 재고 증가
            newStock += quantity;
        } else if (type == TransactionType.OUTGOING) {
            // 출고면 재고 감소 (유효성 검사 필수)
            if (currentStock < quantity) {
                throw new IllegalStateException("재고가 부족합니다. 현재: " + currentStock + ", 요청: " + quantity);
            }
            newStock -= quantity;
        } else if (type == TransactionType.ADJUSTMENT) {
            // 재고 조정 (실사 후 강제 맞춤) -> quantity를 최종 재고로 설정한다고 가정하거나,
            // 여기서는 단순 증감 로직만 구현합니다. 필요시 로직 수정 가능.
            newStock = quantity;
        }

        // 3. 자재 정보 업데이트 (JPA Dirty Checking으로 자동 저장됨)
        material.setCurrentStock(newStock);

        // 4. 히스토리 기록 생성
        MaterialHistory history = new MaterialHistory();
        history.setMaterial(material);
        history.setType(type);
        history.setQuantity(quantity);
        history.setStockAfterTransaction(newStock); // ⭐ 스냅샷 저장
        history.setWorker(worker);
        history.setRemarks(remarks);

        // 5. 히스토리 저장
        materialHistoryRepository.save(history);

        log.info("자재 트랜잭션 완료: {} [{}] 수량: {}, 잔고: {}", itemCode, type, quantity, newStock);
    }

    /**
     * 전체 자재 목록 조회
     */
    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    /**
     * 특정 자재의 이력 조회
     */
    public List<MaterialHistory> getMaterialHistory(String itemCode) {
        Material material = materialRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new IllegalArgumentException("자재 없음"));
        return materialHistoryRepository.findByMaterialIdOrderByTransactionDateDesc(material.getId());
    }
}