'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 상태 객체의 타입을 명확하게 정의합니다.
interface ActionState {
  message: string;
}

export async function addPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  let supabase;
  try {
    // Supabase 클라이언트 생성부터 오류 처리 시작
    supabase = await createClient();

    const text = formData.get('text');
    const title = formData.get('title');

    // 간단한 유효성 검사
    if (!title || !text) {
      return { message: '제목과 내용은 비워둘 수 없습니다.' };
    }

    // 데이터 삽입 시도
    const { error } = await supabase
      .from('posts')
      .insert({ content: text as string, title: title as string })
      .select(); // 오류 발생 시 더 자세한 정보를 얻기 위해 .select() 추가

    // Supabase가 반환한 명시적 오류 처리
    if (error) {
      console.error('Supabase insert error:', error);
      // 클라이언트에게 구체적인 Supabase 오류 메시지 반환
      return { message: `데이터 저장 실패: ${error.message}` };
    }

    revalidatePath('/');
    return { message: '게시글이 성공적으로 저장되었습니다.' };

  } catch (e) {
    // try 블록 내에서 발생한 모든 예외(네트워크, 인증 등)를 여기서 처리
    const errorMessage = e instanceof Error ? e.message : '알 수 없는 서버 오류가 발생했습니다.';
    console.error('Unexpected error in addPost action:', errorMessage);
    // 클라이언트에게 예외 메시지 반환
    return { message: `치명적인 오류 발생: ${errorMessage}` };
  }
}

// getPosts 함수를 actions 파일로 이동
export async function getPosts() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
        
        if (error) {
            console.error('Error fetching posts:', error);
            // 페이지 로딩이 실패하는 것을 막기 위해 빈 배열 반환
            return [];
        }
        return data;
    } catch (e) {
        console.error('Failed to get posts:', e);
        // 페이지 로딩이 실패하는 것을 막기 위해 빈 배열 반환
        return [];
    }
}
