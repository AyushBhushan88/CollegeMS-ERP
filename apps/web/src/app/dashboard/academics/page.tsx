'use client';

import { SectionManagement } from '@/components/academics/SectionManagement';
import { SubjectCatalog } from '@/components/academics/SubjectCatalog';
import { TimetableEditor } from '@/components/academics/TimetableEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AcademicsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
        <p className="text-muted-foreground">
          Manage your institution's subjects, sections, and timetables.
        </p>
      </div>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="subjects" className="space-y-4">
          <SubjectCatalog />
        </TabsContent>
        <TabsContent value="sections" className="space-y-4">
          <SectionManagement />
        </TabsContent>
        <TabsContent value="timetable" className="space-y-4">
          <TimetableEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
