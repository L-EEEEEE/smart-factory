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
        this.updatedAt = material.getUpdatedAt();
    }
}