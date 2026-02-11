// src/components/FactoryScene.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { Machine } from '../hooks/useFactorySocket';

// 1. 개별 기계 3D 모델 (박스 + 회전하는 원통)
const MachineUnit = ({ data, position }: { data: Machine; position: [number, number, number] }) => {
    // 3D 객체에 직접 접근하기 위한 Hook
    const rotorRef = useRef<THREE.Mesh>(null);

    // 상태에 따른 색상 매핑
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RUNNING': return '#00b894'; // 녹색
            case 'WARNING': return '#fdcb6e'; // 노란색
            case 'ERROR': return '#d63031';   // 빨간색
            default: return '#636e72';        // 회색 (STOPPED)
        }
    };

    // 애니메이션 루프 (매 프레임마다 실행됨)
    useFrame((state, delta) => {
        if (rotorRef.current && data.status === 'RUNNING') {
            // RPM에 비례하여 회전 속도 조절 (RPM 1000 = 초당 1000/60 회전)
            // delta는 프레임 사이의 시간(초)
            const rotationSpeed = (data.rpm / 60) * 2 * Math.PI * delta * 0.1;
            rotorRef.current.rotation.y += rotationSpeed;
        }
    });

    return (
        <group position={position}>
            {/* 기계 이름표 (공중에 띄움) */}
            <Text position={[0, 2.5, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
                {data.name}
                <meshBasicMaterial attach="material" color="white" />
            </Text>

            {/* 1. 기계 몸체 (아래쪽 고정된 박스) */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.2, 1, 1.2]} />
                <meshStandardMaterial color="#2d3436" />
            </mesh>

            {/* 2. 상태 표시등 (몸체 위의 띠) */}
            <mesh position={[0, 1.05, 0]}>
                <boxGeometry args={[1.3, 0.1, 1.3]} />
                <meshStandardMaterial color={getStatusColor(data.status)} emissive={getStatusColor(data.status)} emissiveIntensity={0.5} />
            </mesh>

            {/* 3. 회전하는 부품 (로터) - RPM에 따라 돔 */}
            <mesh ref={rotorRef} position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.8, 16]} />
                <meshStandardMaterial color="#b2bec3" metalness={0.8} roughness={0.2} />
                {/* 회전 확인용 날개 */}
                <mesh position={[0.3, 0, 0]}>
                    <boxGeometry args={[0.3, 0.6, 0.1]} />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </mesh>
        </group>
    );
};

// 2. 전체 공장 씬 (Scene)
export const FactoryScene = ({ machines }: { machines: Machine[] }) => {
    return (
        <div style={{ height: '400px', width: '100%', background: '#111', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
            <Canvas camera={{ position: [5, 5, 8], fov: 50 }}>
                {/* 조명 설정 */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* 마우스 컨트롤 (줌/회전) */}
                <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />

                {/* 바닥 그리드 */}
                <Grid position={[0, 0, 0]} args={[20, 20]} cellSize={1} cellThickness={1} cellColor="#636e72" sectionSize={5} sectionThickness={1.5} sectionColor="#b2bec3" fadeDistance={20} />

                {/* 기계 배치 */}
                {machines.map((machine, index) => {
                    // 기계들을 한 줄로 배치 (x축 간격 2.5)
                    const xPos = (index - (machines.length - 1) / 2) * 2.5;
                    return <MachineUnit key={machine.id} data={machine} position={[xPos, 0, 0]} />;
                })}
            </Canvas>
        </div>
    );
};