import { useState, useEffect, useRef } from "react";
import { Send, Heart, Mic, Square, Phone, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useCoupleData } from "@/hooks/useCouple";
import { useCalls } from "@/hooks/useCalls";
import { format } from "date-fns";
import { toast } from "sonner";

const ChatView = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useFirebaseAuth();
  const { data: profile } = useProfile();
  const { data: couple } = useCoupleData();
  const { startVoiceCall, startVideoCall, callState } = useCalls();
  const partnerId = profile?.partner_id;
  
  // Messages now use realtime subscription internally
  const { data: messages = [], isLoading } = useMessages(partnerId);
  const sendMessage = useSendMessage();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cleanup recording on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setIsRecording(false);
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob || !partnerId) return;

    try {
      // Convert blob to base64 for sending as message content
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        await sendMessage.mutateAsync({ 
          receiverId: partnerId, 
          content: `🎤 Voice message (${recordingTime}s)` 
        });
        setAudioBlob(null);
        setRecordingTime(0);
        toast.success('Voice message sent! 🎤');
      };
    } catch (error) {
      toast.error('Failed to send voice message');
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSend = async () => {
    if (!message.trim() || !partnerId) return;
    
    await sendMessage.mutateAsync({ 
      receiverId: partnerId, 
      content: message 
    });
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceCall = () => {
    if (!profile?.partner_id) {
      toast.error("Please connect with your partner first!");
      return;
    }

    if (callState !== 'idle') {
      toast.info("Call already in progress");
      return;
    }

    startVoiceCall();
  };

  const handleVideoCall = () => {
    if (!profile?.partner_id) {
      toast.error("Please connect with your partner first!");
      return;
    }

    if (callState !== 'idle') {
      toast.info("Call already in progress");
      return;
    }

    startVideoCall();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!couple || !partnerId) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Heart className="w-16 h-16 text-primary/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Connect with your partner</h2>
        <p className="text-muted-foreground">
          Create or join a couple to start chatting with your loved one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-border/30 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">💕 Love Chat</h2>
            <p className="text-sm text-muted-foreground">Your private space</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceCall}
              className="text-primary hover:bg-primary/10"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVideoCall}
              className="text-primary hover:bg-primary/10"
            >
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart className="w-12 h-12 text-primary/30 mb-3" />
            <p className="text-muted-foreground">
              Start your love conversation! 💬
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === user?.uid;
            const isVoiceMessage = msg.content.startsWith('🎤');
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-card border border-border/30 rounded-bl-md"
                  }`}
                >
                  {isVoiceMessage ? (
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      <span className="text-sm">{msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {format(new Date(msg.created_at), "HH:mm")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice recording preview */}
      {audioBlob && (
        <div className="px-4 py-2 border-t border-border/30 bg-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">Voice message ready ({formatTime(recordingTime)})</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={cancelRecording}>
                Cancel
              </Button>
              <Button size="sm" onClick={sendVoiceMessage} disabled={sendMessage.isPending}>
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="px-4 py-3 border-t border-border/30 glass-card">
        <div className="flex gap-2 items-center">
          {/* Voice recording button */}
          <Button 
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            className={`shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
          >
            {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {isRecording ? (
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-destructive/10 rounded-lg">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm text-foreground">Recording... {formatTime(recordingTime)}</span>
            </div>
          ) : (
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a sweet message..."
              className="flex-1 bg-background/50 border-border/50"
            />
          )}

          {!isRecording && (
            <Button 
              onClick={handleSend} 
              disabled={!message.trim() || sendMessage.isPending}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatView;
