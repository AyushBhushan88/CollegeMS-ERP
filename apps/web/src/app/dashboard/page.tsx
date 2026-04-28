'use client';

import { FileText, GraduationCap, Clock, CheckCircle, AlertCircle } from 'lucide-react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: 'Active Applications',
    value: '2',
    description: '1 pending review',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Current Courses',
    value: '4',
    description: 'Fall Semester 2024',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Pending Fees',
    value: '$1,200',
    description: 'Due in 15 days',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'GPA',
    value: '3.8',
    description: "Dean's List",
    icon: CheckCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Manage your academic journey and track your applications.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Application for B.Tech CSE Updated
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Your application is now under review by the admissions committee.
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Semester Fee Payment</p>
                    <p className="text-sm text-muted-foreground">Due Oct 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-orange-500 mr-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Document Verification</p>
                    <p className="text-sm text-muted-foreground">Due Oct 20, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
