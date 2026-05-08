'use client';

import { Users, Search, GraduationCap, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useEffect, useState } from 'react';
import { alumniService } from '@/services/alumni-service';
import { AlumniDirectory } from '@/components/alumni/AlumniDirectory';
import { useToast } from '@/hooks/use-toast';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const data = await alumniService.getDirectory();
        setAlumni(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch alumni directory',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlumni();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
            <p className="text-muted-foreground">Connect with former students and mentors</p>
          </div>
          <GraduationCap className="h-10 w-10 text-blue-600" />
        </div>

        <AlumniDirectory alumni={alumni} />
      </div>
    </ProtectedRoute>
  );
}
