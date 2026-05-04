'use client';

import { Briefcase, CheckCircle, Clock, Building } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PlacementDashboard() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Placement Cell</h1>
            <p className="text-muted-foreground">Drive listings, eligibility, and applications</p>
          </div>
          <Button variant="outline">Update Resume</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Drives</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">In the next 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">1 Under Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eligibility Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Eligible</div>
              <p className="text-xs text-muted-foreground">GPA: 3.8 | No Backlogs</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Placement Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { company: 'TechCorp Inc.', role: 'Software Engineer', ctc: '$80k - $100k', deadline: 'Oct 20, 2024', eligible: true, applied: false },
                { company: 'DataSystems', role: 'Data Analyst', ctc: '$75k - $90k', deadline: 'Oct 25, 2024', eligible: true, applied: true },
                { company: 'Innovate LLC', role: 'Frontend Developer', ctc: '$70k - $85k', deadline: 'Nov 02, 2024', eligible: false, applied: false },
              ].map((job, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{job.company}</h3>
                      <p className="text-sm font-medium text-blue-600">{job.role}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center"><Briefcase className="h-3 w-3 mr-1" /> {job.ctc}</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {job.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    {job.applied ? (
                      <Button variant="secondary" className="w-full bg-green-50 text-green-700 hover:bg-green-100" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" /> Applied
                      </Button>
                    ) : job.eligible ? (
                      <Button className="w-full">Apply Now</Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>Not Eligible</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
