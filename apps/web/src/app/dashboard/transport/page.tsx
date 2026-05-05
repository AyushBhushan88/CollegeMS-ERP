'use client';

import { Bus, Map, Navigation, Users, Loader2, Plus } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { transportService } from '@/services/transport-service';
import { useToast } from '@/hooks/use-toast';

export default function TransportDashboard() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [routesData, statsData] = await Promise.all([
          transportService.getRoutes(),
          transportService.getStats(),
        ]);
        setRoutes(routesData);
        setStats(statsData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch transport data',
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute
      allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'STUDENT', 'FACULTY']}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
            <p className="text-muted-foreground">
              Route viewer, vehicle tracking, and subscriptions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Subscribe to Transport</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Route
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Bus className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVehicles || 0}</div>
              <p className="text-xs text-muted-foreground">Active in fleet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Map className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRoutes || 0}</div>
              <p className="text-xs text-muted-foreground">City-wide coverage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Subscribed Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAllocations || 0}</div>
              <p className="text-xs text-muted-foreground">Students & Staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
              <Navigation className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.availableSeats || 0}</div>
              <p className="text-xs text-muted-foreground">Ready for subscription</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Route Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {routes.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No routes defined
                  </p>
                ) : (
                  routes.map((route: any) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <Navigation className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{route.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {route.source} to {route.destination} • {route.stops.length} stops
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                          {route._count.allocations} Active
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Fleet Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center py-8">
                <Bus className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Manage your campus fleet</p>
                <p className="text-xs text-muted-foreground">
                  Track fuel, maintenance, and driver details
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  View Full Fleet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
