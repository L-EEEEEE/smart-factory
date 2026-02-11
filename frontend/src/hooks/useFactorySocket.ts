import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// 타입 정의 (Backend의 Machine.java와 일치해야 함)
export interface Machine {
    id: string;
    name: string;
    type: string;
    status: string;
    temperature: number;
    vibration: number;
    rpm: number;
    powerUsage: number;
    productionCount: number;
    lastMaintenance: string;
}

export const useFactorySocket = () => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // 1. [핵심] 접속하자마자 REST API로 현재 상태 가져오기 (이게 없어서 빈 화면이었음!)
        const fetchInitialData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/machines');
                const data = await response.json();
                console.log("📢 초기 데이터 로드 완료:", data); // F12 콘솔에서 확인해보세요
                setMachines(data);
            } catch (error) {
                console.error("❌ 초기 데이터 로드 실패:", error);
            }
        };

        fetchInitialData(); // 함수 실행

        // 2. WebSocket 연결 설정 (실시간 업데이트용)
        const socket = new SockJS('http://localhost:8080/ws-factory');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                // console.log(str); // 디버깅 로그가 너무 많으면 주석 처리
            },
            onConnect: () => {
                console.log('✅ WebSocket Connected!');
                setIsConnected(true);

                // 실시간 데이터 구독
                stompClient.subscribe('/topic/factory', (message) => {
                    if (message.body) {
                        const updatedMachines: Machine[] = JSON.parse(message.body);
                        // console.log("⚡ 실시간 데이터 수신:", updatedMachines);
                        setMachines(updatedMachines);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                console.log('❌ WebSocket Disconnected');
                setIsConnected(false);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    return { machines, isConnected };
};