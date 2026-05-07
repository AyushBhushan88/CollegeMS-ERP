'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Alumnus {
  id: string;
  name: string;
  batch: number;
  company?: string;
  designation?: string;
  industry?: string;
}

export const AlumniDirectory = ({ alumni }: { alumni: Alumnus[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input placeholder="Search by name, company, or industry..." className="flex-1" />
        <Button>Filter</Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {alumni.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>{a.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Class of {a.batch}</p>
            </CardHeader>
            <CardContent>
              {a.company && (
                <div className="text-sm">
                  <span className="font-semibold">{a.designation}</span> at <span className="font-semibold">{a.company}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-blue-600">{a.industry}</div>
              <Button variant="outline" size="sm" className="mt-4 w-full">Connect</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
