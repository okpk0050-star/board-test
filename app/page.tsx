'use client'

import { addPost, getPosts } from './actions'
// 1. useFormState 대신 useActionState를 react에서 직접 import 합니다.
import { useActionState, useEffect, useState, useRef } from 'react'

const initialState = {
  message: ''
}

export default function Page() {
  // 2. 훅 이름을 useActionState로 변경합니다.
  const [state, formAction] = useActionState(addPost, initialState)
  const [posts, setPosts] = useState<any[]>([])
  const formRef = useRef<HTMLFormElement>(null) // 폼 리셋을 위한 ref

  // 컴포넌트가 처음 로드될 때 게시글 목록을 불러옵니다.
  useEffect(() => {
    getPosts().then((newPosts) => {
      if(newPosts) setPosts(newPosts)
    });
  }, [])

  // 폼 액션의 결과(state)가 변경될 때마다 실행될 부수 효과를 처리합니다.
  useEffect(() => {
    // 3. 옵셔널 체이닝(?.)을 사용하여 state와 message 속성의 존재를 안전하게 확인합니다.
    if (state?.message === '게시글이 성공적으로 저장되었습니다.') {
      // 글 목록을 새로고침합니다.
      getPosts().then((newPosts) => {
        if(newPosts) setPosts(newPosts)
      });
      // 폼을 리셋합니다.
      formRef.current?.reset();
    }
  }, [state])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">새 글 작성</h2>
          {/* 폼에 ref를 연결합니다. */}
          <form action={formAction} ref={formRef}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700">내용</label>
              <textarea
                name="text"
                id="text"
                rows={4}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              저장
            </button>
          </form>
          {/* 4. alert() 대신 상태 메시지를 UI에 직접 표시합니다. */}
          {state?.message && (
              <p className={`mt-4 text-sm ${state.message.includes('실패') ? 'text-red-600' : 'text-green-600'}`}>
                {state.message}
              </p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">글 목록</h2>
          <div className="space-y-4">
            {posts?.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.content}</p>
                <p className="text-sm text-gray-400 mt-4">{new Date(post.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
