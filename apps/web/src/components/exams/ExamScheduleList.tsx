'use client';

import { Exam, ExamSchedule } from '@campuscore/shared-types';
import { format } from 'date-fns';
import { Loader2, Calendar, Clock, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

export function ExamScheduleList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      fetchSchedules(selectedExamId);
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/examination/exams');
      setExams(response.data);
      if (response.data.length > 0) {
        setSelectedExamId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load exams',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async (examId: string) => {
    try {
      setIsLoadingSchedules(true);
      const response = await apiClient.get(`/examination/schedules/exam/${examId}`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load exam schedules',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {exams.map((exam) => (
          <Button
            key={exam.id}
            variant={selectedExamId === exam.id ? 'default' : 'outline'}
            onClick={() => setSelectedExamId(exam.id)}
            className="whitespace-nowrap"
          >
            {exam.name}
          </Button>
        ))}
      </div>

      {selectedExamId && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingSchedules ? (
            <div className="col-span-full flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : schedules.length > 0 ? (
            schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Subject Code</span> {/* Replace with real subject name if available */}
                    <span className="text-xs font-normal bg-muted px-2 py-1 rounded">
                      {schedule.roomNumber}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(schedule.date), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    Room: {schedule.roomNumber}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
              No schedules found for this exam.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
