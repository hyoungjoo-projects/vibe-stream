# Vibe Stream

음악 스트리밍 웹 애플리케이션입니다. 관리자가 아티스트와 노래를 추가하고, 사용자가 새로운 음악을 발견하고 재생할 수 있습니다.

## 주요 기능

- 아티스트 및 곡 목록 탐색
- 음악 재생 (HTML5 Audio API)
- 즐겨찾기 관리 (로컬 스토리지)
- 관리자 기능 (아티스트/곡 추가 및 편집)

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API, Zustand
- **Server State**: React Query (TanStack Query)
- **Backend**: Supabase (Database, Auth, Storage)
- **Form**: React Hook Form, Zod

## 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 컴포넌트
│   ├── ui/          # shadcn/ui 컴포넌트
│   ├── Header.tsx
│   ├── PlayerWidget.tsx
│   ├── ArtistCard.tsx
│   └── SongCard.tsx
├── contexts/        # React Context
│   └── PlayerContext.tsx
├── hooks/           # Custom Hooks
│   ├── usePlayer.ts
│   ├── useFavorites.ts
│   ├── useArtists.ts
│   ├── useSongs.ts
│   └── useAuth.ts
├── lib/            # 라이브러리 설정
│   ├── supabase.ts
│   ├── queryClient.ts
│   └── utils.ts
├── pages/          # 페이지 컴포넌트
│   ├── Home.tsx
│   ├── ArtistDetail.tsx
│   ├── Favorite.tsx
│   └── admin/
│       ├── Login.tsx
│       ├── Artists.tsx
│       └── Songs.tsx
├── types/          # TypeScript 타입 정의
│   ├── artist.ts
│   └── song.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 시작하기

### 0. 음악 파일 및 커버 이미지 준비

⚠️ **중요**: 이 프로젝트는 음악 파일과 커버 이미지를 포함하지 않습니다. 저작권 문제로 인해 직접 준비하셔야 합니다.

다음 폴더를 생성하고 파일을 추가하세요:

```bash
# 프로젝트 루트에 폴더 생성
mkdir songs covers
```

#### 파일 구조:
- `songs/`: 음악 파일 (`.mp3` 형식)
  - 파일명 형식: `{아티스트명}-{번호}-{곡명}.mp3`
  - 예: `아이유(IU)-01-Never Ending Story.mp3`

- `covers/`: 커버 이미지 (`.png`, `.jpg` 형식)
  - 파일명: 아티스트명과 동일하게
  - 예: `아이유(IU).png`

> 💡 **팁**: 테스트용으로는 무료 음원 사이트나 본인이 직접 제작한 음악을 사용하세요.

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 Supabase 정보를 입력하세요:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabase 설정

#### 데이터베이스 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- artists 테이블 생성
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  profile TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- songs 테이블 생성
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX songs_artist_id_idx ON songs(artist_id);

-- RLS 정책 설정
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Artists are viewable by everyone"
  ON artists FOR SELECT
  USING (true);

CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  USING (true);

-- 관리자만 수정 가능
CREATE POLICY "Artists are editable by admins"
  ON artists FOR ALL
  USING (auth.jwt() ->> 'user_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "Songs are editable by admins"
  ON songs FOR ALL
  USING (auth.jwt() ->> 'user_metadata' ->> 'is_admin' = 'true');
```

#### Storage 버킷 생성

Supabase Storage에서 다음 버킷을 생성하세요:

- `artist-images` (public)
- `song-images` (public)
- `audio-files` (public)

#### 관리자 계정 생성

1. Supabase Authentication에서 사용자를 생성
2. SQL Editor에서 사용자에게 관리자 권한 부여:

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 애플리케이션을 확인하세요.

### 5. 프로덕션 빌드

```bash
npm run build
```

## 사용 가이드

### 일반 사용자

1. 홈페이지에서 아티스트와 곡을 탐색
2. 곡 카드의 재생 버튼을 클릭하여 음악 재생
3. 하트 아이콘을 클릭하여 즐겨찾기에 추가
4. 즐겨찾기 페이지에서 저장한 곡 확인

### 관리자

1. `/admin/login`에서 로그인
2. 아티스트 관리 페이지에서 아티스트 추가/편집
3. 각 아티스트의 "곡 관리" 버튼을 클릭하여 곡 추가/편집

## TODO

- [ ] 파일 업로드 기능 구현 (Supabase Storage)
- [ ] 검색 기능 추가
- [ ] 재생 목록 기능
- [ ] 반응형 디자인 개선
- [ ] 다크 모드 지원

## 라이센스

MIT
