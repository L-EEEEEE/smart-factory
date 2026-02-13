import type {Order, Material} from '../types';

export const analyzeProductionOrder = (orders: Order[], inventory: Material[]) => {
    const today = new Date();

    // 1. 주문 분석 및 점수 매기기
    const analyzedOrders = orders.map(order => {
        let score = 0;
        let status = 'READY'; // READY, DELAYED(자재부족), URGENT(납기임박)
        const reasons: string[] = [];

        // (1) 납기일 점수 (하루 남을 때마다 10점 추가, 지났으면 100점)
        const due = new Date(order.dueDate);
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) score += 100; // 이미 지남 (최우선)
        else if (diffDays <= 3) score += 50; // 3일 이내 (긴급)
        else score += (30 - diffDays); // 여유 있을수록 점수 낮음

        // (2) 거래처 중요도 가중치
        score *= order.priorityMultiplier;

        // (3) 자재 가용성 체크 (가장 중요!)
        const material = inventory.find(m => m.id === order.requiredMaterialId);
        if (!material || material.currentStock < order.quantity) {
            score = -9999; // 자재 없으면 맨 뒤로 보냄
            status = 'DELAYED';
            reasons.push(`자재 부족 (${material?.itemCode || '알수없음'})`);
        } else {
            reasons.push('생산 가능');
        }

        return { ...order, score, status, reasons, daysLeft: diffDays };
    });

    // 2. 점수 높은 순으로 정렬 (내림차순)
    return analyzedOrders.sort((a, b) => b.score - a.score);
};