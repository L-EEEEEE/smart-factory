import React, { useEffect, useState } from 'react';
import { fetchMaterials, type Material } from '../api/materialApi';
import { getUserRole } from '../api/auth';
import '../App.css';

const MaterialList: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 권한 확인 (관리자만 등록 버튼 보임)
    const isAdmin = getUserRole() === 'ROLE_ADMIN';

    // 1. 데이터 불러오기
    useEffect(() => {
        loadData();
    }, []);

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

    // 2. 금액 포맷팅 (₩1,000)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    if (isLoading) return <div className="loading-text">데이터 로딩 중...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="material-list-container">
            <div className="list-header">
                <h2>📦 자재 재고 현황</h2>
                {isAdmin && (
                    <button className="primary-btn" onClick={() => alert('자재 등록 모달 열기(구현 예정)')}>
                        + 신규 자재 등록
                    </button>
                )}
            </div>

            <div className="table-wrapper">
                <table className="dark-table">
                    <thead>
                    <tr>
                        <th>코드</th>
                        <th>품명</th>
                        <th>분류</th>
                        <th>현재고</th>
                        <th>안전재고</th>
                        <th>단가</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {materials.map((m) => {
                        // 🚨 재고 부족 경고 로직
                        const isLowStock = m.currentStock < m.safetyStock;

                        return (
                            <tr key={m.id} className={isLowStock ? 'row-danger' : ''}>
                                <td>{m.itemCode}</td>
                                <td className="fw-bold">{m.itemName}</td>
                                <td><span className="badge">{m.category}</span></td>

                                {/* 수량 표시 */}
                                <td className={isLowStock ? 'text-danger' : 'text-success'}>
                                    {m.currentStock.toLocaleString()} ea
                                </td>

                                <td>{m.safetyStock.toLocaleString()} ea</td>
                                <td>{formatCurrency(m.unitPrice)}</td>

                                {/* 상태 뱃지 */}
                                <td>
                                    {isLowStock ? (
                                        <span className="status-badge danger">부족</span>
                                    ) : (
                                        <span className="status-badge success">양호</span>
                                    )}
                                </td>

                                {/* 액션 버튼 */}
                                <td>
                                    <button className="sm-btn" onClick={() => alert(`${m.itemName} 이력 조회`)}>
                                        📜 이력
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaterialList;