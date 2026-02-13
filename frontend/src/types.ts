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