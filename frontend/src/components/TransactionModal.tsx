import React, { useState, useEffect } from 'react';
import '../App.css'; // App.css에 정의한 모달 스타일 사용

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quantity: number, remarks: string) => void;
    materialName: string;
    type: 'INCOMING' | 'OUTGOING'; // 입고(INCOMING) vs 출고(OUTGOING)
}

const TransactionModal: React.FC<TransactionModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onSubmit,
                                                               materialName,
                                                               type
                                                           }) => {
    // 상태 관리
    const [quantity, setQuantity] = useState<number>(1); // 수량
    const [remarks, setRemarks] = useState<string>('');  // 비고

    // 모달이 열릴 때마다 초기화 (선택 사항)
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setRemarks('');
        }
    }, [isOpen]);

    // 모달이 닫혀있으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    // 제출 핸들러
    const handleSubmit = () => {
        if (quantity <= 0) {
            alert('수량은 1개 이상이어야 합니다.');
            return;
        }
        onSubmit(quantity, remarks);
        onClose(); // 제출 후 닫기
    };

    // 타입에 따른 제목 및 버튼 텍스트 설정
    const isIncoming = type === 'INCOMING';
    const title = isIncoming ? '📥 자재 입고' : '📤 자재 출고';
    const confirmText = isIncoming ? '입고 확인' : '출고 확인';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* 1. 헤더 (타입에 따라 제목 변경) */}
                <h3>{title}</h3>

                {/* 2. 대상 자재 표시 */}
                <div className="form-group">
                    <label>대상 자재:</label>
                    <p>{materialName || "선택된 자재 없음"}</p>
                </div>

                {/* 3. 수량 입력 */}
                <div className="form-group">
                    <label>수량 (개/L/Sheet)</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="수량을 입력하세요"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

                {/* 4. 비고 입력 */}
                <div className="form-group">
                    <label>비고 (선택)</label>
                    <textarea
                        className="form-input"
                        placeholder={isIncoming ? "예: 정기 입고, 추가 구매 등" : "예: 생산 투입, 불량 폐기 등"}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>

                {/* 5. 버튼 영역 */}
                <div className="modal-actions">
                    {/* 취소 버튼 */}
                    <button className="btn-cancel" onClick={onClose}>
                        취소
                    </button>
                    {/* 확인 버튼 */}
                    <button className="btn-confirm" onClick={handleSubmit}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;