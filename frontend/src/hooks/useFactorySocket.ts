import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getToken } from '../api/authApi.ts';
import { fetchMachines } from '../api/machineApi.ts';
import type {Machine} from "../types";

export const useFactorySocket = (enabled:boolean) => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const token = getToken();

        if (!enabled || !token) {
            console.warn("🔒 로그인이 필요합니다. (토큰 없음)");
            return; // 토큰이 없으면 연결 시도하지 않음
        }

        if (clientRef.current?.connected) {
            return;
        }

        // 1. [초기 데이터] REST API 요청 시 토큰 실어 보내기
        const fetchInitialData = async () => {
            try {
                const data = await fetchMachines();
                setMachines(data);
                console.log("초기 데이터 로드 완료");
            } catch (error) {
                console.error("초기 데이터 로드 실패:", error);
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

            debug: (_str) => {  // 생성은 해두지만 일단 사용안해서 언더바_변수명
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

        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [enabled]); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

    return { machines, isConnected };
};