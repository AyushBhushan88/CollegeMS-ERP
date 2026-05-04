'use client';

import { UserRole } from '@campuscore/shared-constants';
import { Section } from '@campuscore/shared-types';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

export function SectionManagement() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newSection, setNewSection] = useState({
    name: '',
    branchId: '',
    batchYear: new Date().getFullYear(),
    semester: 1,
    capacity: 60,
  });

  const canEdit =
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.COLLEGE_ADMIN ||
    user?.role === UserRole.HOD;

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/academic/sections');
      setSections(response.data);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sections',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/academic/sections', newSection);
      toast({
        title: 'Success',
        description: 'Section added successfully',
      });
      setNewSection({
        name: '',
        branchId: '',
        batchYear: new Date().getFullYear(),
        semester: 1,
        capacity: 60,
      });
      fetchSections();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add section',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Loading sections...</div>;

  return (
    <div className="space-y-6">
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Section</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSection} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Name</label>
                <Input
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="e.g. Section A"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch Year</label>
                <Input
                  type="number"
                  value={newSection.batchYear}
                  onChange={(e) =>
                    setNewSection({ ...newSection, batchYear: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Input
                  type="number"
                  value={newSection.semester}
                  onChange={(e) =>
                    setNewSection({ ...newSection, semester: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  value={newSection.capacity}
                  onChange={(e) =>
                    setNewSection({ ...newSection, capacity: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <Button type="submit" className="col-span-2">
                Add Section
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Batch: {section.batchYear}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p>Semester: {section.semester}</p>
                <p>Capacity: {section.capacity}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
