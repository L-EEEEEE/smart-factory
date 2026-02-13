// 기계 상태 타입 (자동완성을 위해 문자열 리터럴로 정의하면 좋음)
export type MachineStatus = 'RUNNING' | 'STOPPED' | 'WARNING' | 'ERROR';

export interface Machine {
    id: string;
    name: string;
    type: string;
    status: MachineStatus;
    client?: string;       // 발주처 (예: Samsung, LG, StartUp Inc.)
    orderName?: string;    // 주문명 (예: Galaxy S24 Mainboard, Proto-Type A)
    progress?: number;     // 공정 진행률 (0~100%)

    temperature: number;
    rpm: number;
    vibration: number;
    productionCount: number;
    lastUpdated: string;
}

export interface Order {
    id: string;
    clientName: string;   // 거래처
    productName: string;  // 품명
    quantity: number;     // 주문 수량
    dueDate: string;      // 납기일 (YYYY-MM-DD)
    priorityMultiplier: number; // 거래처 중요도 (1: 보통, 1.5: 중요, 2: 긴급)
    requiredMaterialId: string; // 필요한 자재 ID (단순화)
}

export interface Material {
    id: string;
    itemCode: string;
    currentStock: number;
}