-- infra/init.sql

CREATE TABLE IF NOT EXISTS machines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    temperature DOUBLE PRECISION,
    vibration DOUBLE PRECISION,
    rpm INTEGER,
    power_usage DOUBLE PRECISION,
    production_count INTEGER DEFAULT 0,
    last_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS machine_logs (
    log_id BIGSERIAL PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL,
    temperature DOUBLE PRECISION,
    vibration DOUBLE PRECISION,
    rpm INTEGER,
    power_usage DOUBLE PRECISION,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_machine FOREIGN KEY(machine_id) REFERENCES machines(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_machine_logs_time ON machine_logs(machine_id, recorded_at DESC);

-- PCB 공정(SMT Line) 초기 데이터 삽입
-- Reflow Oven은 온도가 높아야 하고(240도), Mounter는 RPM이 높아야 함.
INSERT INTO machines (id, name, type, status, temperature, vibration, rpm, power_usage, production_count, last_maintenance) VALUES
    ('MAC-1000', 'Solder Printer #1', 'PRINTER', 'RUNNING', 25.5, 1.2, 500, 120.5, 1540, NOW()),
    ('MAC-1001', 'High-Speed Mounter', 'MOUNTER', 'RUNNING', 38.2, 4.5, 3500, 850.0, 12000, NOW()),
    ('MAC-1002', 'Reflow Oven Zone-1', 'REFLOW', 'RUNNING', 240.5, 0.8, 1200, 3500.0, 0, NOW()),
    ('MAC-1003', 'AOI Inspector (Vision)', 'VISION', 'RUNNING', 30.0, 0.2, 0, 450.0, 11950, NOW()),
    ('MAC-1004', 'Auto Unloader & AGV', 'AGV', 'IDLE', 28.0, 0.5, 0, 120.0, 0, NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    temperature = EXCLUDED.temperature;


-- 회원 테이블 생성
CREATE TABLE IF NOT EXISTS members (
                                       username VARCHAR(50) PRIMARY KEY,
                                       password VARCHAR(255) NOT NULL,
                                       role VARCHAR(20) NOT NULL
);

-- 초기 관리자(Admin) 계정 삽입
-- 아이디: admin, 비번: 1234 (앞에 {noop}은 "암호화 안 된 문자 그대로"라는 뜻)
INSERT INTO members (username, password, role)
VALUES ('admin', '{noop}1234', 'ROLE_ADMIN')
ON CONFLICT (username) DO NOTHING;