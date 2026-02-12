// src/components/MachineUnit.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Machine } from '../types'; // Dashboard에서 타입 가져오기 (또는 types.ts)

interface MachineUnitProps {
    data: Machine;
    position: [number, number, number];
}

const MachineUnit: React.FC<MachineUnitProps> = ({ data, position }) => {
    // 회전하는 부품(로터)을 참조하기 위한 Hook
    const rotorRef = useRef<THREE.Mesh>(null);

    // 상태에 따른 색상 매핑
    const getStatusColor = (status: string) => {
        const s = status ? status.toUpperCase() : 'STOPPED';
        switch (s) {
            case 'RUNNING': return '#00b894'; // 녹색 (가동)
            case 'WARNING': return '#fdcb6e'; // 노란색 (경고)
            case 'ERROR':   return '#d63031'; // 빨간색 (에러)
            case 'IDLE':    return '#0984e3'; // 파란색 (대기)
            default:        return '#636e72'; // 회색 (정지/기타)
        }
    };

    // 애니메이션 루프 (매 프레임마다 실행됨)
    useFrame((state, delta) => {
        // 기계가 RUNNING 상태일 때만 회전
        if (rotorRef.current && data.status === 'RUNNING') {
            // RPM에 비례하여 회전 속도 조절
            // (RPM 600 = 초당 10회전 -> 1회전은 2*PI 라디안 -> 초당 20*PI 라디안)
            // 너무 빠르면 어지러우니 * 0.1 등으로 시각적 속도 조절
            const rotationSpeed = (data.rpm / 60) * 2 * Math.PI * delta * 0.1;
            rotorRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <group position={position}>
            {/* 🏷️ 기계 이름표 (공중에 띄움) */}
            <Text
                position={[0, 2.5, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000000"
            >
                {data.name}
            </Text>

            {/* 1. 📦 기계 몸체 (아래쪽 고정된 박스) */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.2, 1, 1.2]} />
                <meshStandardMaterial color="#2d3436" roughnes={0.5} metalness={0.5} />
            </mesh>

            {/* 2. 🚦 상태 표시등 (몸체 위의 띠) */}
            <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.3, 0.1, 1.3]} />
                <meshStandardMaterial
                    color={getStatusColor(data.status)}
                    emissive={getStatusColor(data.status)}
                    emissiveIntensity={0.6} // 자체 발광 효과
                />
            </mesh>

            {/* 3. ⚙️ 회전하는 부품 (로터) - RPM에 따라 돔 */}
            <mesh ref={rotorRef} position={[0, 1.5, 0]}>
                {/* 실린더 형태 (위쪽 반지름, 아래쪽 반지름, 높이, 분할수) */}
                <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
                <meshStandardMaterial color="#b2bec3" metalness={0.8} roughness={0.2} />

                {/* 회전 확인용 날개 (오렌지색) */}
                <mesh position={[0.3, 0, 0]}>
                    <boxGeometry args={[0.3, 0.6, 0.1]} />
                    <meshStandardMaterial color="#e17055" />
                </mesh>
            </mesh>

            {/* (선택) 바닥 그림자 */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

export default MachineUnit;