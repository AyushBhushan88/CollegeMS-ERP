'use client';

import { AttendanceStatus } from '@campuscore/shared-constants';
import { AttendanceRecord } from '@campuscore/shared-types';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { attendanceService } from '@/services/attendance-service';

export function StudentAttendanceView() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [recordsData, statsData] = await Promise.all([
        attendanceService.getStudentAttendance(user?.id!),
        attendanceService.getStudentStats(user?.id!),
      ]);
      setRecords(recordsData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load attendance data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const overallPercentage = stats?.overallPercentage || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <span className="text-3xl font-bold">{overallPercentage}%</span>
            </div>
            <Progress value={overallPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground">Required: 75% for exam eligibility</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subject-wise Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.subjects?.map((subject: any) => (
                <div key={subject.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{subject.name}</span>
                    <span className="font-medium">{subject.percentage}%</span>
                  </div>
                  <Progress value={subject.percentage} />
                </div>
              ))}
              {!stats?.subjects?.length && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  No subject-wise data available.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="p-3">{(record as any).subject?.name || 'Subject'}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === AttendanceStatus.PRESENT
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!records.length && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground italic">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
