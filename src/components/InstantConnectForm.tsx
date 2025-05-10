"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Trash2, ExternalLink, History, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MeetingHistoryItem {
  id: string;
  link: string;
  nickname?: string;
  timestamp: number;
}

const MAX_HISTORY_ITEMS = 7;

export default function InstantConnectForm() {
  const [nickname, setNickname] = useState<string>('');
  const [currentMeetingLink, setCurrentMeetingLink] = useState<string | null>(null);
  const [meetingHistory, setMeetingHistory] = useState<MeetingHistoryItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedHistory = localStorage.getItem('holaMeetoHistory'); // Updated localStorage key
      if (storedHistory) {
        setMeetingHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load meeting history from localStorage:", error);
      toast({
        title: "Error",
        description: "Could not load meeting history.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('holaMeetoHistory', JSON.stringify(meetingHistory)); // Updated localStorage key
      } catch (error) {
        console.error("Failed to save meeting history to localStorage:", error);
        toast({
          title: "Error",
          description: "Could not save meeting history.",
          variant: "destructive",
        });
      }
    }
  }, [meetingHistory, isClient, toast]);

  const generateUniqueId = (): string => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15);
  };
  
  const handleGenerateMeeting = () => {
    const randomPart = Math.random().toString(36).substring(2, 9);
    const safeNickname = nickname.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const roomName = `HolaMeeto-${safeNickname ? `${safeNickname}-` : ''}${randomPart}`; // Updated prefix
    const newLink = `https://meet.jit.si/${roomName}`;
    
    setCurrentMeetingLink(newLink);

    const newItem: MeetingHistoryItem = {
      id: generateUniqueId(),
      link: newLink,
      nickname: nickname.trim() || undefined,
      timestamp: Date.now(),
    };

    setMeetingHistory(prevHistory => [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS));
    
    toast({
      title: "Meeting Link Generated!",
      description: "Your new Jitsi Meet link is ready.",
    });
  };

  const handleCopyToClipboard = async (linkToCopy: string) => {
    if (!navigator.clipboard) {
      toast({
        title: "Error",
        description: "Clipboard API not available in your browser.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast({
        title: "Copied to Clipboard!",
        description: "Meeting link copied successfully.",
      });
    } catch (err) {
      toast({
        title: "Failed to Copy",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareLink = async () => {
    if (currentMeetingLink && navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Jitsi Meeting',
          text: `Join my meeting: ${currentMeetingLink}`,
          url: currentMeetingLink,
        });
        toast({
          title: "Link Shared",
          description: "Meeting link shared successfully.",
        });
      } catch (err) {
        // If user cancels share, it might throw an error or AbortError.
        if ((err as DOMException).name !== 'AbortError') {
          toast({
            title: "Failed to Share",
            description: "Could not share the link.",
            variant: "destructive",
          });
        }
      }
    } else if (currentMeetingLink) {
      // Fallback for browsers that don't support navigator.share
      handleCopyToClipboard(currentMeetingLink);
      toast({
        title: "Sharing Not Supported",
        description: "Direct sharing is not supported by your browser. Link copied to clipboard instead.",
        variant: "default"
      });
    }
  };
  
  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleRemoveFromHistory = (id: string) => {
    setMeetingHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    toast({
      title: "History Item Removed",
      description: "The meeting link has been removed from your history.",
    });
  };

  const handleClearHistory = () => {
    setMeetingHistory([]);
    toast({
      title: "History Cleared",
      description: "All recent meeting links have been cleared.",
    });
  };

  const formatTimestamp = (timestamp: number) => {
    if (!isClient) return ''; // Avoid server/client mismatch for dates
    return new Date(timestamp).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Meeting</CardTitle>
        <CardDescription>
          Enter an optional nickname and click "Start Meeting" to generate a Jitsi Meet link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname (Optional)</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="E.g., Proyecto Sol, Charla Rápida"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="text-base"
          />
        </div>
        <Button
          onClick={handleGenerateMeeting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" // Updated button color to primary
          aria-label="Start a new meeting"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start Meeting
        </Button>

        {currentMeetingLink && (
          <Card className="mt-6 bg-secondary/50 p-4 rounded-lg">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Your Meeting Link:</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <p className="text-primary font-semibold break-all text-sm md:text-base">{currentMeetingLink}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(currentMeetingLink)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
                {navigator.share && (
                  <Button variant="outline" size="sm" onClick={handleShareLink}>
                    <Share2 className="mr-2 h-4 w-4" /> Share Link
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleOpenLink(currentMeetingLink)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>

      <Separator className="my-6" />

      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Recent Meetings</CardTitle>
          </div>
          {meetingHistory.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isClient && meetingHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent meetings found.</p>
        ) : (
          <ul className="space-y-3">
            {meetingHistory.map((item) => (
              <li key={item.id} className="p-3 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-grow">
                  <p className="font-medium text-sm break-all text-primary">
                    {item.nickname ? `${item.nickname} - ` : ''}
                    {item.link.substring(item.link.lastIndexOf('/') + 1)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenLink(item.link)} title="Join Meeting">
                    <ExternalLink className="h-4 w-4" /> <span className="ml-1 sm:hidden">Join</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(item.link)} title="Copy Link">
                    <Copy className="h-4 w-4" /> <span className="ml-1 sm:hidden">Copy</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFromHistory(item.id)} title="Remove from History" className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" /> <span className="ml-1 sm:hidden">Remove</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
       {isClient && meetingHistory.length > 0 && (
        <CardFooter className="pt-4">
          <p className="text-xs text-muted-foreground">Showing last {meetingHistory.length} of {MAX_HISTORY_ITEMS} meetings.</p>
        </CardFooter>
      )}
    </Card>
  );
}
