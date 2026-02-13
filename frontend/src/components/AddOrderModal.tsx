import React, { useState } from 'react';
import '../App.css';

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: any) => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [client, setClient] = useState('');
    const [productName, setProductName] = useState('고성능 PCB 보드');
    const [quantity, setQuantity] = useState(100);
    const [dueDate, setDueDate] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!client || !dueDate) {
            alert('거래처와 납기일은 필수입니다.');
            return;
        }

        onSubmit({
            client,
            productName,
            quantity: Number(quantity),
            dueDate
        });
        onClose();
        // 입력 필드 초기화
        setClient('');
        setQuantity(100);
        setDueDate('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>📝 신규 생산 발주 등록</h3>

                <div className="form-group">
                    <label>거래처명</label>
                    <input
                        className="form-input"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="예: 현대모비스"
                    />
                </div>

                <div className="form-group">
                    <label>생산 제품 (BOM 연결)</label>
                    <select
                        className="form-input"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    >
                        <option value="고성능 PCB 보드">고성능 PCB 보드</option>
                        <option value="LED 모듈">LED 모듈</option>
                        <option value="메모리 칩셋">메모리 칩셋</option>
                        <option value="전장 제어기">전장 제어기</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>수량</label>
                    <input
                        type="number"
                        className="form-input"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

                <div className="form-group">
                    <label>납기일 (Due Date)</label>
                    <input
                        type="date"
                        className="form-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <p style={{fontSize: '0.8rem', color: '#ff6b6b', marginTop: '5px'}}>
                        * 오늘 날짜와 가까울수록 우선순위가 급상승합니다.
                    </p>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>취소</button>
                    <button className="btn-confirm" onClick={handleSubmit}>발주 등록</button>
                </div>
            </div>
        </div>
    );
};

export default AddOrderModal;