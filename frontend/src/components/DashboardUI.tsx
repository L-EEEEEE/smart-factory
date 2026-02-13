import React from 'react';
import type { Machine } from '../types';
import './Dashboard.css';

interface DashboardUIProps {
    machines: Machine[];
    onControl: (id: string, command: string) => void;
    onSelectMachine: (machine: { id: string, name: string }) => void;
}

const DashboardUI: React.FC<DashboardUIProps> = ({ machines, onControl, onSelectMachine }) => {
    return (
        /* ui-layer 제거: bottom-section이 이미 자리를 잡고 있으므로 불필요 */
        <div className="grid-layout">
            {machines.map((machine) => (
                <MachineCard
                    key={machine.id}
                    machine={machine}
                    onControl={onControl}
                    // 👇 카드를 클릭했을 때 실행될 함수를 prop으로 전달
                    onClick={() => onSelectMachine({ id: machine.id, name: machine.name })}
                />
            ))}
        </div>
    );
};

// 내부 카드 컴포넌트 Props 수정
interface MachineCardProps {
    machine: Machine;
    onControl: (id: string, command: string) => void;
    onClick: () => void; // 👈 클릭 이벤트 추가
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onControl, onClick }) => {
    const statusClass = machine.status ? machine.status.toLowerCase() : 'stopped';

    // 버튼 클릭 핸들러 (카드 선택 이벤트가 발생하지 않도록 전파 중단)
    const handleBtnClick = (e: React.MouseEvent, cmd: string) => {
        e.stopPropagation(); // 부모의 onClick 실행 방지
        onControl(machine.id, cmd);
    };

    return (
        <div
            className={`card ${statusClass}`}
            onClick={onClick} /* 👈 여기에 클릭 이벤트 연결 */
            style={{ cursor: 'pointer' }}
        >
            {/* 1. 헤더 영역 */}
            <div className="card-header">
                <div className="header-top">
                    <h3>{machine.name}</h3>
                    <span className={`status-badge ${statusClass}`}>
                        {machine.status}
                    </span>
                </div>

                {machine.client && (
                    <div className="order-info">
                        <div className="info-row">
                            <span className="label">Client</span>
                            <span className="value">{machine.client}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Job</span>
                            <span className="value">{machine.orderName || '-'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. 데이터 바디 영역 */}
            <div className="card-body">
                <div className="metric">
                    <span>Temp</span>
                    <strong>{machine.temperature.toFixed(1)}°C</strong>
                </div>
                <div className="metric">
                    <span>RPM</span>
                    <strong>{machine.rpm}</strong>
                </div>
                <div className="metric">
                    <span>Vib</span>
                    <strong>{machine.vibration.toFixed(1)} Hz</strong>
                </div>
                <div className="metric">
                    <span>Prod</span>
                    <strong>{machine.productionCount.toLocaleString()}</strong>
                </div>
            </div>

            {/* 3. 제어 버튼 영역 */}
            <div className="card-actions">
                <button
                    onClick={(e) => handleBtnClick(e, 'START')}
                    disabled={machine.status === 'RUNNING'}
                >
                    START
                </button>
                <button
                    onClick={(e) => handleBtnClick(e, 'STOP')}
                    disabled={machine.status === 'STOPPED'}
                >
                    STOP
                </button>
                <button
                    onClick={(e) => handleBtnClick(e, 'RESET')}
                    className="reset-btn"
                >
                    RESET
                </button>
            </div>
        </div>
    );
};

export default DashboardUI;