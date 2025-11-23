# Vibe Stream - 개발 노트

## 현재 상태 (Version 1)

### 완료된 기능
- ✅ 기본 음악 스트리밍 기능
- ✅ 아티스트/곡 목록 표시
- ✅ 음악 플레이어 (재생, 일시정지, 볼륨 조절, 진행바)
- ✅ 관리자 페이지 (아티스트/곡 관리)
- ✅ 권한별 로그인 시스템
  - 관리자 (`is_admin=true`) → `/admin/artists`로 리다이렉트
  - 일반 사용자 (`is_admin=false`) → `/` 홈으로 리다이렉트
- ✅ 아티스트 팔로우 기능 (localStorage)
- ✅ 곡 즐겨찾기 기능 (localStorage)
- ✅ 즐겨찾기 페이지 (팔로우한 아티스트 + 즐겨찾기 곡)

### 테스트 계정

**Supabase 설정:**
- URL: `https://jdpbkhqyjltsnkojzids.supabase.co`
- 프로젝트: vibe-stream

**계정 정보:**
```
관리자 계정:
- Email: admin@vibe.com
- Password: 1234
- is_admin: true

일반 사용자 계정:
- Email: guest@vibe.com
- Password: 1234
- is_admin: false
```

### 데이터베이스 구조

**테이블:**
- `artists`: 아티스트 정보
  - id, name, profile, image_url, created_at, updated_at
- `songs`: 곡 정보
  - id, title, artist_id, audio_url, image_url, duration, created_at, updated_at

**RLS 정책:**
- 모든 사용자: 읽기 가능
- 관리자만: 추가/수정/삭제 가능

### 로컬 저장 데이터

**localStorage 키:**
- `vibe-stream-favorites`: 즐겨찾기 곡 ID 배열
- `vibe-stream-artist-follows`: 팔로우한 아티스트 ID 배열

### 파일 구조

**중요 파일:**
- `src/hooks/useAuth.ts`: 인증 관리
- `src/hooks/useArtistFollow.ts`: 아티스트 팔로우 (localStorage)
- `src/hooks/useFavorites.ts`: 곡 즐겨찾기 (localStorage)
- `src/hooks/usePlayer.ts`: 플레이어 상태 관리
- `src/contexts/PlayerContext.tsx`: 플레이어 Context
- `src/pages/admin/Login.tsx`: 로그인 페이지
- `src/components/Header.tsx`: 헤더 (권한별 메뉴 표시)

**제외된 폴더:**
- `songs/`: 음악 파일 (직접 추가 필요)
- `covers/`: 커버 이미지 (직접 추가 필요)

## 알려진 이슈 및 개선사항

### 1. 파일 업로드 기능 없음
- 현재: 관리자가 수동으로 Supabase Storage에 파일 업로드 필요
- 개선: UI에서 직접 파일 업로드 기능 구현 필요
- 참고: `src/hooks/useUpload.ts` 파일 존재하지만 미사용

### 2. ArtistDetail 페이지 곡 간격
- 현재: `gap-4`
- 홈페이지 최신곡: `gap-6`
- TODO: 통일성을 위해 `gap-6`으로 변경 고려 (src/pages/ArtistDetail.tsx:213)

### 3. 검색 기능 없음
- 아티스트/곡 검색 기능 미구현

### 4. 재생 목록 기능 없음
- 큐 관리, 다음 곡 자동 재생 등 미구현

### 5. 반응형 개선 필요
- 모바일에서 일부 UI 개선 여지 있음

## 다음 버전 계획 (TODO)

### 우선순위 높음
- [ ] 파일 업로드 UI 구현
  - Supabase Storage 연동
  - 아티스트 이미지 업로드
  - 곡 파일 및 커버 업로드
  - 진행률 표시
- [ ] 검색 기능
  - 아티스트명, 곡명 검색
  - 실시간 검색 제안
- [ ] 재생 목록 기능
  - 큐 관리
  - 다음 곡 자동 재생
  - 셔플, 반복 재생

### 우선순위 중간
- [ ] 사용자 프로필 페이지
- [ ] 재생 히스토리
- [ ] 좋아요 통계 (인기 곡)
- [ ] 공유 기능 (SNS)
- [ ] 플레이리스트 생성

### 우선순위 낮음
- [ ] 다크 모드
- [ ] 가사 표시
- [ ] 이퀄라이저
- [ ] 크로스페이드

## 개발 환경 설정

### 필수 환경 변수 (.env)
```
VITE_SUPABASE_URL=https://jdpbkhqyjltsnkojzids.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_V0-_n9xJrs6Co1SkBoKu9Q_LbYoHp3a
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 참고 문서
- [Supabase 설정 가이드](./SUPABASE_SETUP_GUIDE.md)
- [관리자 계정 설정](./ADMIN_ACCOUNT_SETUP.md)
- [README](./README.md)

## 주의사항
- ⚠️ `.env` 파일은 git에 포함되지 않음 (`.gitignore`에 추가됨)
- ⚠️ 음악 파일과 커버 이미지는 저작권 문제로 repository에 포함되지 않음
- ⚠️ localStorage 사용으로 브라우저 데이터 삭제 시 팔로우/즐겨찾기 초기화됨

## 버전 히스토리

### Version 1 (2025-11-23)
- 초기 릴리즈
- 기본 음악 스트리밍 기능
- 관리자/일반 사용자 권한 시스템
- 팔로우/즐겨찾기 기능
