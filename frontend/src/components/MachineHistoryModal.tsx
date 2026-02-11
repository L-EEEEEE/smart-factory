import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LogData {
    logId: number;
    temperature: number;
    vibration: number;
    rpm: number;
    recordedAt: string;
}

interface Props {
    machineId: string | null;
    machineName: string;
    onClose: () => void;
}

export const MachineHistoryModal = ({ machineId, machineName, onClose }: Props) => {
    const [logs, setLogs] = useState<LogData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (machineId) {
            setLoading(true);
            fetch(`http://localhost:8080/api/machines/${machineId}/logs`)
                .then(res => res.json())
                .then(data => {
                    // 최신순(DESC)으로 오니까 차트 그릴 땐 시간순(ASC)으로 뒤집기
                    setLogs(data.reverse());
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [machineId]);

    if (!machineId) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>📊 {machineName} - History Analysis</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="chart-container">
                    {loading ? (
                        <p>Loading History...</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={logs}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis
                                    dataKey="recordedAt"
                                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                                    stroke="#a4b0be"
                                    fontSize={12}
                                />
                                {/* 왼쪽 축: 온도 */}
                                <YAxis yAxisId="left" stroke="#ff6b6b" domain={['auto', 'auto']} />
                                {/* 오른쪽 축: 진동 */}
                                <YAxis yAxisId="right" orientation="right" stroke="#54a0ff" />

                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e272e', border: 'none' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />

                                <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#ff6b6b" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="vibration" name="Vibration (Hz)" stroke="#54a0ff" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="modal-footer">
                    <p>※ Reflow Oven의 경우 230°C 이상 유지가 품질의 핵심입니다.</p>
                </div>
            </div>
        </div>
    );
};