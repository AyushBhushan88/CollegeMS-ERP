import {
  LayoutDashboard,
  FileText,
  User,
  CreditCard,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileSignature,
  Users,
  Library,
  Building,
  Bus,
  Briefcase,
  BarChart3,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Academics', href: '/dashboard/academics', icon: BookOpen, roles: ['STUDENT', 'FACULTY', 'HOD', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClipboardCheck, roles: ['STUDENT', 'FACULTY', 'HOD', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Exams', href: '/dashboard/exams', icon: FileSignature, roles: ['STUDENT', 'FACULTY', 'EXAM_CONTROLLER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  
  // Admin Sections
  { name: 'Admissions Admin', href: '/dashboard/admin/admissions', icon: UserCheck, roles: ['COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Student Management', href: '/dashboard/admin/students', icon: Users, roles: ['COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Academic Setup', href: '/dashboard/admin/academics', icon: ShieldCheck, roles: ['HOD', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },

  { name: 'HR', href: '/dashboard/hr', icon: Users, roles: ['HR_STAFF', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Library', href: '/dashboard/library', icon: Library, roles: ['STUDENT', 'FACULTY', 'LIBRARIAN', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Hostel', href: '/dashboard/hostel', icon: Building, roles: ['STUDENT', 'HOSTEL_WARDEN', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Transport', href: '/dashboard/transport', icon: Bus, roles: ['STUDENT', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Placement', href: '/dashboard/placement', icon: Briefcase, roles: ['STUDENT', 'PLACEMENT_OFFICER', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['COLLEGE_ADMIN', 'SUPER_ADMIN', 'MANAGEMENT'] },
  { name: 'Alumni', href: '/dashboard/alumni', icon: GraduationCap },
  { name: 'Grievance', href: '/dashboard/grievance', icon: FileText },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText, roles: ['STUDENT'] },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, roles: ['STUDENT', 'FINANCE_STAFF', 'COLLEGE_ADMIN', 'SUPER_ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <GraduationCap className="h-8 w-8 text-blue-500" />
        <span className="ml-3 text-xl font-bold">CampusCore</span>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {filteredItems.map((item) => {
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
