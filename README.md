# ☕ Coffee NFC App

구글 시트 기반 커피 정보 관리 시스템입니다. NFC 태그를 통해 고객이 커피 정보에 쉽게 접근할 수 있습니다.

## 🚀 주요 기능

- **구글 시트 연동**: 구글 시트에서 직접 커피 정보 관리
- **자동 URL 생성**: 각 커피별 고유 슬러그 자동 생성
- **실시간 동기화**: GitHub Actions를 통한 자동 데이터 동기화
- **모바일 최적화**: 반응형 디자인으로 모든 기기에서 최적화
- **SEO 친화적**: 정적 사이트 생성으로 검색 엔진 최적화

## 📊 구글 시트 구조

구글 시트에 다음 컬럼들을 설정해주세요:

| 컬럼명 | 설명 | 예시 |
|--------|------|------|
| id | 고유 ID | eth-001 |
| name | 원두명 | Ethiopian Yirgacheffe |
| origin | 원산지 | Sidamo, Ethiopia |
| slug | URL 슬러그 (선택사항) | ethiopian-yirgacheffe-abc123 |
| description | 설명 | Bright and floral with citrus notes |
| farmer | 농부/농장 | Addisu Hulichaye |
| altitude | 고도 | 1,800-2,000m |
| process | 가공방식 | Natural |
| roast_level | 로스팅 레벨 | Light |
| harvest_date | 수확 시기 | 2023년 11월 |
| price | 가격 | 28000 |
| tasting_notes | 테이스팅 노트 (쉼표 구분) | citrus,floral,bright |
| badges | 배지 (쉼표 구분) | lemon peel,peach,orange |
| active | 활성화 여부 | TRUE |
| created_at | 생성일 | 2024-01-15 |

## 🛠️ 설정 방법

### 1. 구글 시트 준비

1. 새 구글 시트 생성
2. 위의 컬럼 구조로 헤더 설정
3. 샘플 데이터 입력
4. 파일 → 공유 → "링크가 있는 모든 사용자" 권한 설정
5. 파일 → 다운로드 → CSV로 내보내기 URL 복사

### 2. GitHub 리포지토리 설정

1. 이 프로젝트를 GitHub에 푸시
2. Settings → Secrets and variables → Actions에서 다음 시크릿 추가:
   - `GOOGLE_SHEET_CSV_URL`: 구글 시트 CSV URL
   - `VERCEL_TOKEN`: Vercel 배포 토큰 (선택사항)
   - `VERCEL_ORG_ID`: Vercel 조직 ID (선택사항)
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID (선택사항)

### 3. 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 구글 시트 데이터 동기화
npm run sync-sheets
```

### 4. 배포

#### Vercel 배포 (추천)
1. Vercel 계정 생성
2. GitHub 리포지토리 연결
3. 자동 배포 설정

#### 수동 배포
```bash
# 빌드
npm run build

# 빌드 파일을 원하는 호스팅 서비스에 업로드
```

## 🔄 데이터 동기화

### 자동 동기화
- GitHub Actions가 30분마다 구글 시트 확인
- 변경사항 감지 시 자동으로 데이터 업데이트
- Vercel 자동 재배포

### 수동 동기화
1. GitHub Actions 탭에서 "Sync Google Sheets Data" 워크플로우 실행
2. 또는 로컬에서 `npm run sync-sheets` 실행

## 📱 URL 구조

생성되는 URL 형식:
```
https://your-domain.com/bean/addisu-hulichaye-ethiopia-abc123
https://your-domain.com/coffee/colombian-supremo-huila-def456
```

## 🎨 커스터마이징

### 디자인 수정
- `src/pages/Details.tsx`: 커피 상세 페이지
- `src/pages/Home.tsx`: 홈페이지
- `src/components/ui/Badge.tsx`: 배지 컴포넌트

### 데이터 구조 수정
- `scripts/sync-sheets.js`: 구글 시트 파싱 로직
- `src/pages/Details.tsx`: 타입 정의

## 🚨 문제 해결

### 구글 시트 연결 안됨
1. 시트가 공개 설정되어 있는지 확인
2. CSV URL이 올바른지 확인
3. GitHub Secrets에 URL이 정확히 설정되어 있는지 확인

### 데이터가 업데이트 안됨
1. GitHub Actions 로그 확인
2. 구글 시트의 `active` 컬럼이 `TRUE`로 설정되어 있는지 확인
3. 수동으로 워크플로우 실행해보기

### 빌드 에러
1. Node.js 버전 확인 (18 이상 권장)
2. `npm ci`로 의존성 재설치
3. TypeScript 에러 확인

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ for coffee lovers
