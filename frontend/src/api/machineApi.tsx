import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 기계 제어 명령 전송 (START, STOP 등)
export const sendMachineCommand = async (machineId: string, command: string) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/api/machines/${machineId}/control`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ command }),
    });

    if (!response.ok) {
        throw new Error(`Failed to send command: ${response.statusText}`);
    }

    return await response.text(); // 성공 시 메시지 반환
};