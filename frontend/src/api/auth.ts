const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
            // 백엔드에서 단순 String으로 토큰을 보냅니다.
            const token = await response.text();
            localStorage.setItem('token', token); // 브라우저 저장소에 보관
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const logoutApi = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};