'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 상태 객체의 타입을 명확하게 정의합니다.
interface ActionState {
  message: string;
}

export async function addPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const text = formData.get('text')
  const title = formData.get('title')

  // 간단한 유효성 검사
  if (!title || !text) {
    return { message: '제목과 내용은 비워둘 수 없습니다.' };
  }

  const { error } = await supabase.from('posts').insert({ content: text as string, title: title as string })
  
  if (error) {
    console.error('Error inserting post:', error) // 터미널에 전체 에러 출력
    return { message: `데이터 저장 실패: ${error.message}` } // 클라이언트에 전달할 에러 메시지
  }

  revalidatePath('/')
  return { message: '게시글이 성공적으로 저장되었습니다.' } // 성공 메시지
}

// getPosts 함수를 actions 파일로 이동
export async function getPosts() {
    const supabase = await createClient()
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    return data
}
