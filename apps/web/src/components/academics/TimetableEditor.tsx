'use client';

import { DayOfWeek, UserRole } from '@campuscore/shared-constants';
import { Section, Subject, TimetableSlot } from '@campuscore/shared-types';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

const DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

export function TimetableEditor() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const [newSlot, setNewSlot] = useState({
    subjectId: '',
    facultyId: '',
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00',
    endTime: '10:00',
    roomNumber: '',
  });

  const canEdit =
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.COLLEGE_ADMIN ||
    user?.role === UserRole.HOD;

  useEffect(() => {
    fetchSections();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSectionId) {
      fetchTimetable(selectedSectionId);
    }
  }, [selectedSectionId]);

  const fetchSections = async () => {
    try {
      const response = await apiClient.get('/academic/sections');
      setSections(response.data);
      if (response.data.length > 0 && !selectedSectionId) {
        setSelectedSectionId(response.data[0].id);
      }
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

  const fetchTimetable = async (sectionId: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/academic/timetable/section/${sectionId}`);
      setSlots(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load timetable', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/academic/timetable', {
        ...newSlot,
        sectionId: selectedSectionId,
      });
      toast({ title: 'Success', description: 'Timetable slot added successfully' });
      setIsDialogOpen(false);
      fetchTimetable(selectedSectionId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add timetable slot',
        variant: 'destructive',
      });
    }
  };

  const getSlot = (day: DayOfWeek, time: string) => {
    // Simple matching by start time hour for the grid
    return slots.find((s) => s.dayOfWeek === day && s.startTime.startsWith(time.split(':')[0]));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Label className="whitespace-nowrap">Section:</Label>
          <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" /> Add Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Timetable Slot</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSlot} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={newSlot.subjectId}
                    onValueChange={(val) => setNewSlot({ ...newSlot, subjectId: val })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Faculty ID</Label>
                  <Input
                    value={newSlot.facultyId}
                    onChange={(e) => setNewSlot({ ...newSlot, facultyId: e.target.value })}
                    placeholder="Enter Faculty ID"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={newSlot.dayOfWeek}
                      onValueChange={(val: DayOfWeek) => setNewSlot({ ...newSlot, dayOfWeek: val })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Number</Label>
                    <Input
                      value={newSlot.roomNumber}
                      onChange={(e) => setNewSlot({ ...newSlot, roomNumber: e.target.value })}
                      placeholder="e.g. 101"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Save Slot
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">Loading timetable...</div>
          ) : !selectedSectionId ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground italic">
              Please select a section to view the timetable.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 w-24">Time</th>
                    {DAYS.map((day) => (
                      <th key={day} className="border p-2">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="border p-2 font-medium bg-muted/30 text-center">{time}</td>
                      {DAYS.map((day) => {
                        const slot = getSlot(day, time);
                        return (
                          <td key={`${day}-${time}`} className="border p-2 h-24 align-top">
                            {slot ? (
                              <div className="space-y-1 p-2 rounded bg-primary/5 border border-primary/20">
                                <p className="font-bold text-xs truncate">
                                  {(slot as any).subject?.name || 'Subject'}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  Room: {slot.roomNumber}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {(slot as any).faculty
                                    ? `${(slot as any).faculty.firstName} ${(slot as any).faculty.lastName}`
                                    : slot.facultyId}
                                </p>
                              </div>
                            ) : (
                              <div className="w-full h-full text-muted-foreground/10 flex items-center justify-center italic text-[10px]">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
