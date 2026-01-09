'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import ColorBand from '@/components/ColorBand';
import { getCurrentUser, clearAuth, isAuthenticated, isAdmin } from '@/lib/auth-client';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/admin');
      return;
    }

    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push('/admin');
      return;
    }

    // Check if user is admin
    if (!isAdmin()) {
      router.push('/admin');
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/admin');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Image
                src="/nbb-logo.png"
                alt="Nepal Bhumi Bank Limited Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                {user && (
                  <p className="text-xs text-white/80">{user.full_name || user.username}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-md transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Dashboard</h2>
          <ColorBand width="w-1/4" />
        </div>

        {/* Empty Dashboard Content */}
        <div className="bg-white border border-primary rounded-lg shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Welcome to Admin Dashboard
            </h3>
            <p className="text-gray-600">
              Dashboard content will be added here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
