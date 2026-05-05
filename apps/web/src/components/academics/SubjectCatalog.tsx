'use client';

import { UserRole } from '@campuscore/shared-constants';
import { Subject } from '@campuscore/shared-types';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { academicService } from '@/services/academic-service';

export function SubjectCatalog() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: 3,
    branchId: '',
    semester: 1,
    type: 'THEORY',
  });

  const canEdit = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.COLLEGE_ADMIN;

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const data = await academicService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subjects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicService.createSubject(newSubject);
      toast({
        title: 'Success',
        description: 'Subject added successfully',
      });
      setNewSubject({
        name: '',
        code: '',
        credits: 3,
        branchId: '',
        semester: 1,
        type: 'THEORY',
      });
      fetchSubjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add subject',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Loading subjects...</div>;

  return (
    <div className="space-y-6">
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubject} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Name</label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g. Data Structures"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Code</label>
                <Input
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="e.g. CS101"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Credits</label>
                <Input
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Input
                  type="number"
                  value={newSubject.semester}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, semester: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <Button type="submit" className="col-span-2">
                Add Subject
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{subject.code}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p>Credits: {subject.credits}</p>
                <p>Semester: {subject.semester}</p>
                <p>Type: {subject.type}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
