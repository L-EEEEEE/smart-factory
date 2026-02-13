export interface MenuItem {
    title: string;
    path: string;
    roles: string[]; // 접근 가능한 권한 목록
    icon?: string;
}

export const MENU_ITEMS: MenuItem[] = [
    { title: '대시보드', path: '/', roles: ['ROLE_USER', 'ROLE_ADMIN'] },
    { title: '자재 입고', path: '/inventory/in', roles: ['ROLE_ADMIN'] }, // 인사관리자(ADMIN)만 가능
    { title: '생산 계획', path: '/plan', roles: ['ROLE_ADMIN'] },
    { title: '단가표 관리', path: '/pricing', roles: ['ROLE_ADMIN'] },
    { title: '사원 관리', path: '/admin/members', roles: ['ROLE_ADMIN'] },
];