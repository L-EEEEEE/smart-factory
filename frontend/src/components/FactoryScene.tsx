import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Machine } from '../types';
import MachineUnit from './MachineUnit'; // 👈 분리한 컴포넌트 import

interface FactorySceneProps {
    machines: Machine[];
}

const FactoryScene: React.FC<FactorySceneProps> = ({ machines }) => {
    // 기계 배치 간격 설정
    const GAP = 3;
    const COLS = 4; // 한 줄에 몇 개씩 놓을지

    return (
        <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
            {/* 💡 조명 설정 */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 20, 10]} intensity={1.5} />
            <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />

            {/* 🎮 카메라 컨트롤 */}
            <OrbitControls maxPolarAngle={Math.PI / 2 - 0.1} />

            {/* 🌐 바닥 그리드 */}
            <gridHelper args={[40, 40, 0x444444, 0x222222]} />
            <axesHelper args={[2]} />

            {/* 🏭 기계 유닛 배치 Loop */}
            {machines.map((machine, index) => {
                // 인덱스 기반 위치 자동 계산 (바둑판 배열)
                const x = (index % COLS) * GAP - (GAP * COLS) / 2 + GAP / 2;
                const z = Math.floor(index / COLS) * GAP - GAP;

                return (
                    <MachineUnit
                        key={machine.id}
                        data={machine}
                        position={[x, 0, z]}
                    />
                );
            })}
        </Canvas>
    );
};

export default FactoryScene;