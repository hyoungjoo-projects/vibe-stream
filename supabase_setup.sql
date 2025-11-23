-- ============================================
-- vibe-stream Supabase 설정 SQL
-- ============================================

-- 1. UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 테이블 생성
-- ============================================

-- Artists 테이블
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  profile TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs 테이블
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  image_url TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Songs 인덱스
CREATE INDEX IF NOT EXISTS songs_artist_id_idx ON songs(artist_id);

-- ============================================
-- 3. RLS (Row Level Security) 활성화
-- ============================================

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Artists 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 아티스트 조회 가능
CREATE POLICY "Artists are viewable by everyone"
  ON artists FOR SELECT
  USING (true);

-- 관리자만 아티스트 생성/수정/삭제 가능
CREATE POLICY "Artists are editable by admins"
  ON artists FOR ALL
  USING (
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

-- ============================================
-- 5. Songs 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 곡 조회 가능
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  USING (true);

-- 관리자만 곡 생성/수정/삭제 가능
CREATE POLICY "Songs are editable by admins"
  ON songs FOR ALL
  USING (
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

-- ============================================
-- 6. Storage 버킷 생성
-- ============================================

-- artist-images 버킷 (5MB, 이미지만)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artist-images',
  'artist-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- song-images 버킷 (5MB, 이미지만)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'song-images',
  'song-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- audio-files 버킷 (20MB, 오디오만)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-files',
  'audio-files',
  true,
  20971520,
  ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. Storage RLS 정책 - artist-images
-- ============================================

CREATE POLICY "Artist images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artist-images');

CREATE POLICY "Admins can upload artist images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'artist-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can update artist images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'artist-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can delete artist images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'artist-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

-- ============================================
-- 8. Storage RLS 정책 - song-images
-- ============================================

CREATE POLICY "Song images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'song-images');

CREATE POLICY "Admins can upload song images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'song-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can update song images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'song-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can delete song images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'song-images' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

-- ============================================
-- 9. Storage RLS 정책 - audio-files
-- ============================================

CREATE POLICY "Audio files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio-files');

CREATE POLICY "Admins can upload audio files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio-files' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can update audio files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'audio-files' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

CREATE POLICY "Admins can delete audio files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'audio-files' AND
    COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean,
      false
    ) = true
  );

-- ============================================
-- 완료!
-- ============================================
