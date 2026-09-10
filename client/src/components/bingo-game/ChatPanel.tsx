import { useEffect, useRef, useState } from "react";
import { Send, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getRoomByCode } from "@/global/roomsApi";
import { useAuth } from "@/global/authContext";

type Tab = "chat" | "players" | "info";

interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
}

function getRoomCodeFromUrl(): string {
  try {
    const hash = window.location.hash || "";
    const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
    if ((parts[0] === "bingo-game" || parts[0] === "room") && parts[1]) {
      return parts[1];
    }
  } catch {
    // ignore
  }
  return "DIWALI77";
}

const getWsUrl = (roomCode: string) => {
  const envUrl = import.meta.env.VITE_WS_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "") {
    return `${envUrl.replace(/\/+$/, "")}/api/v1/rooms/${roomCode}/ws`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/v1/rooms/${roomCode}/ws`;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "players", label: "Players" },
  { id: "info", label: "Info" },
];

export function ChatPanel() {
  const roomCode = getRoomCodeFromUrl();
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`bingo_chat_room_${roomCode}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isConnected, setIsConnected] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();

  const { data: room } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: () => getRoomByCode(roomCode),
    enabled: Boolean(roomCode),
  });

  const hostName = room?.hostName ?? "Host";
  const playerIds: string[] = Array.isArray(room?.playerIds) ? room.playerIds : [];
  const playerCount = playerIds.length > 0 ? playerIds.length : (room?.playerCount ?? 1);
  const maxPlayers = room?.maxPlayers ?? 50;

  const persistentUserIdRef = useRef<string>("");
  if (!persistentUserIdRef.current) {
    const stored = localStorage.getItem("chat_user_id");
    if (stored) {
      persistentUserIdRef.current = stored;
    } else {
      const generated = `user_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chat_user_id", generated);
      persistentUserIdRef.current = generated;
    }
  }
  const currentUserId = user?.id ? String(user.id) : persistentUserIdRef.current;

  // WebSocket lifecycle (single connection per roomCode)
  useEffect(() => {
    if (!roomCode) return;

    const socketUrl = getWsUrl(roomCode);
    console.log(`[WebSocket] Connecting... to room ${roomCode} at ${socketUrl}`);

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`[WebSocket] Connected to room ${roomCode}`);
      setIsConnected(true);
      setChatError(null);
    };

    socket.onmessage = (event) => {
      console.log(`[WebSocket] Received message for room ${roomCode}:`, event.data);
      try {
        const data = JSON.parse(event.data);
        if (data && typeof data.message === "string") {
          const newMsg: ChatMessage = {
            id: `${Date.now()}-${Math.random()}`,
            userId: String(data.userId ?? ""),
            message: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => {
            const isDuplicate = prev.some(
              (m) => m.userId === newMsg.userId && m.message === newMsg.message
            );
            if (isDuplicate) return prev;

            const next = [...prev, newMsg];
            try {
              localStorage.setItem(`bingo_chat_room_${roomCode}`, JSON.stringify(next.slice(-100)));
            } catch {
              // ignore
            }
            return next;
          });
        }
      } catch (err) {
        console.error(`[WebSocket] Error parsing message for room ${roomCode}:`, err);
      }
    };

    socket.onerror = (err) => {
      console.error(`[WebSocket] Error on room ${roomCode}:`, err);
      setIsConnected(false);
      setChatError("Chat is disconnected.");
    };

    socket.onclose = (event) => {
      console.log(`[WebSocket] Disconnected from room ${roomCode}. Code: ${event.code}`);
      setIsConnected(false);
    };

    return () => {
      console.log(`[WebSocket] Cleaning up socket for room ${roomCode}`);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomCode]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  // Send message via WebSocket
  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn(`[WebSocket] Cannot send message for room ${roomCode}: socket is not OPEN`);
      setChatError("Chat is disconnected.");
      return;
    }

    const payload = JSON.stringify({
      userId: currentUserId,
      message: text,
    });
    console.log(`[WebSocket] Sent message for room ${roomCode}:`, payload);
    socketRef.current.send(payload);
    setInputMessage("");
    setChatError(null);
  };

  const hostInitials = hostName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "H";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav className="flex shrink-0 gap-1 border-b border-bb-border px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-3.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-bb-primary"
                : "text-bb-muted hover:text-bb-text",
            )}
          >
            {tab.id === "players" ? `Players (${playerCount}/${maxPlayers})` : tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-bb-primary" />
            )}
          </button>
        ))}
      </nav>

      {activeTab === "chat" && (
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-6 text-bb-muted">
                <p className="text-sm font-medium">No messages yet.</p>
                <p className="text-xs mt-1">Start the conversation with your room!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = currentUserId !== "" && msg.userId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                  >
                    <span className="mb-0.5 text-[10px] text-bb-muted px-1">
                      {isMe ? "You" : msg.userId ? `User ${msg.userId.slice(-4)}` : "User"} • {msg.timestamp}
                    </span>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                        isMe
                          ? "rounded-tr-none bg-bb-primary text-white"
                          : "rounded-tl-none bg-bb-surface text-bb-text border border-bb-border"
                      )}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input Area */}
          <div className="shrink-0 border-t border-bb-border p-3.5 bg-bb-elevated">
            {chatError && (
              <p className="mb-2 text-center text-xs font-semibold text-red-500">{chatError}</p>
            )}
            <div className="flex items-center gap-2 rounded-full border border-bb-border bg-bb-surface py-1.5 pl-4 pr-1.5 shadow-inner">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isConnected ? "Type a message..." : "Connecting to chat..."}
                disabled={!isConnected}
                className="flex-1 bg-transparent text-sm text-bb-text placeholder:text-bb-muted focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!isConnected || !inputMessage.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-bb-primary text-white transition-colors hover:bg-bb-primary-hover disabled:bg-bb-border disabled:text-bb-muted"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "players" && (
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-bb-muted">
              Room Members ({playerCount})
            </span>
          </div>

          <div className="space-y-3">
            {playerIds.length > 0 ? (
              playerIds.map((pid, idx) => {
                const isHost = pid === room?.hostId || idx === 0;
                const isMe = currentUserId === pid;
                const displayName = isHost
                  ? (hostName ? hostName : `Host`)
                  : `Player (${pid.slice(-4)})`;

                const initials = isHost
                  ? hostInitials
                  : pid.slice(-2).toUpperCase();

                return (
                  <div key={pid} className="flex items-center gap-3 rounded-xl border border-bb-border bg-bb-surface p-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={cn("text-xs font-bold text-white", isHost ? "bg-bb-primary" : "bg-bb-secondary/40 text-bb-primary")}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-bb-text truncate">{displayName}</p>
                        {isHost && (
                          <span className="rounded bg-bb-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shrink-0">
                            Host
                          </span>
                        )}
                        {isMe && (
                          <span className="rounded bg-bb-success/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-bb-success shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-bb-muted truncate">ID: {pid.slice(-8)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                {/* Fallback Host Item */}
                <div className="flex items-center gap-3 rounded-xl border border-bb-border bg-bb-surface p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-bb-primary text-xs font-bold text-white">
                      {hostInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-bb-text">{hostName}</p>
                      <span className="rounded bg-bb-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        Host
                      </span>
                    </div>
                    <p className="text-xs text-bb-muted">Room Creator</p>
                  </div>
                </div>

                {/* Joined Players */}
                {Array.from({ length: Math.max(0, playerCount - 1) }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-bb-border bg-bb-surface p-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-bb-secondary/20 text-xs font-bold text-bb-primary">
                        P{i + 1}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-bb-text">Player {i + 1}</p>
                      <p className="text-xs text-bb-muted">Joined Room</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="space-y-4 p-6 text-sm">
          <InfoRow label="Title" value={room?.title ?? "Bollywood Room"} />
          <InfoRow label="Theme" value={room?.theme ?? "Bollywood Classics"} />
          <InfoRow label="Host" value={hostName} />
          <InfoRow label="Players" value={`${playerCount} / ${maxPlayers}`} />
          <InfoRow label="Visibility" value={room?.visibility ?? "public"} />
          <InfoRow label="Room Code" value={room?.code ?? roomCode} />
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-bb-border pb-3">
      <span className="text-bb-muted">{label}</span>
      <span className="font-medium text-bb-text">{value}</span>
    </div>
  );
}