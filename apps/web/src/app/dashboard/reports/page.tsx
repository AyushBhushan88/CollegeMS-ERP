'use client';

import { BarChart3, PieChart, Download, FileText, TrendingUp } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportsDashboard() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGEMENT']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Reports</h1>
            <p className="text-muted-foreground">Performance analytics and compliance documents</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> NAAC Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> NIRF Data
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +12% from last quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admissions</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground mt-1">For Fall 2024</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88.5%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +2.5% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Average GPA across departments</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed m-6">
              {/* Placeholder for actual chart component */}
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart3 className="h-10 w-10 mb-2 text-gray-400" />
                <p>Bar Chart Visualization</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>Generate and download official reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Annual Quality Assurance Report (AQAR)', date: 'Generated Oct 01, 2024' },
                  { name: 'Financial Audit Summary 2023-24', date: 'Generated Sep 15, 2024' },
                  { name: 'Faculty Workload Analysis', date: 'Generated Oct 05, 2024' },
                  { name: 'Infrastructure & Resource Utilization', date: 'Generated Sep 28, 2024' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
