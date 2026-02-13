import React, { useState } from 'react';
import FactoryScene from './FactoryScene';
import DashboardUI from './DashboardUI';
import { MachineHistoryModal } from './MachineHistoryModal';
import { sendMachineCommand } from '../api/machineApi.ts';
import type { Machine } from "../types";
import './Dashboard.css';

interface DashboardProps {
    machines: Machine[];
}

const Dashboard: React.FC<DashboardProps> = ({ machines }) => {
    const [selectedMachine, setSelectedMachine] = useState<{ id: string, name: string } | null>(null);

    const handleControl = async (id: string, command: string) => {
        try {
            await sendMachineCommand(id, command);
            alert(`[${id}] 명령 전송 성공`);
        } catch (error) {
            console.error(error);
            alert('명령 전송 실패');
        }
    };

    return (
        <div className="dashboard-container">
            {/* 1. 상단: 3D 관제 화면 (높이 50% ~ 60%) */}
            <div className="top-section">
                <FactoryScene machines={machines} />
            </div>

            {/* 2. 하단: 제어 패널 및 카드 리스트 (나머지 영역) */}
            <div className="bottom-section">
                <div className="section-title">
                    <h3>📊 실시간 기계 상태</h3>
                </div>
                <DashboardUI
                    machines={machines}
                    onControl={handleControl}
                    onSelectMachine={setSelectedMachine}
                />
            </div>

            {/* 3. 모달 (화면 최상단) */}
            {selectedMachine && (
                <div className="modal-overlay">
                    <MachineHistoryModal
                        machineId={selectedMachine.id}
                        machineName={selectedMachine.name}
                        onClose={() => setSelectedMachine(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;