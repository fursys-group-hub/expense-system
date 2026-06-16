# 지출결의 시스템 - 설치 가이드

## 📁 폴더 구조
```
expense-system/
├── efstory/          ← 에프스토리
│   ├── index.html    ← 메인 메뉴
│   ├── mileage.html  ← 자차비
│   ├── corporate.html← 법인카드
│   └── personal.html ← 개인미지급금
├── baro/             ← 바로서비스 (efstory 복사 후 회사명만 변경)
├── hana/             ← 하나물류 (efstory 복사 후 회사명만 변경)
├── apps-script.gs    ← Google Apps Script 코드
└── README.md
```

---

## STEP 1. GitHub 업로드

1. https://github.com/fursys-group-hub 에서 새 repo 생성
   - Repository name: `expense-system`
   - Public 선택
2. 이 폴더 전체를 업로드
3. Settings → Pages → Branch: main, / (root) → Save
4. 약 1분 후 URL 생성:
   `https://fursys-group-hub.github.io/expense-system/efstory/`

---

## STEP 2. Google Sheets + Apps Script 설정

1. Google Sheets 새 파일 생성: `지출결의_통합관리`
2. 확장 프로그램 → Apps Script
3. `apps-script.gs` 내용 전체 붙여넣기 → 저장
4. 배포 → 새 배포:
   - 유형: 웹 앱
   - 실행: 나
   - 액세스: 모든 사용자
5. 배포 URL 복사 (https://script.google.com/macros/s/XXXXX/exec)

---

## STEP 3. HTML에 Apps Script URL 입력

3개 파일에서 `YOUR_APPS_SCRIPT_URL_HERE`를 실제 URL로 교체:
- `efstory/mileage.html` 1번째 줄 SCRIPT_URL
- `efstory/corporate.html` SCRIPT_URL
- `efstory/personal.html` SCRIPT_URL

---

## STEP 4. 바로서비스 / 하나물류 만들기

1. `efstory/` 폴더 전체 복사 → `baro/` 폴더
2. 각 HTML 파일에서 `에프스토리` → `바로서비스` 로 일괄 변경
3. `하나물류`도 동일하게 반복

변경 위치:
- `<span class="header-sub">에프스토리</span>`
- `data.company: '에프스토리'`
- `company-badge` 텍스트
- `department: '에프스토리'`

---

## STEP 5. 네이버 API 키 설정 (자차비 경로 자동계산)

1. https://www.ncloud.com 가입
2. Console → AI·NAVER API → Maps → Directions 5 API 신청
3. Client ID 발급
4. `mileage.html` 에서:
   ```javascript
   const NAVER_CLIENT_ID = 'YOUR_NAVER_CLIENT_ID';
   ```
   → 실제 Client ID 입력

> ⚠️ 네이버 Maps API는 서버사이드 호출이 필요합니다.
> Apps Script가 프록시 역할을 하도록 apps-script.gs에 route 처리가 포함되어 있습니다.

---

## Google Sheets 시트 구조 (자동 생성)

| 시트명 | 내용 |
|--------|------|
| 에프스토리_자차비 | 자차비 청구 내역 |
| 에프스토리_법인카드 | 법인카드 사용 내역 |
| 에프스토리_개인미지급금 | 개인 지출 청구 내역 |
| 바로서비스_자차비 | (동일 구조) |
| ... | ... |
