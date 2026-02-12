import React, { useState } from 'react';
import { loginApi } from '../api/auth';
import './Login.css'; // 스타일 파일 별도 분리 (아래 3번 참고)

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await loginApi(username, password);
        if (success) {
            onLoginSuccess();
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>🏭 Smart Factory</h2>
                <p className="subtitle">Digital Twin Dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button type="submit" className="login-btn">
                        LOGIN
                    </button>
                </form>

                <div className="demo-info">
                    <p>Demo Account: <strong>admin</strong> / <strong>1234</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Login;