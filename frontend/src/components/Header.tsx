import React from 'react';
import { getUserRole, getUsername } from '../api/authApi.ts';
import './Header.css'; // 스타일 분리 추천

interface HeaderProps {
    isConnected: boolean;
    onLogout: () => void; // App.tsx에서 내려준 로그아웃 함수 받기
}

const Header: React.FC<HeaderProps> = ({ isConnected, onLogout }) => {

    const role = getUserRole();
    const username = getUsername();

    const roleLabel = role === 'ROLE_ADMIN' ? '관리자' : '작업자';

    return (
        <header className="header-container">
            {/* 왼쪽: 로고 및 타이틀 */}
            <div className="header-left">
                <span className="logo-icon">🏭</span>
                <h1 className="app-title">Smart Factory Monitor</h1>
                <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    {isConnected ? 'SYSTEM LIVE' : 'OFFLINE'}
                </div>
            </div>

            {/* 오른쪽: 상태 표시 & 로그아웃 */}
            <div className="header-right">
                <div className="user-info">
                    <span className={`role-badge ${role === 'ROLE_ADMIN' ? 'admin' : 'user'}`}>
                        {roleLabel}
                    </span>
                    <span className="user-name">{username}</span>
                    <span className="user-greeting">님</span>
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