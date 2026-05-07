'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Grievance {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
}

export const GrievanceList = ({ grievances }: { grievances: Grievance[] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {grievances.map((g) => (
        <Card key={g.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {g.ticketNumber}
            </CardTitle>
            <Badge variant={g.status === 'RESOLVED' ? 'default' : 'destructive'}>
              {g.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{g.subject}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Filed on {new Date(g.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline">{g.priority} Priority</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
