import React, { useState } from 'react';
import { useFactorySocket } from '../hooks/useFactorySocket';
import FactoryScene from './FactoryScene';
import DashboardUI from './DashboardUI';
import { MachineHistoryModal } from './MachineHistoryModal';
import Sidebar from './Sidebar'; // 👈 사이드바 컴포넌트 임포트
import './Sidebar.css';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {

    // 사이드바 열림/닫힘 상태 관리 (기본값: true/열림)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 1. 데이터 통신
    const { machines, isConnected } = useFactorySocket();
    // 2. 상태 관리
    const [selectedMachine, setSelectedMachine] = useState<{ id: string, name: string } | null>(null);

    // 3. 제어 로직
    const handleControl = async (id: string, command: string) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:8080/api/machines/${id}/control`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ command }),
            });
            console.log(`Sent command ${command} to ${id}`);
        } catch (error) {
            console.error('Failed to control machine:', error);
        }
    };

    return (
        <div className="dashboard-layout">
            {/* ⬅️ 좌측: 사이드바 영역 */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* ➡️ 우측: 메인 컨텐츠 영역 */}
            <main className="main-content">

                {/* 1. 상단 헤더 (메인 컨텐츠 내부에 위치) */}
                <header className="header">
                    <h1>🏭 Smart Factory Monitor</h1>
                    <div className="header-right">
                        <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}>
                            {isConnected ? 'LIVE' : 'OFFLINE'}
                        </div>

                        {/* 로그아웃 버튼 */}
                        <button onClick={onLogout} className="logout-btn">
                            LOGOUT
                        </button>
                    </div>
                </header>

                {/* 2. 실제 작업 영역 (3D 씬 + UI) */}
                <div className="content-area">
                    {/* 🟦 레이어 1: 3D 배경 */}
                    <div className="scene-layer">
                        <FactoryScene machines={machines} />
                    </div>

                    {/* 🟧 레이어 2: 2D UI (카드 리스트) */}
                    <DashboardUI
                        machines={machines}
                        onControl={handleControl}
                        onSelectMachine={setSelectedMachine}
                    />

                    {/* 🟪 레이어 3: 모달 (최상단) */}
                    {selectedMachine && (
                        <div style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, width: '100%', height: '100%' }}>
                            <MachineHistoryModal
                                machineId={selectedMachine.id}
                                machineName={selectedMachine.name}
                                onClose={() => setSelectedMachine(null)}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;