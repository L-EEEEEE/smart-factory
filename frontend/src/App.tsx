import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // 방금 만든 컴포넌트
import { getToken, logoutApi } from './api/auth';
import './App.css';

// 임시로 만든 자재/단가 페이지 컴포넌트 (나중에 별도 파일로 만드세요)
const InventoryIn = () => <div style={{padding: "20px", color: "white"}}><h2>자재 입고 관리 (관리자 전용)</h2></div>;
const Pricing = () => <div style={{padding: "20px", color: "white"}}><h2>단가표 관리 (관리자 전용)</h2></div>;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logoutApi(); // 로컬 스토리지 토큰 삭제
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <div className="app-root">
                <Routes>
                    {/* 1. 로그인 페이지: 이미 로그인했다면 메인으로 리다이렉트 */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
                        }
                    />

                    {/* 2. 메인 대시보드: 모든 로그인 사용자 접근 가능 */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard onLogout={handleLogout} />
                            </ProtectedRoute>
                        }
                    />

                    {/* 3. 자재 입고: 인사관리자(ADMIN)만 접근 가능 */}
                    <Route
                        path="/inventory/in"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                                <InventoryIn />
                            </ProtectedRoute>
                        }
                    />

                    {/* 4. 단가표: 인사관리자(ADMIN)만 접근 가능 */}
                    <Route
                        path="/pricing"
                        element={
                            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                                <Pricing />
                            </ProtectedRoute>
                        }
                    />

                    {/* 5. 잘못된 경로로 접근 시 메인으로 이동 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;