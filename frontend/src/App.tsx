import React, {useState} from 'react';
import { useFactorySocket, Machine } from './hooks/useFactorySocket';
import { FactoryScene } from './components/FactoryScene';
import { MachineHistoryModal } from './components/MachineHistoryModal';
import './App.css';

function App() {
    const { machines, isConnected } = useFactorySocket();
    // 모달 상태 관리
    const [selectedMachine, setSelectedMachine] = useState<{id: string, name: string} | null>(null);
    // 제어 명령 전송 (REST API)
    const handleControl = async (id: string, command: string) => {
        try {
            await fetch(`http://localhost:8080/api/machines/${id}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command }),
            });
            console.log(`Sent command ${command} to ${id}`);
        } catch (error) {
            console.error('Failed to control machine:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>🏭 Smart Factory Monitor</h1>
                <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'LIVE CONNECTED' : 'DISCONNECTED'}
                </div>
            </header>

            {/* 👇 3D 공장 화면 배치 */}
            <section className="digital-twin-section">
                <FactoryScene machines={machines} />
            </section>

            {/* 2D 카드 리스트 */}
            <div className="grid-layout">
                {machines.map((machine) => (
                    <div key={machine.id} onClick={() => setSelectedMachine({ id: machine.id, name: machine.name })} style={{ cursor: 'pointer' }}>
                        {/* 기존 MachineCard 컴포넌트를 div로 감싸서 클릭 이벤트를 걸었습니다.
                             MachineCard 내부의 버튼(Control) 클릭 시에는 e.stopPropagation()이 필요할 수 있습니다.
                         */}
                        <MachineCard
                            machine={machine}
                            onControl={handleControl}
                        />
                    </div>
                ))}
            </div>
            {/* 👇 모달 컴포넌트 (선택된 기계가 있을 때만 렌더링) */}
            {selectedMachine && (
                <MachineHistoryModal
                    machineId={selectedMachine.id}
                    machineName={selectedMachine.name}
                    onClose={() => setSelectedMachine(null)}
                />
            )}
        </div>
    );
}

// 개별 기계 카드 컴포넌트
const MachineCard = ({ machine, onControl }: { machine: Machine, onControl: any }) => {
    // 상태에 따른 색상 클래스 결정
    const statusClass = machine.status.toLowerCase();

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
                <button onClick={() => onControl(machine.id, 'START')} disabled={machine.status === 'RUNNING'}>START</button>
                <button onClick={() => onControl(machine.id, 'STOP')} disabled={machine.status === 'STOPPED'}>STOP</button>
                <button onClick={() => onControl(machine.id, 'RESET')} className="reset-btn">RESET</button>
            </div>
        </div>
    );
};

export default App;