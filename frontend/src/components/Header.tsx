import React from 'react';
import './Header.css'; // 스타일 분리 추천

interface HeaderProps {
    isConnected: boolean;
    onLogout: () => void; // App.tsx에서 내려준 로그아웃 함수 받기
}

const Header: React.FC<HeaderProps> = ({ isConnected, onLogout }) => {
    return (
        <header className="header-container">
            {/* 왼쪽: 로고 및 타이틀 */}
            <div className="header-left">
                <span className="logo-icon">🏭</span>
                <h1 className="app-title">Smart Factory Monitor</h1>
            </div>

            {/* 오른쪽: 상태 표시 & 로그아웃 */}
            <div className="header-right">
                {/* 소켓 연결 상태 표시 */}
                <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    {isConnected ? 'SYSTEM LIVE' : 'DISCONNECTED'}
                </div>

                {/* 구분선 */}
                <div className="divider"></div>

                {/* 로그아웃 버튼 */}
                <button className="logout-btn" onClick={onLogout}>
                    LOGOUT
                </button>
            </div>
        </header>
    );
};

export default Header;