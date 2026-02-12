import React from "react";
import {type Machine} from "./Dashboard.tsx";

const MachineCard = ({ machine, onControl }: { machine: Machine, onControl: any }) => {
    const statusClass = machine.status ? machine.status.toLowerCase() : 'stopped';

    // 버튼 클릭 시 모달이 열리지 않도록 이벤트 전파 중단(stopPropagation) 적용
    const handleBtnClick = (e: React.MouseEvent, cmd: string) => {
        e.stopPropagation();
        onControl(machine.id, cmd);
    };

    return (
        <div className={`card ${statusClass}`}>
            <div className="card-header">
                <h3>{machine.name}</h3>
                <span className="badge">{machine.status}</span>
            </div>

            <div className="card-body">
                <div className="metric">
                    <span>Temp</span>
                    <strong>{machine.temperature}°C</strong>
                </div>
                <div className="metric">
                    <span>RPM</span>
                    <strong>{machine.rpm}</strong>
                </div>
                <div className="metric">
                    <span>Vibration</span>
                    <strong>{machine.vibration} Hz</strong>
                </div>
                <div className="metric">
                    <span>Production</span>
                    <strong>{machine.productionCount} ea</strong>
                </div>
            </div>

            <div className="card-actions">
                <button onClick={(e) => handleBtnClick(e, 'START')} disabled={machine.status === 'RUNNING'}>START</button>
                <button onClick={(e) => handleBtnClick(e, 'STOP')} disabled={machine.status === 'STOPPED'}>STOP</button>
                <button onClick={(e) => handleBtnClick(e, 'RESET')} className="reset-btn">RESET</button>
            </div>
        </div>
    );
};

export default MachineCard;