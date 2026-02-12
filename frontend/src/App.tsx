import React, {useEffect, useState} from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { getToken } from './api/auth';
import './App.css';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // 1. 앱 실행 시 토큰 있는지 확인
    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    // 2. 로그인 성공 시 호출
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // 3. 로그아웃 (임시 버튼용)
    const handleLogout = () => {
        // 토큰 삭제 (출입증 폐기)
        localStorage.removeItem('token');
        // 상태 변경 (로그인 화면으로 전환)
        setIsAuthenticated(false);
    };

    // 4. 조건부 렌더링
    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="app-root">
            {isAuthenticated ? (
                // 3. Dashboard에 로그아웃 함수를 전달
                <Dashboard onLogout={handleLogout} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;