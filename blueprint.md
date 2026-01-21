
# **게시판 애플리케이션 청사진**

## **개요**

Next.js (App Router)와 Supabase를 사용하여 구축된 간단한 게시판 애플리케이션입니다. 사용자는 게시글을 작성하고 전체 목록을 볼 수 있습니다.

## **스타일 및 디자인**

- **CSS 프레임워크:** Tailwind CSS
- **디자인:** 깔끔하고 모던한 인터페이스
- **레이아웃:**
    - 메인 페이지: 상단에 게시글 작성 폼, 하단에 게시글 목록 표시
    - 폼: 제목과 내용 입력 필드, 저장 버튼
    - 목록: 각 게시글의 제목과 작성 시간을 표시하는 카드 형태

## **기능**

- **게시글 작성:**
    - 사용자는 제목과 내용을 입력하여 새 게시글을 작성할 수 있습니다.
    - '저장' 버튼을 클릭하면 Server Action을 통해 데이터가 Supabase 데이터베이스에 저장됩니다.
    - 저장 시 현재 로그인된 사용자의 ID가 `author_id`로 자동 할당됩니다. (Supabase 인증 연동)
- **게시글 목록:**
    - 메인 페이지에 데이터베이스에 저장된 모든 게시글이 최신순으로 표시됩니다.
    - 각 게시글은 제목과 작성 시간을 포함합니다.

## **구현 계획**

1.  **`.env.local` 파일 생성:**
    -   Supabase 접속을 위한 환경 변수(URL, anon key)를 설정합니다.

2.  **Supabase 클라이언트 설정 (`lib/supabase/client.ts`):**
    -   브라우저 환경에서 사용할 Supabase 클라이언트를 초기화합니다.

3.  **메인 페이지 UI 수정 (`app/page.tsx`):**
    -   게시글 목록을 표시하는 Server Component를 구현합니다.
    -   게시글 작성을 위한 폼을 포함하는 Client Component를 구현합니다.

4.  **Server Action 구현 (`app/actions.ts`):**
    -   폼 데이터를 받아 Supabase `posts` 테이블에 저장하는 Server Action을 작성합니다.
    -   `revalidatePath`를 사용하여 데이터 저장 후 목록을 갱신합니다.

5.  **Tailwind CSS 플러그인 추가 (`tailwind.config.mjs`):**
    -   `@tailwindcss/forms` 플러그인을 추가하여 폼 스타일을 개선합니다.

