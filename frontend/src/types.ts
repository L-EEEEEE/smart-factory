// 기계 상태 타입 (자동완성을 위해 문자열 리터럴로 정의하면 좋음)
export type MachineStatus = 'RUNNING' | 'IDLE' | 'STOPPED' | 'WARNING' | 'ERROR';

// 기계 데이터 인터페이스
export interface Machine {
    id: string;
    name: string;
    type: string;
    status: MachineStatus;
    temperature: number;
    vibration: number;
    rpm: number;
    powerUsage: number;
    productionCount: number;
    lastMaintenance: string;
    // 3D 좌표가 필요하다면 추가 (선택적)
    position?: [number, number, number];
}

// (필요하다면) 제어 명령 타입
export interface ControlCommand {
    machineId: string;
    command: 'START' | 'STOP' | 'RESET';
}