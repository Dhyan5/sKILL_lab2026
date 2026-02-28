// app/page.tsx — Root redirect based on auth state
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      router.replace(parsed.role === 'admin' ? '/dashboard/admin' : '/dashboard/student');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <Loader show />;
}
