'use client';

import { UserCheck, CheckCircle, XCircle, Clock, FileText, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { admissionService } from '@/services/admission-service';
import { useToast } from '@/hooks/use-toast';

export default function AdmissionsAdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const data = await admissionService.getAllApplications();
      setApplications(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch applications',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsProcessing(id);
    try {
      await admissionService.updateApplicationStatus(id, { status });
      toast({
        title: 'Status Updated',
        description: `Application is now ${status}`,
      });
      fetchApplications();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status',
      });
    } finally {
      setIsProcessing(null);
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
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admissions Administration</h1>
            <p className="text-muted-foreground">Review applications and manage merit lists</p>
          </div>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Generate Merit List
          </Button>
        </div>

        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold">{app.user.firstName} {app.user.lastName}</div>
                    <div className="text-sm text-muted-foreground">{app.program.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant={
                    app.status === 'ACCEPTED' ? 'default' : 
                    app.status === 'REJECTED' ? 'destructive' : 
                    'outline'
                  }>
                    {app.status}
                  </Badge>

                  {app.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                        disabled={!!isProcessing}
                      >
                        {isProcessing === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        disabled={!!isProcessing}
                      >
                        {isProcessing === app.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-slate-50">
              No applications found
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
