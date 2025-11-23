# Vibe Stream - Supabase 설정 가이드

이 가이드는 Vibe Stream 프로젝트의 Supabase 백엔드를 설정하는 방법을 안내합니다.

## 목차
1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [SQL 스크립트 실행](#2-sql-스크립트-실행)
3. [관리자 계정 생성](#3-관리자-계정-생성)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [설정 검증](#5-설정-검증)

---

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 대시보드 접속
1. [https://supabase.com](https://supabase.com)에 접속
2. "Start your project" 또는 "New project" 클릭

### 1.2 프로젝트 설정
- **Organization**: 기존 조직 선택 또는 새로 생성
- **Project Name**: `vibe-stream` (또는 원하는 이름)
- **Database Password**: 강력한 비밀번호 입력 (반드시 저장!)
- **Region**: 가장 가까운 리전 선택 (예: Northeast Asia (Seoul))
- **Pricing Plan**: Free tier 선택

### 1.3 프로젝트 생성 대기
- 프로젝트가 생성되는 데 1-2분 정도 소요됩니다
- 생성 완료 후 프로젝트 대시보드로 이동

---

## 2. SQL 스크립트 실행

### 2.1 SQL Editor 열기
1. 왼쪽 사이드바에서 **SQL Editor** 클릭
2. "New query" 버튼 클릭

### 2.2 SQL 스크립트 붙여넣기
1. 프로젝트 루트의 `supabase_setup.sql` 파일 내용 전체를 복사
2. SQL Editor에 붙여넣기

### 2.3 스크립트 실행
1. **Run** 버튼 클릭 (또는 Ctrl/Cmd + Enter)
2. 성공 메시지 확인: "Success. No rows returned"

### 2.4 생성된 항목 확인

#### 테이블 확인
- 왼쪽 사이드바 **Table Editor** → `artists`, `songs` 테이블 확인

#### Storage 버킷 확인
- 왼쪽 사이드바 **Storage** → 다음 버킷 확인:
  - `artist-images` (5MB 제한, 이미지 전용)
  - `song-images` (5MB 제한, 이미지 전용)
  - `audio-files` (20MB 제한, 오디오 전용)

---

## 3. 관리자 계정 생성

### 3.1 Authentication 설정
1. 왼쪽 사이드바에서 **Authentication** 클릭
2. **Users** 탭으로 이동

### 3.2 관리자 사용자 생성
1. **Add user** → **Create new user** 클릭
2. 다음 정보 입력:
   - **Email**: 관리자 이메일 (예: `admin@vibestream.com`)
   - **Password**: 강력한 비밀번호
   - **Auto Confirm User**: 체크 ✅

3. **Create user** 클릭

### 3.3 관리자 권한 부여
1. 생성된 사용자를 클릭하여 상세 페이지 열기
2. **User Metadata** 섹션 찾기
3. **Raw User Meta Data** 편집 아이콘 클릭
4. 다음 JSON 입력:

```json
{
  "is_admin": true
}
```

5. **Save** 클릭

### 3.4 관리자 계정 정보 저장
- **이메일**: admin@vibestream.com (예시)
- **비밀번호**: [설정한 비밀번호]

⚠️ **중요**: 이 정보는 안전한 곳에 보관하세요!

---

## 4. 환경 변수 설정

### 4.1 Supabase 프로젝트 정보 가져오기
1. Supabase 대시보드에서 **Settings** (톱니바퀴 아이콘) 클릭
2. **API** 탭으로 이동
3. 다음 정보 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** key (긴 문자열)

### 4.2 `.env` 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용 입력:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시**:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjI0NjQwMCwiZXhwIjoxOTMxODIyNDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.3 Git에서 `.env` 제외 확인
`.gitignore` 파일에 `.env`가 포함되어 있는지 확인:

```gitignore
.env
.env.local
```

---

## 5. 설정 검증

### 5.1 개발 서버 실행
```bash
npm run dev
```

### 5.2 관리자 로그인 테스트
1. 브라우저에서 `http://localhost:5173/admin/login` 접속
2. 생성한 관리자 계정으로 로그인
3. 로그인 성공 시 관리자 대시보드로 리다이렉트 확인

### 5.3 데이터베이스 연결 확인
관리자 대시보드에서:
- **Artists** 탭: 빈 목록 표시 확인
- **Songs** 탭: 빈 목록 표시 확인

### 5.4 테스트 아티스트 추가 (선택)
1. Artists 페이지에서 "Add Artist" 클릭
2. 테스트 데이터 입력:
   - Name: "Test Artist"
   - Profile: "Test profile description"
   - Image: (일단 선택하지 않음, 나중에 업로드 기능 구현 예정)
3. "Save" 클릭
4. Supabase 대시보드 Table Editor에서 데이터 확인

---

## 트러블슈팅

### 문제: SQL 스크립트 실행 시 에러
**해결**:
- 에러 메시지를 확인하고 특정 라인에 문제가 있는지 확인
- 스크립트를 섹션별로 나눠서 실행 (주석으로 구분된 섹션별)
- 이미 실행한 적이 있다면 `ON CONFLICT` 구문이 중복 생성을 방지함

### 문제: 관리자 로그인 실패
**해결**:
1. Supabase 대시보드 → Authentication → Users에서 사용자 확인
2. User Metadata에 `"is_admin": true`가 정확히 설정되었는지 확인
3. 이메일/비밀번호가 정확한지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 문제: `.env` 파일이 적용되지 않음
**해결**:
1. 파일 이름이 정확히 `.env`인지 확인 (`.env.example`이 아님)
2. 개발 서버 재시작: `npm run dev`
3. 환경 변수가 `VITE_` 접두사로 시작하는지 확인

### 문제: Storage 버킷이 생성되지 않음
**해결**:
1. SQL Editor에서 Storage 관련 섹션만 다시 실행
2. Storage → Configuration에서 수동으로 버킷 생성:
   - Bucket name: `artist-images`
   - Public: ✅
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

---

## 다음 단계

설정이 완료되면:
1. ✅ 작업 1: Supabase 프로젝트 및 환경 설정 완료
2. 🔜 작업 6.1: 아티스트 이미지 업로드 기능 구현
3. 🔜 작업 7.1: 곡 이미지 및 음성 파일 업로드 기능 구현

---

## 참고 자료
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)
- [Row Level Security (RLS) 가이드](https://supabase.com/docs/guides/auth/row-level-security)
