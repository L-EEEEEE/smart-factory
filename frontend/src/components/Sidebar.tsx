import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserRole } from '../api/auth';
import { MENU_ITEMS } from '../constants/MenuItem';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ( { isOpen, toggleSidebar }) => {
    const role = getUserRole(); // ROLE_ADMIN 또는 ROLE_USER
    const location = useLocation(); // 현재 활성화된 메뉴 표시용

    // 권한에 맞는 메뉴만 필터링
    const visibleMenuItems = MENU_ITEMS.filter(item =>
        role && item.roles.includes(role)
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-toggle">
                <button onClick={toggleSidebar} className="toggle-btn">
                    {isOpen ? '◀' : '▶'} {/* 아이콘으로 교체 가능 */}
                </button>
            </div>
            <div className="sidebar-header">
                {isOpen && <h3>공정 시스템</h3>}
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {visibleMenuItems.map((item) => (
                        <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                            <Link to={item.path} title={item.title}>
                                {/* 아이콘은 항상 표시 (없으면 첫 글자) */}
                                <span className="menu-icon">{item.icon || '📌'}</span>

                                {/* 텍스트는 열렸을 때만 표시 */}
                                {isOpen && <span className="menu-title">{item.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;