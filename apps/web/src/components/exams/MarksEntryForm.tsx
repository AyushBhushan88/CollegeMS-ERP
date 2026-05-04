'use client';

import { Exam, MarksEntry } from '@campuscore/shared-types';
import { Loader2, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

export function MarksEntryForm() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [isAbsent, setIsAbsent] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedSectionId && selectedExamId && selectedSubjectId) {
      fetchStudentsAndExistingMarks();
    }
  }, [selectedSectionId, selectedExamId, selectedSubjectId]);

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

  const fetchStudentsAndExistingMarks = async () => {
    try {
      setIsFetchingStudents(true);
      // Fetch students in section
      const studentsRes = await apiClient.get(`/academic/sections/${selectedSectionId}/students`);
      setStudents(studentsRes.data);

      // Fetch existing marks if any
      const marksRes = await apiClient.get(
        `/examination/marks?examId=${selectedExamId}&subjectId=${selectedSubjectId}&sectionId=${selectedSectionId}`,
      );

      const marksMap: Record<string, number> = {};
      const absentMap: Record<string, boolean> = {};

      marksRes.data.forEach((entry: MarksEntry) => {
        marksMap[entry.studentId] = entry.marksObtained;
        absentMap[entry.studentId] = entry.isAbsent;
      });

      setMarks(marksMap);
      setIsAbsent(absentMap);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load student data',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingStudents(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const marksData = students.map((student) => ({
        studentId: student.id,
        examId: selectedExamId,
        subjectId: selectedSubjectId,
        marksObtained: marks[student.id] || 0,
        isAbsent: isAbsent[student.id] || false,
      }));

      await apiClient.post('/examination/marks/bulk', { marks: marksData });
      toast({
        title: 'Success',
        description: 'Marks updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save marks',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Exam & Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
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
            {/* Subject and Section selectors would typically be populated based on faculty's assigned subjects */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject ID</label>
              <Input
                placeholder="Enter Subject ID"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section ID</label>
              <Input
                placeholder="Enter Section ID"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isFetchingStudents ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : students.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left">Roll No</th>
                    <th className="p-3 text-left">Student Name</th>
                    <th className="p-3 text-left">Marks Obtained</th>
                    <th className="p-3 text-center">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="p-3">{student.rollNumber}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          className="w-24"
                          disabled={isAbsent[student.id]}
                          value={marks[student.id] || ''}
                          onChange={(e) =>
                            setMarks({ ...marks, [student.id]: parseFloat(e.target.value) })
                          }
                        />
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isAbsent[student.id] || false}
                          onChange={(e) =>
                            setIsAbsent({ ...isAbsent, [student.id]: e.target.checked })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Marks
            </Button>
          </div>
        </form>
      ) : (
        selectedSectionId && (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            No students found in this section.
          </div>
        )
      )}
    </div>
  );
}
