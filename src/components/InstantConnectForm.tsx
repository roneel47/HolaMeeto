
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Trash2, ExternalLink, History, PlusCircle, Video, UserCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

/**
 * @interface MeetingHistoryItem
 * Defines the structure for an item in the meeting history.
 * @property id - A unique identifier for the history item.
 * @property link - The Jitsi Meet link.
 * @property nickname - An optional nickname associated with the meeting.
 * @property timestamp - The Unix timestamp when the meeting was created.
 */
interface MeetingHistoryItem {
  id: string;
  link: string;
  nickname?: string;
  timestamp: number;
}

// Maximum number of items to store in the meeting history.
const MAX_HISTORY_ITEMS = 7;
// Key used for storing meeting history in localStorage.
const LOCAL_STORAGE_HISTORY_KEY = 'holaMeetoHistory';

/**
 * InstantConnectForm Component
 * 
 * This component provides a form for users to generate Jitsi Meet links.
 * It allows users to:
 * - Optionally enter a nickname.
 * - Generate a new meeting link.
 * - View the generated link.
 * - Copy the link to the clipboard.
 * - Share the link (if supported by the browser).
 * - Open the link in a new tab.
 * - View a history of recently generated meetings.
 * - Remove individual meetings from history or clear the entire history.
 * Meeting history is persisted in localStorage.
 */
export default function InstantConnectForm() {
  // State for the user-entered nickname.
  const [nickname, setNickname] = useState<string>('');
  // State for the currently generated meeting link. Null if no link has been generated yet.
  const [currentMeetingLink, setCurrentMeetingLink] = useState<string | null>(null);
  // State for storing the list of recent meeting links.
  const [meetingHistory, setMeetingHistory] = useState<MeetingHistoryItem[]>([]);
  // State to track if the component has mounted on the client-side.
  // This is crucial for safely accessing browser-specific APIs like localStorage or window.
  const [isClient, setIsClient] = useState(false);
  
  // Hook to display toast notifications.
  const { toast } = useToast();

  // Effect to run on component mount (client-side only).
  useEffect(() => {
    // Mark that the component has mounted on the client.
    setIsClient(true);
    
    // Load meeting history from localStorage.
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (storedHistory) {
        setMeetingHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load meeting history from localStorage:", error);
      toast({
        title: "Error Loading History",
        description: "Could not load your meeting history. It might be corrupted.",
        variant: "destructive",
      });
    }
  }, [toast]); // Dependency: toast function (stable, but good practice to include)

  // Effect to run whenever meetingHistory changes (client-side only).
  useEffect(() => {
    // Only save to localStorage if on the client and history has changed.
    if (isClient) {
      try {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(meetingHistory));
      } catch (error) {
        console.error("Failed to save meeting history to localStorage:", error);
        toast({
          title: "Error Saving History",
          description: "Could not save your meeting history changes.",
          variant: "destructive",
        });
      }
    }
  }, [meetingHistory, isClient, toast]); // Dependencies: meetingHistory, isClient, toast

  /**
   * Generates a unique ID string.
   * Uses crypto.randomUUID if available, otherwise falls back to a Math.random based approach.
   * @returns A unique string identifier.
   */
  const generateUniqueId = (): string => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback for environments where crypto.randomUUID is not available
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  /**
   * Handles the generation of a new Jitsi Meet link.
   * It constructs a unique room name, updates the current link state,
   * and adds the new meeting to the history.
   */
  const handleGenerateMeeting = () => {
    const randomPart = Math.random().toString(36).substring(2, 9); // Generate a random string
    // Sanitize nickname: trim whitespace, replace spaces with underscores, remove invalid characters.
    const safeNickname = nickname.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    // Construct the room name with a prefix and optional sanitized nickname.
    const roomName = `HolaMeeto-${safeNickname ? `${safeNickname}-` : ''}${randomPart}`;
    const newLink = `https://meet.jit.si/${roomName}`;
    
    setCurrentMeetingLink(newLink);

    const newItem: MeetingHistoryItem = {
      id: generateUniqueId(),
      link: newLink,
      nickname: nickname.trim() || undefined, // Store trimmed nickname or undefined if empty
      timestamp: Date.now(),
    };

    // Add new item to the beginning of the history and limit history size.
    setMeetingHistory(prevHistory => [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS));
    
    toast({
      title: "Meeting Link Generated!",
      description: "Your new Jitsi Meet link is ready to use or share.",
    });
  };

  /**
   * Copies the provided link to the user's clipboard.
   * Shows a toast notification on success or failure.
   * @param linkToCopy - The string (URL) to be copied.
   */
  const handleCopyToClipboard = async (linkToCopy: string) => {
    if (!navigator.clipboard) {
      toast({
        title: "Clipboard Not Available",
        description: "Sorry, your browser does not support clipboard access.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast({
        title: "Copied to Clipboard!",
        description: "The meeting link has been copied.",
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast({
        title: "Copy Failed",
        description: "Could not copy the link. Please try manually.",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles sharing the current meeting link using the Web Share API if available.
   * Falls back to copying the link if Web Share API is not supported.
   */
  const handleShareLink = async () => {
    if (!currentMeetingLink) return; // Should not happen if button is visible

    if (navigator.share) { // Check if Web Share API is supported
      try {
        await navigator.share({
          title: 'Join my Jitsi Meeting on HolaMeeto',
          text: `Let's meet! Join here: ${currentMeetingLink}`,
          url: currentMeetingLink,
        });
        toast({
          title: "Link Shared",
          description: "Meeting link shared successfully via your device's share dialog.",
        });
      } catch (err) {
        // AbortError usually means the user cancelled the share operation, so no error toast needed.
        if ((err as DOMException).name !== 'AbortError') {
          console.error("Failed to share link:", err);
          toast({
            title: "Share Failed",
            description: "Could not share the link using the share dialog.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyToClipboard(currentMeetingLink);
      toast({
        title: "Sharing Not Supported by Browser",
        description: "Direct sharing isn't available, but the link has been copied to your clipboard!",
      });
    }
  };
  
  /**
   * Opens the given meeting link in a new browser tab.
   * @param link - The URL of the Jitsi meeting to open.
   */
  const handleOpenLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  /**
   * Removes a specific meeting item from the history.
   * @param idToRemove - The unique ID of the MeetingHistoryItem to remove.
   */
  const handleRemoveFromHistory = (idToRemove: string) => {
    setMeetingHistory(prevHistory => prevHistory.filter(item => item.id !== idToRemove));
    toast({
      title: "Meeting Removed",
      description: "The selected meeting has been removed from your history.",
    });
  };

  /**
   * Clears all items from the meeting history.
   */
  const handleClearHistory = () => {
    setMeetingHistory([]);
    toast({
      title: "History Cleared",
      description: "All recent meeting links have been removed from history.",
    });
  };

  /**
   * Formats a Unix timestamp into a human-readable date and time string.
   * Returns an empty string if not on the client-side to prevent hydration mismatches.
   * @param timestamp - The Unix timestamp (milliseconds) to format.
   * @returns A formatted date-time string or an empty string.
   */
  const formatTimestamp = (timestamp: number): string => {
    if (!isClient) return ''; // Prevent server/client mismatch for dates
    return new Date(timestamp).toLocaleString(undefined, { // Uses browser's default locale
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };


  return (
    <Card className="w-full shadow-xl">
      {/* Section for creating a new meeting */}
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Video className="mr-3 h-7 w-7 text-primary" />
          Create a New Meeting
        </CardTitle>
        <CardDescription>
          Enter an optional nickname and click "Start Meeting" to instantly generate a Jitsi Meet link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nickname Input */}
        <div className="space-y-2">
          <Label htmlFor="nickname" className="flex items-center text-base">
            <UserCircle2 className="mr-2 h-5 w-5 text-muted-foreground" />
            Nickname (Optional)
          </Label>
          <Input
            id="nickname"
            type="text"
            placeholder="E.g., Team Sync, Quick Chat"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="text-base"
            aria-describedby="nickname-description"
          />
           <p id="nickname-description" className="text-sm text-muted-foreground">
            A nickname helps identify your meetings in the history.
          </p>
        </div>
        {/* Generate Meeting Button */}
        <Button
          onClick={handleGenerateMeeting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
          aria-label="Start a new meeting and generate link"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start Meeting
        </Button>

        {/* Display for Current Meeting Link (if generated) */}
        {currentMeetingLink && (
          <Card className="mt-6 bg-secondary/50 p-4 rounded-lg">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-lg">Your New Meeting Link:</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <p className="text-primary font-semibold break-all text-sm md:text-base" aria-live="polite">
                {currentMeetingLink}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(currentMeetingLink)} aria-label="Copy meeting link to clipboard">
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
                {isClient && navigator.share && ( // Only show share button if API is available
                  <Button variant="outline" size="sm" onClick={handleShareLink} aria-label="Share meeting link">
                    <Share2 className="mr-2 h-4 w-4" /> Share Link
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleOpenLink(currentMeetingLink)} aria-label="Open meeting link in a new tab">
                  <ExternalLink className="mr-2 h-4 w-4" /> Open Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>

      <Separator className="my-6" />

      {/* Section for Recent Meetings History */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-7 w-7 text-primary" />
            <CardTitle className="text-2xl">Recent Meetings</CardTitle>
          </div>
          {/* Clear History Button (only if history exists) */}
          {isClient && meetingHistory.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearHistory} aria-label="Clear all recent meetings from history">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Display meeting history or a message if empty */}
        {isClient && meetingHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent meetings found. Generate a new one to get started!</p>
        ) : (
          <ul className="space-y-3">
            {meetingHistory.map((item) => (
              <li 
                key={item.id} 
                className="p-3 border rounded-lg bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
                aria-labelledby={`meeting-title-${item.id}`}
              >
                <div className="flex-grow">
                  <p id={`meeting-title-${item.id}`} className="font-medium text-sm break-all text-primary">
                    {/* Display nickname if available, then the unique part of the link */}
                    {item.nickname ? `${item.nickname} - ` : ''}
                    {item.link.substring(item.link.lastIndexOf('/') + 1)}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenLink(item.link)} title="Join Meeting" aria-label={`Join meeting ${item.nickname || item.link.substring(item.link.lastIndexOf('/') + 1)}`}>
                    <ExternalLink className="h-4 w-4" /> <span className="ml-1 sm:hidden">Join</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(item.link)} title="Copy Link" aria-label={`Copy link for meeting ${item.nickname || item.link.substring(item.link.lastIndexOf('/') + 1)}`}>
                    <Copy className="h-4 w-4" /> <span className="ml-1 sm:hidden">Copy</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFromHistory(item.id)} 
                    title="Remove from History" 
                    className="text-destructive hover:text-destructive/80"
                    aria-label={`Remove meeting ${item.nickname || item.link.substring(item.link.lastIndexOf('/') + 1)} from history`}
                  >
                    <Trash2 className="h-4 w-4" /> <span className="ml-1 sm:hidden">Remove</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
       {/* Footer for history section, showing count of items */}
       {isClient && meetingHistory.length > 0 && (
        <CardFooter className="pt-4">
          <p className="text-xs text-muted-foreground">
            Showing {meetingHistory.length} of your last {MAX_HISTORY_ITEMS} meetings.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

