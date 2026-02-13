import React, { useEffect, useState } from 'react';
// 1. recordTransaction 추가 Import 확인하세요!
import { fetchMaterials, recordTransaction, type Material } from '../api/materialApi';
import TransactionModal from './TransactionModal';
import '../App.css';

const MaterialList: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [modalType, setModalType] = useState<'INCOMING' | 'OUTGOING'>('INCOMING');

    // 2. 데이터 불러오기 함수 (useEffect보다 위에 선언하거나 useEffect 안으로 이동 권장)
    const loadData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchMaterials();
            setMaterials(data);
            setError(null);
        } catch (err) {
            setError('데이터를 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. 초기 실행 (loadData 선언 후 호출)
    useEffect(() => {
        loadData();
    }, []);

    // 모달 열기 함수
    const handleOpenModal = (material: Material, type: 'INCOMING' | 'OUTGOING') => {
        setSelectedMaterial(material);
        setModalType(type);
        setIsModalOpen(true);
    };

    // 트랜잭션 처리 (모달에서 호출됨)
    const handleTransaction = async (quantity: number, remarks: string) => {
        if (!selectedMaterial) return;

        try {
            // API 호출 (import 확인 필요)
            await recordTransaction({
                itemCode: selectedMaterial.itemCode,
                type: modalType,
                quantity: quantity,
                remarks: remarks
            });

            alert(`${modalType === 'INCOMING' ? '입고' : '출고'} 처리가 완료되었습니다.`);

            // 모달 닫기 (중요: 성공 시 모달 닫아주기)
            setIsModalOpen(false);

            // 데이터 새로고침 (재고 변화 반영)
            await loadData();

        } catch (err: any) {
            console.error(err);
            alert('오류 발생: ' + (err.response?.data?.message || err.message));
        }
    };

    if (isLoading) return <div className="loading-text">데이터 로딩 중...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="material-list-container">
            <div className="list-header">
                <h2>📦 자재 재고 현황</h2>
                <button className="primary-btn" onClick={loadData}>↻ 새로고침</button>
            </div>

            <div className="table-wrapper">
                <table className="dark-table">
                    <thead>
                    <tr>
                        <th>코드</th>
                        <th>품명</th>
                        <th>공급처</th>
                        <th>현재고</th>
                        <th>안전재고</th>
                        <th>상태</th>
                        <th style={{ textAlign: 'center' }}>입출고 관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {materials.map((m) => {
                        const isLowStock = m.currentStock < m.safetyStock;
                        return (
                            <tr key={m.id || m.itemCode} className={isLowStock ? 'row-danger' : ''}>
                                <td>{m.itemCode}</td>
                                <td className="fw-bold">{m.itemName}</td>
                                <td>{m.supplier}</td>

                                {/* 수량 표시 */}
                                <td className={isLowStock ? 'text-danger' : 'text-success'}>
                                    {m.currentStock.toLocaleString()} <span style={{ fontSize: '0.8em', color: '#888' }}>{m.unit}</span>
                                </td>

                                <td>{m.safetyStock.toLocaleString()}</td>

                                {/* 상태 뱃지 */}
                                <td>
                                    {isLowStock ? (
                                        <span className="status-badge danger">부족</span>
                                    ) : (
                                        <span className="status-badge success">양호</span>
                                    )}
                                </td>

                                {/* 버튼 그룹 */}
                                <td style={{ textAlign: 'center' }}>
                                    <button
                                        className="sm-btn btn-green"
                                        onClick={() => handleOpenModal(m, 'INCOMING')}
                                    >
                                        + 입고
                                    </button>

                                    <button
                                        className="sm-btn btn-red"
                                        onClick={() => handleOpenModal(m, 'OUTGOING')}
                                    >
                                        - 출고
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 👇 트랜잭션 모달 연결 */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleTransaction}
                materialName={selectedMaterial?.itemName || ''}
                type={modalType}
            />
        </div>
    );
};

export default MaterialList;