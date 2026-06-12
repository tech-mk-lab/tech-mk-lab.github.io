# 팀 미션 챌린지

워크숍 팀 미션을 실시간으로 관리하는 모바일 웹 앱입니다.

**배포 URL**: `https://tech-mk-lab.github.io/mission/`

## 기술 스택

- React 19 + TypeScript
- Tailwind CSS v4
- Vite 8
- React Router v7
- Axios

---

## 개발 환경 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/tech-mk-lab/tech-mk-lab.github.io.git
cd tech-mk-lab.github.io/mission
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

루트 디렉터리의 `.env` 파일을 편집합니다.  
(아래 **환경변수 설정 방법** 섹션 참고)

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173/mission/` 으로 접속합니다.

---

## 환경변수 설정 방법

프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 입력합니다.

```env
# Google Apps Script 배포 URL
VITE_API_BASE_URL=https://script.google.com/macros/s/{SCRIPT_ID}/exec

# 미션별 Google Form URL (사진 제출용)
VITE_MISSION1_FORM_URL=https://docs.google.com/forms/d/{FORM_ID}/viewform
VITE_MISSION2_FORM_URL=https://docs.google.com/forms/d/{FORM_ID}/viewform
```

| 변수 | 설명 |
|------|------|
| `VITE_API_BASE_URL` | Google Apps Script 웹 앱 URL (`GET /teams`, `GET /ranking`, `POST /score` 처리) |
| `VITE_MISSION_FORM_URL` | 미션 사진 제출용 Google Form URL |

> GAS 연동 방법은 [`docs/gas.md`](docs/gas.md) 를 참고하세요.

---

## 배포 방법

### 방법 1 — 수동 배포 (gh-pages)

```bash
npm run deploy
```

내부적으로 `npm run build` → `gh-pages -d dist` 순서로 실행되며,  
빌드 결과물을 `gh-pages` 브랜치에 푸시합니다.

> 환경변수가 `.env` 파일에 설정되어 있어야 합니다.

### 방법 2 — 자동 배포 (GitHub Actions)

`main` 브랜치에 푸시하면 자동으로 빌드 및 배포됩니다.

#### GitHub Secrets 설정

환경변수를 GitHub Secrets에 등록해야 합니다.

1. GitHub 저장소 → **Settings → Secrets and variables → Actions**
2. **New repository secret** 으로 아래 항목을 추가합니다.

   | Secret 이름 | 값 |
   |------------|-----|
   | `VITE_API_BASE_URL` | GAS 웹 앱 URL |
   | `VITE_MISSION1_FORM_URL` | 미션 1 Form URL |
   | `VITE_MISSION2_FORM_URL` | 미션 2 Form URL |

#### GitHub Pages 소스 설정

1. GitHub 저장소 → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `gh-pages` / `/ (root)`
4. **Save**

이후 `main` 브랜치에 푸시할 때마다 Actions 워크플로가 실행되어 자동 배포됩니다.

---

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/mission/` | 홈 — 현황 요약 |
| `/mission/teams` | 팀 목록 및 점수 |
| `/mission/missions` | 미션 목록 (제목만 표시) |
| `/mission/missions/:id` | 미션 상세 (QR 스캔 진입) |
| `/mission/ranking` | 실시간 순위 (30초 자동 갱신) |
| `/mission/admin` | 관리자 — 점수 입력 |
