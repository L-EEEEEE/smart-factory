# 🏭 React Smart Factory System (MES & APS)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech](https://img.shields.io/badge/Built%20With-React%20%7C%20TypeScript-61DAFB)

> **AI 기반 생산 계획(APS)과 생산 실행(MES)이 통합된 스마트 팩토리 웹 대시보드**입니다.  
> 실시간 자재 재고와 연동되어, 자재 부족 시 생산 계획을 자동으로 조정하고 원클릭으로 생산을 지시할 수 있습니다.

---

## 🖥️ 프로젝트 소개 (Introduction)

이 프로젝트는 제조 현장의 데이터를 시각화하고 제어하는 **통합 관제 시스템**입니다. 단순한 관리자 페이지를 넘어, **알고리즘 기반의 의사결정 지원 시스템**을 목표로 합니다.

### 핵심 가치 (Core Value)
1.  **데이터 기반 의사결정:** 감에 의존하던 생산 순서를 납기일, 자재 재고, 중요도에 따라 점수화하여 자동 정렬합니다.
2.  **실시간 연동:** 생산 지시(MES)와 동시에 자재 창고(WMS)의 재고가 자동 차감되어 데이터 불일치를 방지합니다.
3.  **직관적인 UX:** 다크 모드 기반의 3D Digital Twin 컨셉 UI로 현장 가시성을 높였습니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 📊 통합 관제 대시보드 (Dashboard)
* **KPI 카드:** 전체 관리 품목 수, 자재 부족 경고(Low Stock), 현재 가동 중인 설비 현황을 한눈에 파악.
* **실시간 차트:** `Recharts`를 활용하여 자재별 재고 현황을 시각화하고 안전재고 미달 시 붉은색 경고 표시.
* **3D 배경:** 공장 내부를 형상화한 3D 씬 레이어 적용 (Three.js/Overlay).

### 2. 🧠 지능형 생산 계획 (APS - Advanced Planning & Scheduling)
* **우선순위 알고리즘:** 납기일(Urgency), 자재 보유 여부(Feasibility), 거래처 중요도(Impact)를 종합하여 생산 순위 자동 산출.
* **자재 부족 감지:** BOM(자재 명세서) 기반으로 필요 수량을 계산, 자재 부족 시 자동으로 **'⛔ 보류'** 처리 및 순위 하향 조정.
* **긴급 주문 대응:** 신규 긴급 발주 등록 시, 기존 스케줄을 밀어내고 최상위로 배치되는 동적 스케줄링.

### 3. ⚙️ 생산 실행 시스템 (MES - Manufacturing Execution System)
* **원클릭 생산 지시:** 계획된 주문에 대해 **[▶ 생산 시작]** 버튼 클릭 시 즉시 라인 가동.
* **자동 자재 불출:** 생산 시작과 동시에 해당 제품의 BOM에 맞춰 자재 재고 자동 차감 (API 연동).
* **상태 추적:** '대기(READY)' → '생산중(IN_PROGRESS)' 상태 실시간 변경 및 시각적 피드백 제공.

### 4. 📦 자재 재고 관리 (Inventory Management)
* **입/출고 관리:** 직관적인 모달 UI를 통한 자재 입고 및 출고 처리.
* **안전재고 모니터링:** 각 자재별 안전재고(Safety Stock) 설정 및 미달 시 경고 배지 표시.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 | 설명 |
| :--- | :--- | :--- |
| **Frontend** | React, TypeScript | 컴포넌트 기반 구조 및 타입 안정성 확보 |
| **State Mgmt** | React Hooks | `useState`, `useEffect`를 활용한 상태 관리 |
| **Visualization** | Recharts | 데이터 시각화 및 대시보드 차트 구현 |
| **Algorithm** | Custom Logic | 가중치 기반 스케줄링 알고리즘 (`scheduler.ts`) |
| **API** | Axios | REST API 비동기 통신 |
| **Styling** | CSS3 (Dark Theme) | Flexbox 레이아웃, CSS Animation, Glassmorphism UI |

---

## 📂 프로젝트 구조 (Folder Structure)
### Frontend
```text
src/
├── api/
│   ├── authApi.ts          # 로그인/인증 API
│   └── materialApi.ts      # 자재 및 트랜잭션 관련 API
├── components/
│   ├── Dashboard.tsx       # 메인 대시보드 (차트 포함)
│   ├── ProductionPlan.tsx  # APS 및 MES 핵심 로직 포함
│   ├── MaterialList.tsx    # 재고 관리 화면
│   ├── TransactionModal.tsx# 입출고 모달
│   ├── AddOrderModal.tsx   # 신규 발주 등록 모달
│   ├── Sidebar.tsx         # 네비게이션
│   └── Header.tsx          # 상단 헤더
├── utils/
│   └── scheduler.ts        # 생산 스케줄링 알고리즘
├── App.css                 # 전역 스타일 및 다크 테마 정의
└── App.tsx                 # 라우팅 및 레이아웃 설정
```
---

## 🚀 설치 및 실행 (Getting Started)
``` bash 
# 1. 저장소 클론
git clone [https://github.com/your-username/smart-factory-mes.git](https://github.com/your-username/smart-factory-mes.git)

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

---

## 📸 스크린샷 (Screenshots)
예정


