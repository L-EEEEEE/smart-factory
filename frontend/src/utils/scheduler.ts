export interface Order {
    id: string;
    client: string;        // 거래처 (예: 삼성전자, LG)
    productName: string;   // 주문 제품
    quantity: number;      // 주문 수량
    dueDate: string;       // 납기일 (YYYY-MM-DD)
    status?: 'READY' | 'SHORTAGE' | 'URGENT' | 'IN_PROGRESS'; // 분석 결과 상태
    score?: number;        // 우선순위 점수
    missingMaterial?: string; // 부족한 자재명
}

// 2. 가짜 발주 데이터 (Mock Data)
export const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', client: '삼성전자', productName: '고성능 PCB 보드', quantity: 500, dueDate: '2024-10-25' }, // 급함
    { id: 'ORD-002', client: 'LG디스플레이', productName: 'LED 모듈', quantity: 1000, dueDate: '2024-11-01' }, // 여유
    { id: 'ORD-003', client: 'SK하이닉스', productName: '메모리 칩셋', quantity: 2000, dueDate: '2024-10-26' }, // 수량 많음
    { id: 'ORD-004', client: '현대자동차', productName: '전장 제어기', quantity: 100, dueDate: '2024-10-24' },  // 매우 급함
    { id: 'ORD-005', client: '로컬 PC방', productName: '보급형 메인보드', quantity: 50, dueDate: '2024-12-01' }, // 매우 여유
];

// 3. 제품 레시피 (BOM: Bill of Materials) - 제품 1개당 필요한 자재
// 실제로는 DB에서 가져와야 하지만, 지금은 하드코딩으로 시뮬레이션
export const BOM: Record<string, { materialName: string, requiredPerUnit: number }> = {
    '고성능 PCB 보드': { materialName: 'FR-4 1.6T Copper Board', requiredPerUnit: 1 },
    'LED 모듈': { materialName: 'LED Diodes', requiredPerUnit: 10 },
    '메모리 칩셋': { materialName: 'Silicon Wafer', requiredPerUnit: 0.5 },
    '전장 제어기': { materialName: 'MCU Unit', requiredPerUnit: 2 },
    '보급형 메인보드': { materialName: 'FR-4 1.6T Copper Board', requiredPerUnit: 1 },
};

// 4. 스케줄링 알고리즘 (핵심 로직!)
export const analyzeSchedule = (orders: Order[], inventoryMap: Record<string, number>) => {
    const today = new Date(); // (날짜 로직은 유지)

    return orders.map(order => {
        // ✨ [핵심 수정] 이미 생산 중(IN_PROGRESS)인 주문은 분석하지 않고 그대로 반환!
        if (order.status === 'IN_PROGRESS') {
            return order;
        }

        // --- 아래는 기존 로직 그대로 ---
        let score = 0;
        let status: Order['status'] = 'READY';
        let missingMaterial = '';

        // (1) 납기일 점수 계산
        const due = new Date(order.dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) score += 100;
        else if (diffDays <= 3) score += 50;
        else score += (20 - diffDays);

        // (2) 자재 가용성 체크
        const recipe = BOM[order.productName]; // BOM 데이터 확인 필요
        if (recipe) {
            const totalNeeded = recipe.requiredPerUnit * order.quantity;
            const currentStock = inventoryMap[recipe.materialName] || 0;

            if (currentStock < totalNeeded) {
                score = -100;
                status = 'SHORTAGE';
                missingMaterial = `${recipe.materialName} (부족: ${totalNeeded - currentStock})`;
            }
        }

        // 긴급 태그
        if (status !== 'SHORTAGE' && score >= 50) {
            status = 'URGENT';
        }

        return { ...order, score, status, missingMaterial };
    }).sort((a, b) => {
        // [추가 팁] 생산 중인 것은 맨 위로 올리기 (선택 사항)
        if (a.status === 'IN_PROGRESS') return -1;
        if (b.status === 'IN_PROGRESS') return 1;

        return (b.score || 0) - (a.score || 0);
    });
};