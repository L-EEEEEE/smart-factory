package com.smartfactory.backend.material.dto;

import com.smartfactory.backend.global.constant.TransactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequestDto {

    @NotBlank(message = "품목 코드는 필수입니다.")
    private String itemCode;

    @NotNull(message = "거래 유형(입고/출고)은 필수입니다.")
    private TransactionType type; // INCOMING, OUTGOING ...

    @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
    private int quantity;

    private String remarks; // 비고 (선택 사항)
}