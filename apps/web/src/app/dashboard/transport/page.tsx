'use client';

import { Bus, Map, Navigation, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TransportDashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
            <p className="text-muted-foreground">Route viewer, vehicle tracking, and subscriptions</p>
          </div>
          <Button>Subscribe to Transport</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Bus className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">18 Buses, 6 Vans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Map className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">Covering 45 stops</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">850</div>
              <p className="text-xs text-muted-foreground">Students & Staff</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Route Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { route: 'Route A1 - City Center', stops: 5, vehicle: 'Bus 01', status: 'In Transit' },
                  { route: 'Route B2 - North Campus', stops: 3, vehicle: 'Van 04', status: 'Arrived' },
                  { route: 'Route C3 - South Station', stops: 6, vehicle: 'Bus 05', status: 'Scheduled' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <Navigation className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.route}</p>
                        <p className="text-xs text-muted-foreground">{item.vehicle} • {item.stops} stops</p>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Arrived' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Route</span>
                  <span className="text-sm text-gray-600">Route A1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stop</span>
                  <span className="text-sm text-gray-600">Central Plaza</span>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">Track Vehicle</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
