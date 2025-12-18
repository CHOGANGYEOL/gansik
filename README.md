# 🍪 Gansik Request Sheet

**Gansik Request Sheet**는 팀원들이 원할 때 간식을 요청하고,  
그 요청 내역을 Google Sheet에 자동으로 기록하는 간단하고 직관적인 **간식 요청 시스템**입니다.


---

## 🚀 Features

- 📝 이름과 간식 링크를 제출하면 Google Sheet에 자동 저장
- 📄 제출된 요청 목록을 실시간 테이블로 확인
- 🌐 Google Sheets API 연동
- 🔄 시트 실시간 반영 (SSE 사용)
- 📆 날짜별 시트 생성 및 전환 가능
- 🧼 UI 최소화로 누구나 사용 가능

---

## 🧱 Tech Stack

| Layer    | Tech                                                          |
| -------- | ------------------------------------------------------------- |
| Frontend | [Next.js 14 (App Router + TypeScript)](https://nextjs.org/)   |
| Backend  | Next.js API Route + SSE (Server-Sent Events)                  |
| Data     | [Google Sheets API](https://developers.google.com/sheets/api) |
| State    | [Tanstack Query](https://tanstack.com/query/latest)           |
| UI       | [Material UI (MUI)](https://mui.com/)                         |

---

## 🛠️ Getting Started

```bash
# 1. 패키지 설치
pnpm install

# 2. 개발 서버 실행
pnpm dev
```
