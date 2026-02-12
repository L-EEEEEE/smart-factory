import React from 'react';
import type {Machine} from '../types'; // types.ts에서 타입 가져오기
import '../App.css'; // 스타일

interface DashboardUIProps {
    machines: Machine[];
    onControl: (id: string, command: string) => void;
    onSelectMachine: (machine: { id: string, name: string }) => void;
}

const DashboardUI: React.FC<DashboardUIProps> = ({ machines, onControl, onSelectMachine }) => {
    return (
        <div className="ui-layer">
            {/* 2. 기계 카드 리스트 (화면 하단이나 측면에 배치됨) */}
            <div className="grid-layout">
                {machines.map((machine) => (
                    <div
                        key={machine.id}
                        onClick={() => onSelectMachine({ id: machine.id, name: machine.name })}
                        style={{ cursor: 'pointer' }}
                    >
                        <MachineCard machine={machine} onControl={onControl} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// 내부에서 쓰는 카드 컴포넌트
const MachineCard = ({ machine, onControl }: { machine: Machine, onControl: any }) => {
    const statusClass = machine.status ? machine.status.toLowerCase() : 'stopped';

    // 버튼 클릭 시 모달 열림 방지
    const handleBtnClick = (e: React.MouseEvent, cmd: string) => {
        e.stopPropagation();
        onControl(machine.id, cmd);
    };

    return (
        <div className={`card ${statusClass}`}>
            <div className="card-header">
                <h3>{machine.name}</h3>
                <span className={`badge ${statusClass}`}>{machine.status}</span>
            </div>

            <div className="card-body">
                <div className="metric"><span>Temp</span><strong>{machine.temperature}°C</strong></div>
                <div className="metric"><span>RPM</span><strong>{machine.rpm}</strong></div>
                <div className="metric"><span>Vib</span><strong>{machine.vibration} Hz</strong></div>
                <div className="metric"><span>Prod</span><strong>{machine.productionCount}</strong></div>
            </div>

            <div className="card-actions">
                <button onClick={(e) => handleBtnClick(e, 'START')} disabled={machine.status === 'RUNNING'}>START</button>
                <button onClick={(e) => handleBtnClick(e, 'STOP')} disabled={machine.status === 'STOPPED'}>STOP</button>
                <button onClick={(e) => handleBtnClick(e, 'RESET')} className="reset-btn">RESET</button>
            </div>
        </div>
    );
};

export default DashboardUI;