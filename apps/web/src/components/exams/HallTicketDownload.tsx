'use client';

import { Exam } from '@campuscore/shared-types';
import { Loader2, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

interface Eligibility {
  attendancePercentage: number;
  feesPaid: boolean;
  isEligible: boolean;
  reasons: string[];
}

export function HallTicketDownload() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedExamId) {
      checkEligibility(selectedExamId);
    } else {
      setEligibility(null);
    }
  }, [selectedExamId]);

  const fetchExams = async () => {
    try {
      const response = await apiClient.get('/examination/exams');
      setExams(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load exams',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkEligibility = async (examId: string) => {
    try {
      setIsChecking(true);
      const response = await apiClient.get(`/examination/hall-ticket/eligibility?examId=${examId}`);
      setEligibility(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check eligibility',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownload = async () => {
    try {
      toast({
        title: 'Processing',
        description: 'Generating your hall ticket...',
      });
      // In a real app, this would be a blob download
      const response = await apiClient.get(
        `/examination/hall-ticket/download?examId=${selectedExamId}`,
        {
          responseType: 'blob',
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `hall-ticket-${selectedExamId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download hall ticket',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Download Hall Ticket</CardTitle>
          <CardDescription>
            Select an exam to check eligibility and download your hall ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Exam</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            {isChecking && (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {eligibility && (
              <div
                className={`p-4 rounded-lg border ${eligibility.isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
              >
                <div className="flex items-start gap-3">
                  {eligibility.isEligible ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p
                      className={`font-medium ${eligibility.isEligible ? 'text-green-800' : 'text-red-800'}`}
                    >
                      {eligibility.isEligible
                        ? 'You are eligible for this exam.'
                        : 'Eligibility Criteria Not Met'}
                    </p>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Attendance: {eligibility.attendancePercentage}% (Required: 75%)
                      </p>
                      <p className="text-muted-foreground">
                        Fee Status: {eligibility.feesPaid ? 'Paid' : 'Pending'}
                      </p>
                      {!eligibility.isEligible && (
                        <ul className="list-disc list-inside mt-2 text-red-700">
                          {eligibility.reasons.map((reason, i) => (
                            <li key={i}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full" disabled={!eligibility?.isEligible} onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Hall Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
