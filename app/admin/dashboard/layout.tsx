'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Client-side auth check
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/admin');
    }
  }, [router]);

  return <>{children}</>;
}
