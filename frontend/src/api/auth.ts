import { jwtDecode } from 'jwt-decode'; // 👈 라이브러리 임포트

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// JWT 페이로드 인터페이스 정의
interface CustomJwtPayload {
    sub: string;
    auth: string; // 백엔드에서 담아준 권한 정보 (ROLE_ADMIN 등)
    exp: number;
}

export const loginApi = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const token = await response.text();
            localStorage.setItem('token', token);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

// 👇 권한 정보를 가져오는 함수 추가
export const getUserRole = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);

        // 토큰 만료 체크
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            logoutApi(); // 만료되었으면 토큰 삭제
            return null;
        }

        return decoded.auth;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

export const logoutApi = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};