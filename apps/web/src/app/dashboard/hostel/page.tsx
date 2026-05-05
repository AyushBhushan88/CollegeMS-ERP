'use client';

import { Home, Bed, UserCheck, AlertTriangle, Loader2, Plus, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { hostelService } from '@/services/hostel-service';
import { useToast } from '@/hooks/use-toast';

export default function HostelDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentAllocations, setRecentAllocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, allocationsData] = await Promise.all([
          hostelService.getStats(),
          hostelService.getRecentAllocations(),
        ]);
        setStats(statsData);
        setRecentAllocations(allocationsData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch hostel data',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const occupancyRate =
    stats?.totalRooms > 0
      ? ((stats.totalAllocations / (stats.totalAllocations + stats.availableBeds)) * 100).toFixed(1)
      : '0';

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOSTEL_WARDEN', 'STUDENT']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hostel Management</h1>
            <p className="text-muted-foreground">Room inventory and allocation management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Hostel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Allocate Room</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
              <Home className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalHostels || 0}</div>
              <p className="text-xs text-muted-foreground">Active buildings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
              <Bed className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.availableBeds || 0}</div>
              <p className="text-xs text-muted-foreground">Ready for allocation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalAllocations || 0} students housed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRooms || 0}</div>
              <p className="text-xs text-muted-foreground">Across all blocks</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAllocations.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No recent allocations
                  </p>
                ) : (
                  recentAllocations.map((alloc: any) => (
                    <div
                      key={alloc.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {alloc.student.user.firstName[0]}
                          {alloc.student.user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {alloc.student.user.firstName} {alloc.student.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Room {alloc.room.roomNumber} | {alloc.room.hostel.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">
                          {new Date(alloc.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{alloc.room.type}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Maintenance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center py-8">
                <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                <p className="text-sm font-medium">No active maintenance alerts</p>
                <p className="text-xs text-muted-foreground">All rooms are in good standing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
