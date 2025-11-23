# 관리자 계정 생성 가이드

Vibe Stream 프로젝트의 관리자 계정을 생성하는 방법입니다.

## ⚠️ 중요
이 작업은 Supabase 대시보드에서 **수동으로** 진행해야 합니다.

---

## 1단계: Supabase 대시보드 접속

1. [https://supabase.com](https://supabase.com) 접속
2. `vibe-stream` 프로젝트 선택

---

## 2단계: 관리자 사용자 생성

### 2.1 Authentication 페이지 이동
1. 왼쪽 사이드바에서 **Authentication** 클릭
2. **Users** 탭으로 이동

### 2.2 새 사용자 추가
1. **Add user** 버튼 클릭
2. **Create new user** 선택
3. 다음 정보 입력:

```
Email: admin@vibestream.com (또는 원하는 이메일)
Password: [강력한 비밀번호 입력]
Auto Confirm User: ✅ 체크
```

4. **Create user** 버튼 클릭

---

## 3단계: 관리자 권한 부여

### 3.1 사용자 상세 페이지 열기
1. 방금 생성한 사용자를 목록에서 찾기
2. 사용자 행을 클릭하여 상세 페이지 열기

### 3.2 User Metadata 편집
1. **User Metadata** 섹션 찾기 (페이지 중간쯤)
2. **Raw User Meta Data** 옆의 편집 아이콘 (연필 모양) 클릭
3. 다음 JSON 입력:

```json
{
  "is_admin": true
}
```

4. **Save** 버튼 클릭

---

## 4단계: 관리자 계정 정보 저장

생성한 계정 정보를 안전한 곳에 보관하세요:

```
이메일: admin@vibestream.com
비밀번호: [설정한 비밀번호]
```

⚠️ **보안 주의사항**:
- 비밀번호는 최소 12자 이상 권장
- 대소문자, 숫자, 특수문자 조합 사용
- 비밀번호 관리자 사용 권장

---

## 5단계: 로그인 테스트

### 5.1 개발 서버 실행
```bash
npm run dev
```

### 5.2 관리자 페이지 접속
1. 브라우저에서 `http://localhost:5173/admin/login` 접속
2. 생성한 이메일과 비밀번호로 로그인
3. 로그인 성공 시 관리자 대시보드(`/admin`)로 자동 리다이렉트

### 5.3 권한 확인
- **Artists** 탭: "Add Artist" 버튼이 보여야 함
- **Songs** 탭: "Add Song" 버튼이 보여야 함

---

## 트러블슈팅

### 문제: 로그인 실패
**원인**: 이메일 또는 비밀번호 오류

**해결**:
1. Supabase 대시보드 → Authentication → Users에서 이메일 확인
2. 비밀번호 재설정:
   - 사용자 클릭 → **Reset Password** → 새 비밀번호 입력

### 문제: 로그인은 되지만 관리자 기능 사용 불가
**원인**: User Metadata에 `is_admin: true`가 설정되지 않음

**해결**:
1. Supabase 대시보드 → Authentication → Users
2. 해당 사용자 클릭
3. **Raw User Meta Data** 확인:
```json
{
  "is_admin": true
}
```
4. 없거나 false라면 위 JSON으로 수정 후 저장
5. 브라우저에서 로그아웃 후 재로그인

### 문제: "Auto Confirm User" 체크 안 함
**원인**: 이메일 인증이 필요한 상태

**해결**:
1. Supabase 대시보드 → Authentication → Users
2. 해당 사용자 클릭
3. **Confirm email** 버튼 클릭

---

## 완료!

관리자 계정 설정이 완료되었습니다. 이제 다음 작업으로 진행할 수 있습니다:

- ✅ 작업 1: Supabase 프로젝트 및 환경 설정 완료
- 🔜 작업 6.1: 아티스트 이미지 업로드 기능 구현
- 🔜 작업 7.1: 곡 이미지 및 음성 파일 업로드 기능 구현
