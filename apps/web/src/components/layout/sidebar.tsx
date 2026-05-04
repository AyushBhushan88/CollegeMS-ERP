import {
  LayoutDashboard,
  FileText,
  User,
  CreditCard,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileSignature,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Academics', href: '/dashboard/academics', icon: BookOpen },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClipboardCheck },
  { name: 'Exams', href: '/dashboard/exams', icon: FileSignature },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <GraduationCap className="h-8 w-8 text-blue-500" />
        <span className="ml-3 text-xl font-bold">CampusCore</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',
              )}
            >
              <item.icon
                className={cn('mr-3 h-5 w-5', isActive ? 'text-blue-500' : 'text-slate-400')}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
