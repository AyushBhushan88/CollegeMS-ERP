import { Bell, User, LogOut } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

export function Header() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <div className="flex items-center space-x-2 border-l pl-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">John Doe</span>
            <span className="text-xs text-gray-500">Student</span>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
