import { getToken } from './authApi.ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ==========================================
// 타입 정의 (백엔드 DTO와 일치시켜야 함)
// ==========================================

// 공통 응답 (ApiResponse<T>)
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// 자재 데이터 (MaterialResponseDto)
export interface Material {
    id: number;
    itemCode: string;
    itemName: string;
    category: string;
    currentStock: number;
    safetyStock: number;
    unitPrice: number;
    updatedAt: string;
}

// 자재 이력 데이터 (MaterialHistoryResponseDto)
export interface MaterialHistory {
    id: number;
    type: 'INCOMING' | 'OUTGOING' | 'RETURN' | 'ADJUSTMENT'; // Enum
    quantity: number;
    stockAfterTransaction: number;
    worker: string;
    remarks: string;
    transactionDate: string;
}

// 자재 등록 요청 (MaterialCreateRequestDto)
export interface CreateMaterialRequest {
    itemCode: string;
    itemName: string;
    category: string;
    safetyStock: number;
    unitPrice: number;
}

// 트랜잭션 요청 (TransactionRequestDto)
export interface TransactionRequest {
    itemCode: string;
    type: 'INCOMING' | 'OUTGOING' | 'RETURN' | 'ADJUSTMENT';
    quantity: number;
    remarks?: string;
}

// ==========================================
// API 호출 함수들
// ==========================================

// 헤더 생성 도우미 (토큰 자동 첨부)
const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

/**
 * 전체 자재 목록 조회
 * GET /api/materials
 */
export const fetchMaterials = async (): Promise<Material[]> => {
    const response = await fetch(`${API_URL}/api/materials`, {
        method: 'GET',
        headers: getHeaders(),
    });

    const result: ApiResponse<Material[]> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || '자재 목록을 불러오는데 실패했습니다.');
    }

    return result.data; // List만 반환
};

/**
 * 신규 자재 등록 (관리자용)
 * POST /api/materials
 */
export const createMaterial = async (data: CreateMaterialRequest): Promise<Material> => {
    const response = await fetch(`${API_URL}/api/materials`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    const result: ApiResponse<Material> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || '자재 등록에 실패했습니다.');
    }

    return result.data;
};

/**
 * 자재 입/출고 트랜잭션 실행
 * POST /api/materials/transaction
 */
export const recordTransaction = async (data: TransactionRequest): Promise<string> => {
    const response = await fetch(`${API_URL}/api/materials/transaction`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    const result: ApiResponse<string> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || '트랜잭션 처리에 실패했습니다.');
    }

    return result.data; // 성공 메시지 반환
};

/**
 * 특정 자재의 이력 조회
 * GET /api/materials/{itemCode}/history
 */
export const fetchMaterialHistory = async (itemCode: string): Promise<MaterialHistory[]> => {
    const response = await fetch(`${API_URL}/api/materials/${itemCode}/history`, {
        method: 'GET',
        headers: getHeaders(),
    });

    const result: ApiResponse<MaterialHistory[]> = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || '이력 조회에 실패했습니다.');
    }

    return result.data;
};