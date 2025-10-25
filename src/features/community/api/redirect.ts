'use server';

import { revalidatePath } from 'next/cache';

export async function communityPageRevalid() {
  // ✅ 이 경로의 캐시 무효화 → 클라이언트에서 자동 갱신됨
  revalidatePath('/community');
}

export async function communityDetailPageRevalid({
  postId,
}: {
  postId: string;
}) {
  // ✅ 이 경로의 캐시 무효화 → 클라이언트에서 자동 갱신됨
  revalidatePath(`/community/${postId}`);
}
