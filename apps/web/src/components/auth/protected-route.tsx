'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute({ 
  children,
  allowedRoles
}: { 
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!isLoading && isAuthenticated && allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router, allowedRoles, user?.role]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
