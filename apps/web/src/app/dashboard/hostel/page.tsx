'use client';

import { Home, Bed, UserCheck, AlertTriangle } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HostelDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'WARDEN']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hostel Management</h1>
            <p className="text-muted-foreground">Room inventory and allocation management</p>
          </div>
          <Button>Allocate Room</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
              <Home className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 Boys, 2 Girls</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Bed className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,200</div>
              <p className="text-xs text-muted-foreground">Beds available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">980</div>
              <p className="text-xs text-muted-foreground">81.6% Occupancy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">5 high priority</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Room Inventory Grid (Block A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const roomNum = 101 + i;
                const isOccupied = i % 3 !== 0;
                return (
                  <div 
                    key={roomNum} 
                    className={`p-4 rounded-lg border text-center ${
                      isOccupied ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer'
                    }`}
                  >
                    <p className="font-semibold text-sm">A-{roomNum}</p>
                    <p className={`text-xs mt-1 ${isOccupied ? 'text-gray-500' : 'text-green-600'}`}>
                      {isOccupied ? 'Occupied' : 'Available'}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
