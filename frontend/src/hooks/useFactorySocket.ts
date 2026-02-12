import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// 타입 정의
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
        // 0. [로그인 체크] 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("🔒 로그인이 필요합니다. (토큰 없음)");
            return; // 토큰이 없으면 연결 시도하지 않음
        }

        // 1. [초기 데이터] REST API 요청 시 토큰 실어 보내기
        const fetchInitialData = async () => {
            try {
                const response = await fetch('/api/machines', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // 👈 핵심: 토큰 추가
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("초기 데이터 로드 완료:", data);
                    setMachines(data);
                } else {
                    console.error("초기 데이터 로드 실패 (권한 없음 또는 에러)");
                }
            } catch (error) {
                console.error("초기 데이터 로드 중 네트워크 오류:", error);
            }
        };

        fetchInitialData();

        // 2. [WebSocket 연결] 연결 시 헤더에 토큰 추가
        const socket = new SockJS('/ws-factory');
        const stompClient = new Client({
            webSocketFactory: () => socket,

            // 👇 핵심: 소켓 연결 시 토큰 인증 정보 보내기
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            debug: (str) => {
                // console.log(str);
            },
            onConnect: () => {
                console.log('WebSocket Connected!');
                setIsConnected(true);

                stompClient.subscribe('/topic/factory', (message) => {
                    if (message.body) {
                        try {
                            const updatedMachines: Machine[] = JSON.parse(message.body);
                            setMachines(updatedMachines);
                        } catch (e) {
                            console.error("JSON 파싱 에러:", e);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                console.log('WebSocket Disconnected');
                setIsConnected(false);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

    return { machines, isConnected };
};