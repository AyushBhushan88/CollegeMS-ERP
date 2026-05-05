'use client';

import {
  Book,
  Search,
  BookOpen,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
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
import { libraryService } from '@/services/library-service';
import { useToast } from '@/hooks/use-toast';

export default function LibraryDashboard() {
  const [books, setBooks] = useState<any[]>([]);
  const [recentIssues, setRecentIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'ISSUE' | 'RETURN'>('ISSUE');
  const [formData, setFormData] = useState({ accessionNumber: '', studentId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchLibraryData = async () => {
    try {
      const [booksData, issuesData] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getRecentIssues(),
      ]);
      setBooks(booksData);
      setRecentIssues(issuesData);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch library data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, [toast]);

  const handleSubmit = async () => {
    if (!formData.accessionNumber) {
      toast({ variant: 'destructive', title: 'Error', description: 'Accession number is required' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (actionType === 'ISSUE') {
        if (!formData.studentId) {
          toast({ variant: 'destructive', title: 'Error', description: 'Student ID is required for issuing' });
          return;
        }
        await libraryService.issueBook({
          accessionNumber: formData.accessionNumber,
          studentId: formData.studentId,
        });
        toast({ title: 'Success', description: 'Book issued successfully!' });
      } else {
        await libraryService.returnBook(formData.accessionNumber);
        toast({ title: 'Success', description: 'Book returned successfully!' });
      }
      setIsDialogOpen(false);
      setFormData({ accessionNumber: '', studentId: '' });
      await fetchLibraryData();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.response?.data?.message || `Failed to ${actionType.toLowerCase()} book`,
      });
    } finally {
      setIsSubmitting(false);
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
    <ProtectedRoute
      allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'LIBRARIAN', 'STUDENT', 'FACULTY']}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
            <p className="text-muted-foreground">
              Book catalog, issue/return, and member dashboard
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button variant="outline" className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Issue/Return</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Issue or Return Book</DialogTitle>
                  <DialogDescription>Process a book transaction by accession number.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant={actionType === 'ISSUE' ? 'default' : 'outline'} 
                      onClick={() => setActionType('ISSUE')}
                      className={actionType === 'ISSUE' ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      Issue Book
                    </Button>
                    <Button 
                      variant={actionType === 'RETURN' ? 'default' : 'outline'} 
                      onClick={() => setActionType('RETURN')}
                      className={actionType === 'RETURN' ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      Return Book
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Accession Number</label>
                    <Input
                      placeholder="e.g., BK-1234"
                      value={formData.accessionNumber}
                      onChange={(e) => setFormData({ ...formData, accessionNumber: e.target.value })}
                    />
                  </div>
                  {actionType === 'ISSUE' && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Student ID</label>
                      <Input
                        placeholder="e.g., student-uuid"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Confirm {actionType === 'ISSUE' ? 'Issue' : 'Return'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <Book className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-xs text-muted-foreground">Unique titles in catalog</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentIssues.filter((i) => !i.returnDate).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently borrowed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue Returns</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  recentIssues.filter((i) => !i.returnDate && new Date(i.dueDate) < new Date())
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground">Fines accumulating</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Issue/Return Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No recent activity
                  </p>
                ) : (
                  recentIssues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${issue.returnDate ? 'bg-green-100' : 'bg-blue-100'}`}
                        >
                          {issue.returnDate ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${issue.returnDate ? 'text-green-600' : 'text-blue-600'}`}
                            />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{issue.bookCopy?.book?.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {issue.returnDate ? 'Returned by' : 'Issued to'}{' '}
                            {issue.student
                              ? `${issue.student.user.firstName} ${issue.student.user.lastName}`
                              : `${issue.employee.user.firstName} ${issue.employee.user.lastName}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">
                          {new Date(issue.issueDate).toLocaleDateString()}
                        </p>
                        {issue.fineAmount > 0 && (
                          <p className="text-xs text-red-600 font-bold">
                            Fine: ${issue.fineAmount}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Catalog Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {books.slice(0, 5).map((book: any) => (
                  <div key={book.id} className="flex items-start space-x-3">
                    <Book className="h-4 w-4 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {book.author} | {book.subject}
                      </p>
                    </div>
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
