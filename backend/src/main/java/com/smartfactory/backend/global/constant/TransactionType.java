package com.smartfactory.backend.global.constant;

public enum TransactionType {
    INCOMING("입고"),   // 자재가 들어옴 (+)
    OUTGOING("출고"),   // 자재를 사용함 (-)
    RETURN("반품"),     // 불량으로 돌려보냄 (-)
    ADJUSTMENT("조정"); // 재고 실사 후 강제 맞춤 (±)

    private final String description;

    TransactionType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}