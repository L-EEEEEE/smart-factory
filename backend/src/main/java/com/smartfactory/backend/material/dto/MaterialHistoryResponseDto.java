package com.smartfactory.backend.material.dto;

import com.smartfactory.backend.material.domain.MaterialHistory;
import com.smartfactory.backend.global.constant.TransactionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class MaterialHistoryResponseDto {

    private Long id;
    private TransactionType type;        // 입고/출고
    private int quantity;                // 수량
    private int stockAfterTransaction;   // 작업 후 잔고
    private String worker;               // 작업자
    private String remarks;              // 비고
    private LocalDateTime transactionDate; // 일시

    // Entity -> DTO 변환
    public MaterialHistoryResponseDto(MaterialHistory history) {
        this.id = history.getId();
        this.type = history.getType();
        this.quantity = history.getQuantity();
        this.stockAfterTransaction = history.getStockAfterTransaction();
        this.worker = history.getWorker();
        this.remarks = history.getRemarks();
        this.transactionDate = history.getTransactionDate();
    }
}
