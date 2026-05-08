'use client';

import { ShieldCheck, Plus, Book, Layers, Loader2, Edit } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { academicService } from '@/services/academic-service';
import { useToast } from '@/hooks/use-toast';

export default function AcademicSetupPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAcademicData();
  }, []);

  async function fetchAcademicData() {
    try {
      // In a real implementation, we would have separate endpoints
      // For now, we fetch what's available
      const [progData, subjData, sectData] = await Promise.all([
        academicService.getPrograms(),
        academicService.getSubjects(),
        academicService.getSections(),
      ]);
      setPrograms(progData);
      setSubjects(subjData);
      setSections(sectData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch academic configuration',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateTimetable = async (sectionId: string) => {
    try {
      await academicService.generateTimetable(sectionId);
      toast({
        title: 'Success',
        description: 'Timetable generated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate timetable',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Configuration</h1>
            <p className="text-muted-foreground">Manage programs, curriculum, and sections</p>
          </div>
          <ShieldCheck className="h-10 w-10 text-blue-600" />
        </div>

        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="programs">Programs & Branches</TabsTrigger>
            <TabsTrigger value="subjects">Curriculum (Subjects)</TabsTrigger>
            <TabsTrigger value="sections">Sections & Batches</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 hover:bg-slate-50 cursor-pointer transition-colors">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <div className="font-semibold text-muted-foreground">Add New Program</div>
              </Card>
              {programs.map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{p.name}</CardTitle>
                      <Badge>{p.code}</Badge>
                    </div>
                    <CardDescription>{p.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">Branches: {p.branches?.length || 0}</div>
                    <Button variant="ghost" size="sm" className="mt-4 w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Subject</Button>
            </div>
            <div className="bg-white border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 text-sm font-mono">{s.code}</td>
                      <td className="px-6 py-4 text-sm font-medium">{s.name}</td>
                      <td className="px-6 py-4 text-sm">{s.credits}</td>
                      <td className="px-6 py-4 text-sm"><Badge variant="outline">{s.type}</Badge></td>
                      <td className="px-6 py-4 text-right text-sm">
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="mt-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sections.map((s) => (
                <Card key={s.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-blue-500" />
                      Section {s.name}
                    </CardTitle>
                    <CardDescription>{s.branch.code} - Sem {s.semester}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Batch</span>
                      <span className="font-bold">{s.batchYear}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Capacity</span>
                      <span>{s.capacity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button variant="outline" size="sm">View</Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleGenerateTimetable(s.id)}
                      >
                        Auto-Gen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
