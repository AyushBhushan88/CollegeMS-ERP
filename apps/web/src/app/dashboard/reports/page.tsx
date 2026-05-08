'use client';

import { BarChart3, PieChart, Download, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { reportService } from '@/services/report-service';
import { useToast } from '@/hooks/use-toast';

export default function ReportsDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [academicData, setAcademicData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (type: string, format: string) => {
    setDownloadingType(`${type}-${format}`);
    try {
      // Simulate report generation and download
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: 'Success',
        description: `${type} report in ${format} format has been generated and downloaded.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to download ${type} report`,
      });
    } finally {
      setDownloadingType(null);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumData, acData, attData] = await Promise.all([
          reportService.getExecutiveSummary(),
          reportService.getAcademicPerformance(),
          reportService.getAttendanceTrends(),
        ]);
        setSummary(sumData);
        setAcademicData(acData);
        setAttendanceData(attData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch executive reports',
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
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'MANAGEMENT']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Executive Reports</h1>
            <p className="text-muted-foreground">Performance analytics and compliance documents</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleDownload('NAAC', 'PDF')} disabled={!!downloadingType}>
              {downloadingType === 'NAAC-PDF' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />} NAAC Report
            </Button>
            <Button variant="outline" onClick={() => handleDownload('NIRF', 'EXCEL')} disabled={!!downloadingType}>
              {downloadingType === 'NIRF-EXCEL' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />} NIRF Data
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.studentCount || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg CGPA</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {academicData?.averageCgpa?.toFixed(2) || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Institutional average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary?.placementPercentage?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> {summary?.totalOffers || 0} offers generated
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.activeDrives || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Open for application</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Semester-wise SGPA Average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-4">
                {academicData?.semesterWise?.length > 0 ? (
                  academicData.semesterWise.map((sem: any) => (
                    <div key={sem.semester} className="flex items-center justify-between">
                      <span className="text-sm font-medium">Semester {sem.semester}</span>
                      <div className="flex items-center space-x-4 flex-1 ml-8">
                        <div className="h-2 bg-blue-100 rounded-full flex-1 overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${(sem._avg.sgpa / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold w-12 text-right">
                          {sem._avg.sgpa.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-8">
                    No academic data available
                  </p>
                )}
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
                  { name: 'Annual Quality Assurance Report (AQAR)', date: 'Oct 2024 Cycle' },
                  { name: 'NAAC Self Study Report (SSR)', date: 'In Preparation' },
                  { name: 'NIRF Data Capturing System', date: 'Fall 2024' },
                  { name: 'Faculty Workload Analysis', date: 'Generated Oct 05, 2024' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
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
