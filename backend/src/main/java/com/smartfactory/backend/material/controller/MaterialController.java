package com.smartfactory.backend.material.controller;

import com.smartfactory.backend.global.dto.ApiResponse;
import com.smartfactory.backend.material.domain.Material;
import com.smartfactory.backend.material.domain.MaterialHistory;
import com.smartfactory.backend.material.service.MaterialService;
import com.smartfactory.backend.material.dto.MaterialCreateRequestDto;
import com.smartfactory.backend.material.dto.MaterialHistoryResponseDto;
import com.smartfactory.backend.material.dto.MaterialResponseDto;
import com.smartfactory.backend.material.dto.TransactionRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
@Slf4j
public class MaterialController {

    private final MaterialService materialService;

    /**
     * 자재 목록 전체 조회
     * GET /api/materials
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaterialResponseDto>>> getAllMaterials() {
        List<Material> materials = materialService.getAllMaterials();

        // Entity List -> DTO List 변환
        List<MaterialResponseDto> response = materials.stream()
                .map(MaterialResponseDto::new) // 생성자 참조 사용
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 신규 자재 등록 (ADMIN 전용)
     * POST /api/materials
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MaterialResponseDto>> createMaterial(@Valid @RequestBody MaterialCreateRequestDto request) {
        Material material = materialService.createMaterial(
                request.getItemCode(),
                request.getItemName(),
                request.getCategory(),
                request.getSafetyStock(),
                request.getUnitPrice(),
                request.getUnit(),
                request.getSupplier()
        );
        return ResponseEntity.ok(ApiResponse.success(new MaterialResponseDto(material)));
    }

    /**
     * 자재 입출고 트랜잭션 (핵심 기능)
     * POST /api/materials/transaction
     */
    @PostMapping("/transaction")
    public ResponseEntity<ApiResponse<String>> processTransaction(
            @Valid @RequestBody TransactionRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails // 현재 로그인한 사용자 정보
    ) {
        // 토큰에서 사용자 ID(username) 추출
        String worker = (userDetails != null) ? userDetails.getUsername() : "UNKNOWN";

        materialService.processTransaction(
                request.getItemCode(),
                request.getQuantity(),
                request.getType(),
                worker,
                request.getRemarks()
        );

        return ResponseEntity.ok(ApiResponse.success("트랜잭션이 성공적으로 처리되었습니다."));
    }

    /**
     * 특정 자재의 이력 조회
     * GET /api/materials/{itemCode}/history
     */
    @GetMapping("/{itemCode}/history")
    public ResponseEntity<ApiResponse<List<MaterialHistoryResponseDto>>> getMaterialHistory(@PathVariable String itemCode) {
        List<MaterialHistory> historyList = materialService.getMaterialHistory(itemCode);

        // Entity List -> DTO List 변환
        List<MaterialHistoryResponseDto> response = historyList.stream()
                .map(MaterialHistoryResponseDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}