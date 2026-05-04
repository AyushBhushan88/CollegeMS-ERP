'use client';

import { AttendanceStatus } from '@campuscore/shared-constants';
import { Section, Subject, Student } from '@campuscore/shared-types';
import { Check, X, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

export function AttendanceMarker() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSectionId) {
      fetchStudents(selectedSectionId);
    }
  }, [selectedSectionId]);

  const fetchSections = async () => {
    try {
      const response = await apiClient.get('/academic/sections');
      setSections(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load sections', variant: 'destructive' });
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiClient.get('/academic/subjects');
      setSubjects(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load subjects', variant: 'destructive' });
    }
  };

  const fetchStudents = async (sectionId: string) => {
    try {
      setIsLoading(true);
      // Assuming students can be fetched by sectionId from academic or student service
      const response = await apiClient.get(`/student/section/${sectionId}`);
      setStudents(response.data);

      // Initialize all as Present
      const initialAttendance: Record<string, AttendanceStatus> = {};
      response.data.forEach((student: Student) => {
        initialAttendance[student.id] = AttendanceStatus.PRESENT;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load students', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]:
        prev[studentId] === AttendanceStatus.PRESENT
          ? AttendanceStatus.ABSENT
          : AttendanceStatus.PRESENT,
    }));
  };

  const handleSave = async () => {
    if (!selectedSectionId || !selectedSubjectId || !date) {
      toast({
        title: 'Validation Error',
        description: 'Please select section, subject and date',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const records = students.map((student) => ({
        studentId: student.id,
        subjectId: selectedSubjectId,
        sectionId: selectedSectionId,
        date: new Date(date),
        status: attendance[student.id],
      }));

      await apiClient.post('/attendance/bulk', { records });
      toast({ title: 'Success', description: 'Attendance marked successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save attendance',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSectionId && (
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">Roll No</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-t">
                          <td className="p-3">{student.rollNumber || 'N/A'}</td>
                          <td className="p-3">
                            {(student as any).user?.name || student.enrollmentNumber}
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant={
                                attendance[student.id] === AttendanceStatus.PRESENT
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              className="w-24"
                              onClick={() => toggleAttendance(student.id)}
                            >
                              {attendance[student.id] === AttendanceStatus.PRESENT ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" /> Present
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-1" /> Absent
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Attendance
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
