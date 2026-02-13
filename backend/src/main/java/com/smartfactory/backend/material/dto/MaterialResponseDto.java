package com.smartfactory.backend.material.dto;

import com.smartfactory.backend.material.domain.Material;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MaterialResponseDto {

    private Long id;
    private String itemCode;
    private String itemName;
    private String category;
    private int currentStock;
    private int safetyStock;
    private double unitPrice;

    // 🏭 [추가] 이 두 필드가 있어야 프론트엔드에 표시됩니다!
    private String unit;
    private String supplier;

    private LocalDateTime updatedAt;

    // Entity -> DTO 변환 생성자
    public MaterialResponseDto(Material material) {
        this.id = material.getId();
        this.itemCode = material.getItemCode();
        this.itemName = material.getItemName();
        this.category = material.getCategory();
        this.currentStock = material.getCurrentStock();
        this.safetyStock = material.getSafetyStock();
        this.unitPrice = material.getUnitPrice();

        // 👇 DB에 있는 값을 DTO에 담아주는 핵심 코드
        this.unit = material.getUnit();
        this.supplier = material.getSupplier();

        this.updatedAt = material.getUpdatedAt();
    }
}