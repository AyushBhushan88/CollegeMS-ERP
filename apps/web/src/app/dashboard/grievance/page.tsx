'use client';

import { LifeBuoy, Plus, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { grievanceService } from '@/services/grievance-service';
import { GrievanceList } from '@/components/grievance/GrievanceList';
import { useToast } from '@/hooks/use-toast';

export default function GrievancePage() {
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchGrievances() {
      try {
        const data = await grievanceService.getGrievances();
        setGrievances(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch grievances',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchGrievances();
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
            <h1 className="text-3xl font-bold tracking-tight">Grievance Redressal</h1>
            <p className="text-muted-foreground">Submit and track your concerns</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Grievance
          </Button>
        </div>

        <GrievanceList grievances={grievances} />
      </div>
    </ProtectedRoute>
  );
}
