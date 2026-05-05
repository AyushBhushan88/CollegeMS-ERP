'use client';

import { Users, Calendar, Clock, FileText, CheckCircle, XCircle, Loader2, Plus } from 'lucide-react';
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
import { hrService } from '@/services/hr-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function HRDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({ leaveType: 'SICK', startDate: '', endDate: '', reason: '' });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [empData, leaveData] = await Promise.all([
          hrService.getEmployees(),
          hrService.getLeaveRequests(),
        ]);
        setEmployees(empData);
        setLeaveRequests(leaveData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch HR data',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const handleLeaveStatus = async (id: string, status: string) => {
    try {
      await hrService.updateLeaveStatus(id, status);
      setLeaveRequests((prev) =>
        prev.map((req: any) => (req.id === id ? { ...req, status } : req)),
      );
      toast({
        title: 'Success',
        description: `Leave request ${status.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update leave status',
      });
    }
  };

  const handleApplyLeave = async () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill all required fields' });
      return;
    }
    setIsApplyingLeave(true);
    try {
      const employeeId = (user as any)?.employeeId || (employees.length > 0 ? employees[0].id : null);
      if (!employeeId) {
        throw new Error('Employee profile not linked to your user account.');
      }
      await hrService.applyLeave({
        employeeId,
        leaveType: newLeave.leaveType,
        startDate: new Date(newLeave.startDate).toISOString(),
        endDate: new Date(newLeave.endDate).toISOString(),
        reason: newLeave.reason,
      });
      toast({ title: 'Success', description: 'Leave application submitted!' });
      setIsDialogOpen(false);
      setNewLeave({ leaveType: 'SICK', startDate: '', endDate: '', reason: '' });
      // Refresh leave requests
      const updatedLeaveData = await hrService.getLeaveRequests();
      setLeaveRequests(updatedLeaveData);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Application Failed',
        description: error.message || error.response?.data?.message || 'Failed to apply for leave',
      });
    } finally {
      setIsApplyingLeave(false);
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
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HR_STAFF']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
            <p className="text-muted-foreground">Employee profiles and leave management</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Add New Employee</Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Apply Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>Submit your leave application for approval.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Leave Type</label>
                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newLeave.leaveType}
                      onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                    >
                      <option value="SICK">Sick Leave</option>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="EARNED">Earned Leave</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Input
                      placeholder="Brief reason for leave"
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleApplyLeave} disabled={isApplyingLeave} className="bg-blue-600 hover:bg-blue-700">
                    {isApplyingLeave && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Submit Application
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">Active staff members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequests.filter((r) => r.status === 'APPROVED').length}
              </div>
              <p className="text-xs text-muted-foreground">Current approved leaves</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequests.filter((r) => r.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No leave requests found
                  </p>
                ) : (
                  leaveRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {req.employee?.user?.firstName} {req.employee?.user?.lastName} (
                            {req.employee?.employeeCode})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {req.leaveType} - {new Date(req.startDate).toLocaleDateString()} to{' '}
                            {new Date(req.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleLeaveStatus(req.id, 'REJECTED')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleLeaveStatus(req.id, 'APPROVED')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                            req.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((emp: any) => (
                  <div key={emp.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {emp.user?.firstName?.[0]}
                        {emp.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {emp.user?.firstName} {emp.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {emp.designation} | {emp.department}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
