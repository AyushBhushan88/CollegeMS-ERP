'use client';

import { Briefcase, CheckCircle, Clock, Building, Loader2, Plus, Upload } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { placementService } from '@/services/placement-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function PlacementDashboard() {
  const [drives, setDrives] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const handleApply = async () => {
    if (!resumeUrl) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a resume URL',
      });
      return;
    }

    setIsApplying(true);
    try {
      await placementService.applyForDrive({ driveId: selectedDrive.id, resumeUrl });
      toast({
        title: 'Success',
        description: 'Application submitted successfully',
      });
      setSelectedDrive(null);
      setResumeUrl('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit application',
      });
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [drivesData, statsData] = await Promise.all([
          placementService.getDrives(),
          placementService.getStats(),
        ]);
        setDrives(drivesData);
        setStats(statsData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch placement data',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'STUDENT']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Placement Cell</h1>
            <p className="text-muted-foreground">Drive listings, eligibility, and applications</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Update Resume</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Post New Drive
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Drives</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDrives || 0}</div>
              <p className="text-xs text-muted-foreground">Active recruitment cycles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-muted-foreground">Students in process</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Offers Generated</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOffers || 0}</div>
              <p className="text-xs text-muted-foreground">Successful placements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Package</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5 LPA</div>
              <p className="text-xs text-muted-foreground">Across all sectors</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open Placement Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {drives.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No active drives found
                </p>
              ) : (
                drives.map((drive: any) => (
                  <div
                    key={drive.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{drive.companyName}</h3>
                        <p className="text-sm font-medium text-purple-600">Recruitment Drive</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Briefcase className="h-3 w-3 mr-1" /> {drive.packageDetails || 'TBD'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />{' '}
                            {new Date(drive.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" /> {drive._count.applications}{' '}
                            applied
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Dialog open={selectedDrive?.id === drive.id} onOpenChange={(open) => !open && setSelectedDrive(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => setSelectedDrive(drive)}
                          >
                            Apply Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Apply for {drive.companyName}</DialogTitle>
                            <DialogDescription>
                              Submit your resume to apply for this placement drive. Ensure you meet the eligibility criteria.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="resume" className="text-sm font-medium">Resume URL</label>
                              <Input
                                id="resume"
                                placeholder="https://drive.google.com/..."
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedDrive(null)}>Cancel</Button>
                            <Button onClick={handleApply} disabled={isApplying} className="bg-purple-600 hover:bg-purple-700">
                              {isApplying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                              Submit Application
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
