'use server'

import { cookies } from 'next/headers';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    path: '/',
    maxAge: 0,
  });
}
