# 🏭 PCB Manufacturing Digital Twin Dashboard
> **실시간 센서 데이터 기반의 PCB 생산 라인 모니터링 및 시각화 시스템**

본 프로젝트는 실제 PCB 제조 공정(SMT 라인)의 데이터를 실시간으로 수집하고, 이를 3D 디지털 트윈 환경으로 시각화하여 공정 효율성과 품질 관리를 극대화하는 것을 목표로 합니다.

---

## 🚀 주요 기능 (Key Features)

### 1. 3D Digital Twin Visualization
* **Three.js (R3F)**를 활용하여 실제 공장 내부를 3D로 모델링하였습니다.
* 서버의 실시간 장비 상태(Status)에 따라 기계의 회전 애니메이션 및 색상 변화를 실시간으로 반영합니다.

### 2. Real-time Monitoring (WebSocket)
* **Spring WebSocket(STOMP)**을 사용하여 1초 단위의 장비 데이터(온도, 진동, RPM, 전력량)를 동기화합니다.
* 사용자는 브라우저 새로고침 없이 실시간으로 업데이트되는 대시보드를 확인할 수 있습니다.

### 3. Quality History Analysis
* **Recharts**를 활용하여 장비별 센서 이력을 시각화합니다.
* PCB 품질의 핵심인 **Reflow Oven 온도 프로파일** 및 **Mounter 진동 추세** 분석 기능을 제공합니다.

### 4. Smart Factory Operation
* REST API를 통해 개별 장비를 원격으로 제어(START / STOP)할 수 있습니다.
* **PostgreSQL**을 사용하여 장비 마스터 데이터 및 로그 데이터 이력을 체계적으로 관리합니다.

---

## 🛠 Tech Stack

### Backend
* **Java 17 / Spring Boot 3.4.2**
* **Spring Data JPA**
* **Spring WebSocket (STOMP)**
* **PostgreSQL**

### Frontend
* **React (TypeScript)**
* **Three.js / React Three Fiber**
* **Recharts** (Data Visualization)
* **CSS3** (Responsive Dashboard Layout)

### Infrastructure
* **Docker & Docker Compose**

---

## 🏗 System Architecture


---

## ⚙️ 시작하기 (How to Run)

### Prerequisites
* Docker & Docker Compose
* Java 17

### Installation

```bash
# 1. 원격 저장소 복제 (실제 본인의 주소로 변경하세요)
git clone [https://github.com/사용자이름/pcb-smart-factory.git](https://github.com/사용자이름/pcb-smart-factory.git)

# 2. 인프라 실행 (DB)
cd infra
docker-compose up -d

# 3. 백엔드 실행
cd ../backend
./gradlew bootRun

# 4. 프론트엔드 실행
cd ../smart-factory-client
npm install
npm run dev
```
---

## 💡 구현 포인트 (Dev Notes)
* CORS & Security: React와 Spring Boot 간의 원활한 통신을 위해 WebMvcConfigurer와 WebSocketMessageBrokerConfigurer를 통한 CORS 설정을 최적화했습니다.
* Real-time Performance: 1초 단위의 잦은 데이터 업데이트 스트림을 효율적으로 처리하기 위해 WebSocket 최적화 및 React 상태 관리 기법을 적용했습니다.

