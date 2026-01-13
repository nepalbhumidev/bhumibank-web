'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  LayoutDashboard,
  Images, 
  Video, 
  FileText, 
  BookOpen, 
  PanelLeftClose, 
  PanelLeftOpen,
  LogOut
} from 'lucide-react';
import { clearAuth } from '@/lib/auth-client';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { name: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Notices', href: '/admin/dashboard/notices', icon: <FileText className="w-5 h-5" /> },
  { name: 'Publications', href: '/admin/dashboard/publications', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Media', href: '/admin/dashboard/media', icon: <ImageIcon className="w-5 h-5" /> },
  { name: 'Videos', href: '/admin/dashboard/videos', icon: <Video className="w-5 h-5" /> },
  { name: 'Gallery', href: '/admin/dashboard/gallery', icon: <Images className="w-5 h-5" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // useEffect(() => {
  //   // Client-side auth check
  //   if (!isAuthenticated() || !isAdmin()) {
  //     router.push('/admin');
  //   }
  // }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/admin');
    router.refresh();
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } flex flex-col fixed h-screen`}
      >
        {/* Logo/Brand Section */}
        <div className={`${sidebarCollapsed ? 'px-0 py-4' : 'p-4'} border-b border-gray-200`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="flex-shrink-0">
              <Image
                src="/nbb-logo.svg"
                alt="Nepal Bhumi Bank Limited Logo"
                width={32}
                height={32}
                className="w-10 h-10 object-contain"
              />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-primary font-bold text-sm">Nepal Bhumi Bank</h2>
                <p className="text-xs text-gray-500">CMS Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${
                  sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                } py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className= "p-2 border-t border-gray-200 space-y-1">
        <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center ${
              sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-colors`}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-400" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-400" />
            )}
            {!sidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
            } py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 w-full transition-colors`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
