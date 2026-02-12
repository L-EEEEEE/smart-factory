import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MaterialList from './components/MaterialList';
import { getToken, logoutApi } from './api/auth';
import './App.css';
import Sidebar from "./components/Sidebar.tsx";
import Header from "./components/Header.tsx";
import { useFactorySocket } from "./hooks/useFactorySocket.ts";

const Pricing = () => <div style={{ padding: "20px", color: "white" }}><h2>단가표 관리 (관리자 전용)</h2></div>;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    // 사이드바 열림/닫힘 상태 (반응형을 위해)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 소켓은 로그인 된 상태에서만 연결하는 것이 좋으므로 조건부 처리 가능 (선택사항)
    const { machines, isConnected } = useFactorySocket();

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
        logoutApi();
        setIsAuthenticated(false);
    };

    return (
        <BrowserRouter>
            <div className="app-root">
                {/* 1. 로그인 된 상태에서만 헤더 표시 */}
                {isAuthenticated && <Header isConnected={isConnected} onLogout={handleLogout} />}

                <div className="main-container">
                    {/* 2. 로그인 된 상태에서만 사이드바 표시 (Routes 바깥으로 뺌!) */}
                    {isAuthenticated && (
                        <Sidebar
                            isOpen={isSidebarOpen}
                            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                    )}

                    {/* 3. 오른쪽 콘텐츠 영역 */}
                    <main className="content-area">
                        <Routes>
                            {/* 로그인 페이지 */}
                            <Route
                                path="/login"
                                element={
                                    isAuthenticated ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
                                }
                            />

                            {/* === 보호된 라우트들 === */}
                            {/* Dashboard */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard machines={machines} />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 자재 입고 */}
                            <Route
                                path="/inventory/in"
                                element={
                                    <ProtectedRoute>
                                        <MaterialList />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 단가표 관리 */}
                            <Route
                                path="/pricing"
                                element={
                                    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                                        <Pricing />
                                    </ProtectedRoute>
                                }
                            />

                            {/* 잘못된 경로는 홈으로 */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;