package com.smartfactory.backend.material.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialCreateRequestDto {

    @NotBlank(message = "품목 코드는 필수입니다.")
    private String itemCode;

    @NotBlank(message = "자재명은 필수입니다.")
    private String itemName;

    @NotBlank(message = "분류는 필수입니다.")
    private String category; // 원자재, 부품, 완제품 등

    @Min(value = 0, message = "안전 재고는 0 이상이어야 합니다.")
    private int safetyStock;

    @Min(value = 0, message = "단가는 0 이상이어야 합니다.")
    private double unitPrice;

    // 👇 [추가] DB에 Not Null로 잡혀있으므로 필수 입력 받아야 함
    @NotBlank(message = "단위는 필수입니다. (예: EA, Sheet, Liter)")
    private String unit;

    @NotBlank(message = "공급처는 필수입니다. (예: Samsung, Internal)")
    private String supplier;
}