import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getUserRole } from '../api/authApi.ts';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[]; // 허용할 권한 목록 (선택 사항)
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = getToken();
    const role = getUserRole();
    const location = useLocation();

    // 1. 토큰이 없는 경우 (로그인 안 됨)
    if (!token) {
        // 로그인 페이지로 보내되, 로그인이 끝나면 원래 가려던 곳으로 돌아오도록 state를 전달합니다.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. 권한이 제한된 페이지인데 사용자의 권한이 허용 목록에 없는 경우
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        alert("해당 페이지에 접근할 권한이 없습니다.");
        return <Navigate to="/" replace />; // 메인(대시보드)으로 리다이렉트
    }

    // 3. 모든 조건 통과 시 실제 페이지 보여줌
    return <>{children}</>;
};

export default ProtectedRoute;