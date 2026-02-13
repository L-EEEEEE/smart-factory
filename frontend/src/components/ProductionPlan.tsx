import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS, analyzeSchedule, Order, BOM } from '../utils/scheduler';
import { fetchMaterials, recordTransaction, Material } from '../api/materialApi'; // API import 필수
import AddOrderModal from './AddOrderModal';
import '../App.css';

const ProductionPlan: React.FC = () => {
    // 발주 리스트 상태
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [plan, setPlan] = useState<Order[]>([]);
    const [isAnalyzed, setIsAnalyzed] = useState(false);

    // 실제 자재 데이터 상태
    const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
    // 중요: 자재 이름으로 ItemCode를 찾기 위한 맵
    const [itemCodeMap, setItemCodeMap] = useState<Record<string, string>>({});
    const [isLoadingInventory, setIsLoadingInventory] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. 초기 로딩: 실제 자재 데이터 가져오기
    useEffect(() => {
        loadRealInventory();
    }, []);

    // 2. 분석 실행 트리거 (데이터 변경 시)
    useEffect(() => {
        if (isAnalyzed) {
            runAnalysis();
        }
    }, [orders]); // inventoryMap은 제외 (무한루프 방지)

    const loadRealInventory = async () => {
        try {
            setIsLoadingInventory(true);
            const data = await fetchMaterials();

            const stockMap: Record<string, number> = {};
            const codeMap: Record<string, string> = {};

            data.forEach((m: Material) => {
                stockMap[m.itemName] = m.currentStock; // 이름 -> 재고량
                codeMap[m.itemName] = m.itemCode;      // 이름 -> 코드 (API 호출용)
            });

            setInventoryMap(stockMap);
            setItemCodeMap(codeMap);

            // 데이터 로드 후 바로 분석 한 번 실행 (선택)
            if (!isAnalyzed) runAnalysis(stockMap);

        } catch (err) {
            console.error("재고 로드 실패", err);
        } finally {
            setIsLoadingInventory(false);
        }
    };

    const runAnalysis = (currentInventory = inventoryMap) => {
        const result = analyzeSchedule(orders, currentInventory);
        setPlan(result);
        setIsAnalyzed(true);
    };

    // ✨ 핵심 기능: 생산 시작 및 자재 차감
    const handleStartProduction = async (order: Order) => {
        // 1. BOM 정보 확인
        const recipe = BOM[order.productName];
        if (!recipe) {
            alert("⚠️ 이 제품에 대한 BOM(자재 정보)이 정의되지 않았습니다.");
            return;
        }

        // 2. 자재 코드 찾기 (DB 매핑)
        const materialItemCode = itemCodeMap[recipe.materialName];
        if (!materialItemCode) {
            alert(`⚠️ 실제 재고 DB에서 자재 [${recipe.materialName}]를 찾을 수 없습니다.\n자재 이름을 정확히 일치시켜 주세요.`);
            return;
        }

        // 3. 소요량 계산
        const totalRequired = recipe.requiredPerUnit * order.quantity;

        // 4. 사용자 확인
        const confirmMsg = `🏭 [생산 지시]\n\n제품: ${order.productName}\n수량: ${order.quantity}개\n\n자재 [${recipe.materialName}]가 ${totalRequired}개 차감됩니다.\n진행하시겠습니까?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            // 5. API 호출 (자재 출고)
            await recordTransaction({
                itemCode: materialItemCode,
                type: 'OUTGOING',
                quantity: totalRequired,
                remarks: `생산 투입 (Order: ${order.id})`
            });

            alert(`✅ 생산 라인 가동 시작!\n자재가 정상적으로 불출되었습니다.`);

            // 6. UI 상태 업데이트 (생산 중으로 변경)
            const updatedOrders = orders.map(o =>
                o.id === order.id ? { ...o, status: 'IN_PROGRESS' as const } : o
            );
            setOrders(updatedOrders);

            // 7. 재고가 변했으므로 최신 데이터 다시 불러오기 (선택)
            loadRealInventory();

        } catch (err: any) {
            console.error(err);
            alert('오류 발생: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAddOrder = (newOrderData: any) => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            ...newOrderData
        };
        setOrders(prev => [...prev, newOrder]);
    };

    return (
        <div className="material-list-container">
            <div className="list-header">
                <h2>🏭 생산 실행 시스템 (MES)</h2>
                <div>
                    <button
                        className="sm-btn"
                        style={{ marginRight: '10px' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        + 신규 발주
                    </button>
                    <button
                        className="primary-btn"
                        onClick={() => runAnalysis()}
                        disabled={isLoadingInventory}
                    >
                        {isLoadingInventory ? '데이터 동기화 중...' : '↻ 스케줄 재분석'}
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                {!isAnalyzed ? (
                    <div className="loading-text">데이터 분석 중...</div>
                ) : (
                    <table className="dark-table">
                        <thead>
                        <tr>
                            <th>순위</th>
                            <th>상태</th>
                            <th>거래처</th>
                            <th>주문 제품</th>
                            <th>수량</th>
                            <th>필요 자재</th>
                            <th>작업 지시</th> {/* 버튼 컬럼 */}
                        </tr>
                        </thead>
                        <tbody>
                        {plan.map((order, index) => {
                            const recipe = BOM[order.productName];
                            const materialName = recipe ? recipe.materialName : '-';
                            const isShortage = order.status === 'SHORTAGE';
                            const isInProgress = order.status === 'IN_PROGRESS';

                            return (
                                <tr key={order.id} className={isShortage ? 'row-danger' : ''}>
                                    <td style={{ fontWeight: 'bold' }}>
                                        {index + 1}위
                                        {order.id.startsWith('ORD-1') && <span style={{fontSize:'0.7rem', color:'#f1c40f', marginLeft:'5px'}}>NEW</span>}
                                    </td>
                                    <td>
                                        {order.status === 'URGENT' && <span className="status-badge danger">🔥 긴급</span>}
                                        {order.status === 'READY' && <span className="status-badge success">생산대기</span>}
                                        {isShortage && <span className="status-badge" style={{background:'#576574', color:'#fff'}}>⛔ 자재부족</span>}
                                        {isInProgress && <span className="status-badge" style={{background:'#0984e3', color:'#fff'}}>⚙️ 생산중</span>}
                                    </td>
                                    <td>{order.client}</td>
                                    <td style={{ fontWeight: 'bold' }}>{order.productName}</td>
                                    <td>{order.quantity.toLocaleString()}</td>
                                    <td style={{ fontSize: '0.9rem', color: '#b2bec3' }}>
                                        {materialName}
                                        {isShortage && <div style={{color:'#ff6b6b', fontSize:'0.8rem'}}>{order.missingMaterial}</div>}
                                    </td>

                                    {/* 작업 지시 버튼 영역 */}
                                    <td>
                                        {isInProgress ? (
                                            <span style={{color: '#74b9ff', fontSize:'0.9rem', fontWeight:'bold'}}>
                                                    가동 중...
                                                </span>
                                        ) : (
                                            <button
                                                className="sm-btn"
                                                style={{
                                                    borderColor: isShortage ? '#636e72' : '#00b894',
                                                    color: isShortage ? '#636e72' : '#00b894',
                                                    cursor: isShortage ? 'not-allowed' : 'pointer',
                                                    opacity: isShortage ? 0.6 : 1
                                                }}
                                                onClick={() => handleStartProduction(order)}
                                                disabled={isShortage}
                                            >
                                                ▶ 생산 시작
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            <AddOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddOrder}
            />
        </div>
    );
};

export default ProductionPlan;