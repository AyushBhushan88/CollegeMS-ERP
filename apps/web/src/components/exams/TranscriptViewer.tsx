'use client';

import { Transcript } from '@campuscore/shared-types';
import { Loader2, Download, Award, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';

export function TranscriptViewer() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/examination/transcripts/my');
      setTranscripts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transcripts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTranscript = async (semester: number) => {
    try {
      toast({
        title: 'Processing',
        description: `Generating transcript for Semester ${semester}...`,
      });
      const response = await apiClient.get(
        `/examination/transcripts/download?semester=${semester}`,
        {
          responseType: 'blob',
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transcript-sem-${semester}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download transcript',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {transcripts.length > 0 ? (
          transcripts.map((transcript) => (
            <Card key={transcript.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Semester {transcript.semester}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${transcript.resultStatus === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {transcript.resultStatus}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase">SGPA</p>
                    <p className="text-2xl font-bold">{transcript.sgpa.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase">CGPA</p>
                    <p className="text-2xl font-bold">{transcript.cgpa.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase">Credits Earned</p>
                    <p className="text-xl font-semibold">
                      {transcript.earnedCredits} / {transcript.totalCredits}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <Award
                      className={`h-10 w-10 ${transcript.resultStatus === 'PASS' ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDownloadTranscript(transcript.semester)}
                  disabled={!transcript.isFinalized}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Transcript
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-xl bg-muted/10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Transcripts Available</h3>
            <p className="text-muted-foreground">
              Your results will appear here once they are finalized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
