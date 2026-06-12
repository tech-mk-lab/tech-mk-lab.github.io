# Google Apps Script 연동 가이드

React 앱(`VITE_API_BASE_URL`)과 연결되는 Google Apps Script REST API 구현 가이드입니다.

---

## 1. Google Sheets 구조

스프레드시트 하나에 아래 두 개의 시트를 생성합니다.

### Teams 시트

팀 기본 정보와 현재 점수를 관리합니다.

| id | name | members | score | color | completedMissions |
|----|------|---------|------:|-------|------------------:|
| t1 | 팀 알파 | 김철수,이영희,박민준 | 320 | #3B82F6 | 2 |
| t2 | 팀 베타 | 최지수,정현우,강소영 | 280 | #10B981 | 1 |
| t3 | 팀 감마 | 윤서준,임나연,한태양 | 250 | #F59E0B | 1 |
| t4 | 팀 델타 | 송민서,조현진,오세린 | 190 | #EF4444 | 0 |

- **members**: 쉼표로 구분된 팀원 이름 (공백 무시)
- **color**: HEX 컬러 코드 (앱 UI 색상과 일치)
- **completedMissions**: 완료한 미션 수 (POST /score 호출 시 수동 관리)

### ScoreLog 시트

점수 변경 이력을 기록합니다. 자동으로 행이 추가됩니다.

| timestamp | teamName | delta | newScore |
|-----------|----------|------:|---------:|
| 2026-06-11 14:30:00 | 팀 알파 | 50 | 370 |
| 2026-06-11 14:35:00 | 팀 베타 | -20 | 260 |

---

## 2. Google Apps Script 코드

Google Apps Script 편집기에 아래 코드를 붙여넣습니다.

```javascript
const TEAMS_SHEET = 'Teams';
const LOG_SHEET   = 'ScoreLog';

// ── 라우팅 ──────────────────────────────────────────────

function doGet(e) {
  const path = (e.pathInfo || '').replace(/^\//, '');
  try {
    if (path === 'teams')   return respond(getTeams());
    if (path === 'ranking') return respond(getRanking());
    return respond({ error: 'Not found' }, 404);
  } catch (err) {
    return respond({ error: err.message }, 500);
  }
}

function doPost(e) {
  const path = (e.pathInfo || '').replace(/^\//, '');
  try {
    if (path === 'score') {
      const body = JSON.parse(e.postData.contents);
      return respond(postScore(body));
    }
    return respond({ error: 'Not found' }, 404);
  } catch (err) {
    return respond({ error: err.message }, 500);
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET /teams ───────────────────────────────────────────

function getTeams() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TEAMS_SHEET);
  const [headers, ...rows] = sheet.getDataRange().getValues();

  return rows
    .filter(row => row[0] !== '')
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      obj.members = obj.members
        ? String(obj.members).split(',').map(m => m.trim()).filter(Boolean)
        : [];
      obj.score = Number(obj.score) || 0;
      obj.completedMissions = Number(obj.completedMissions) || 0;
      return obj;
    });
}

// ── GET /ranking ─────────────────────────────────────────

function getRanking() {
  return getTeams()
    .sort((a, b) => b.score - a.score)
    .map((team, index) => ({
      rank:               index + 1,
      teamId:             team.id,
      teamName:           team.name,
      score:              team.score,
      completedMissions:  team.completedMissions,
    }));
}

// ── POST /score ───────────────────────────────────────────
// 요청: { "teamName": "팀 알파", "score": 50 }

function postScore({ teamName, score }) {
  if (!teamName) throw new Error('teamName is required');
  const delta = Number(score);
  if (isNaN(delta))   throw new Error('score must be a number');

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(TEAMS_SHEET);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const nameCol  = headers.indexOf('name');
  const scoreCol = headers.indexOf('score');

  for (let i = 1; i < values.length; i++) {
    if (values[i][nameCol] === teamName) {
      const newScore = Number(values[i][scoreCol]) + delta;
      sheet.getRange(i + 1, scoreCol + 1).setValue(newScore);
      appendLog(ss, teamName, delta, newScore);
      return { success: true, teamName, delta, newScore };
    }
  }

  throw new Error(`Team "${teamName}" not found`);
}

function appendLog(ss, teamName, delta, newScore) {
  const log = ss.getSheetByName(LOG_SHEET);
  if (!log) return;
  const timestamp = Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'
  );
  log.appendRow([timestamp, teamName, delta, newScore]);
}
```

---

## 3. 배포 방법

### 3-1. 스크립트 생성

1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트를 생성합니다.
2. **1. Google Sheets 구조** 에 따라 `Teams`, `ScoreLog` 시트를 만들고 초기 데이터를 입력합니다.
3. 메뉴 **확장 프로그램 → Apps Script** 를 클릭합니다.
4. 기본 코드를 모두 지우고 위 코드를 붙여넣은 뒤 저장(Ctrl+S)합니다.

### 3-2. 웹 앱 배포

1. 우측 상단 **배포 → 새 배포** 를 클릭합니다.
2. 유형 선택: **웹 앱**
3. 아래와 같이 설정합니다.

   | 항목 | 값 |
   |------|-----|
   | 설명 | Mission App API |
   | 다음 사용자로 실행 | **나** |
   | 액세스 권한 | **모든 사용자** |

4. **배포** 를 클릭하고 권한 승인을 완료합니다.
5. 표시되는 **웹 앱 URL** 을 복사합니다.

   ```
   https://script.google.com/macros/s/{SCRIPT_ID}/exec
   ```

### 3-3. 환경변수 설정

프로젝트 루트의 `.env` 파일에 복사한 URL을 설정합니다.

```env
VITE_API_BASE_URL=https://script.google.com/macros/s/{SCRIPT_ID}/exec
```

이후 앱이 호출하는 실제 엔드포인트는 다음과 같습니다.

| React 호출 | 최종 URL                    |
|-----------|---------------------------|
| `GET /teams` | `.../exec?action=teams`   |
| `GET /plan` | `.../exec?action=plan`   |
| `GET /ranking` | `.../exec?action=ranking` |
| `POST /score` | `.../exec?action=score`   |

### 3-4. 코드 수정 후 재배포

스크립트를 수정했을 때는 반드시 **새 버전**으로 배포해야 반영됩니다.

1. **배포 → 배포 관리** 를 클릭합니다.
2. 기존 배포 항목의 연필 아이콘을 클릭합니다.
3. 버전을 **새 버전** 으로 변경 후 **배포** 를 클릭합니다.

> URL은 변경되지 않습니다.

---

## 4. 동작 확인

배포 후 브라우저에서 직접 GET 엔드포인트를 확인할 수 있습니다.

```
# 팀 목록
https://script.google.com/macros/s/{SCRIPT_ID}/exec/teams

# 순위
https://script.google.com/macros/s/{SCRIPT_ID}/exec/ranking
```

POST /score 는 curl 로 확인합니다.

```bash
curl -X POST \
  "https://script.google.com/macros/s/{SCRIPT_ID}/exec/score" \
  -H "Content-Type: application/json" \
  -d '{"teamName":"팀 알파","score":50}'
```

정상 응답 예시:

```json
{ "success": true, "teamName": "팀 알파", "delta": 50, "newScore": 370 }
```

---

## 5. 주의 사항

- **캐시**: GAS 웹 앱은 GET 응답을 최대 6시간 캐시할 수 있습니다. 실시간성이 필요하면 URL에 `?t={timestamp}` 를 추가하거나 캐시를 비활성화하세요.
- **재배포 필수**: 코드 변경 후 배포를 새 버전으로 올리지 않으면 이전 코드가 실행됩니다.
- **권한 오류**: 배포 시 "액세스 권한"이 **모든 사용자** 가 아닌 경우 프론트에서 CORS 오류가 발생합니다.
