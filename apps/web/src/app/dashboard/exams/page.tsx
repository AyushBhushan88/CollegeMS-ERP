'use client';

import { UserRole } from '@campuscore/shared-constants';
import React from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ExamScheduleList } from '@/components/exams/ExamScheduleList';
import { HallTicketDownload } from '@/components/exams/HallTicketDownload';
import { MarksEntryForm } from '@/components/exams/MarksEntryForm';
import { TranscriptViewer } from '@/components/exams/TranscriptViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

export default function ExamsPage() {
  const { user } = useAuth();

  const isFacultyOrAdmin =
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.COLLEGE_ADMIN ||
    user?.role === UserRole.HOD ||
    user?.role === UserRole.FACULTY ||
    user?.role === UserRole.EXAM_CONTROLLER;

  const isStudent = user?.role === UserRole.STUDENT;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examination Management</h1>
          <p className="text-muted-foreground">
            {isFacultyOrAdmin
              ? 'Manage exam schedules and enter student marks.'
              : 'View your exam schedules and results.'}
          </p>
        </div>

        {isFacultyOrAdmin && (
          <Tabs defaultValue="schedule" className="space-y-4">
            <TabsList>
              <TabsTrigger value="schedule">Schedule Management</TabsTrigger>
              <TabsTrigger value="marks">Marks Entry</TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="space-y-4">
              <ExamScheduleList />
            </TabsContent>
            <TabsContent value="marks" className="space-y-4">
              <MarksEntryForm />
            </TabsContent>
          </Tabs>
        )}

        {isStudent && (
          <Tabs defaultValue="my-schedule" className="space-y-4">
            <TabsList>
              <TabsTrigger value="my-schedule">My Schedule</TabsTrigger>
              <TabsTrigger value="hall-ticket">Hall Ticket</TabsTrigger>
              <TabsTrigger value="results">Results & Transcripts</TabsTrigger>
            </TabsList>
            <TabsContent value="my-schedule" className="space-y-4">
              <ExamScheduleList />
            </TabsContent>
            <TabsContent value="hall-ticket" className="space-y-4">
              <HallTicketDownload />
            </TabsContent>
            <TabsContent value="results" className="space-y-4">
              <TranscriptViewer />
            </TabsContent>
          </Tabs>
        )}

        {!isFacultyOrAdmin && !isStudent && (
          <div className="text-center p-12 border rounded-xl bg-muted/20">
            <p className="text-muted-foreground">
              You do not have permission to access examination management.
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
