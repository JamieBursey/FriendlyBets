import { useMemo, useState,useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FiMenu,FiSettings } from "react-icons/fi";
import { emojiMap } from "./assets/EmoticonMap";
import renderMessageContent from "./Emoji-img";
import { usePublicUser } from "./data/usePublicUserID";
import { useFriends } from "./data/fetchFriends";
import { useChatRooms } from "./data/useChatRooms";
import { useMessages } from "./data/useMessages";
import LeaveChatModal from "./LeaveChatModal";
import AddPeopleModal from "./data/AddPeopleModal"; 
import SettingsModal from "./data/NameColorPicker";

import "./MessengerUI.css";



const fmtRelTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const toTime = (dt) =>
    dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isSameDay(d, now)) return `Today ${toTime(d)}`;
  if (isSameDay(d, yesterday)) return `Yesterday ${toTime(d)}`;

  // e.g., Jan 12 4:32 PM
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const truncate = (s, n = 32) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// -----------------

export const MessagesUI = () => {
  // current user (from your users table, includes public_user_id)
  const { publicUser, loading: userLoading, error: userError } = usePublicUser();
  const currentUserId = publicUser?.public_user_id || null;
const [showLeaveModal, setShowLeaveModal] = useState(false);
  // friends from users.friends JSON (expects [{username,email,public_user_id}, ...])
  const { friends = [], loading: friendsLoading } = useFriends(currentUserId);

  // rooms the user is in (participants resolved to {id, username}), sorted by last activity
  const { chatRooms, loading: chatLoading, refresh } = useChatRooms(currentUserId);
const [showAddModal, setShowAddModal] = useState(false);

  const [selectedFriends, setSelectedFriends] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
const [userColor, setUserColor] = useState("#003366");

useEffect(() => {
    
  if (!currentUserId) return;

  // Initialize color
  if (publicUser?.name_color) setUserColor(publicUser.name_color);

  // Create channel specifically for the users table
  const channel = supabase
    .channel("realtime-user-color", {
      config: { broadcast: { self: true } }, // allow receiving own updates
    })
.on(
  "postgres_changes",
  {
    event: "UPDATE",
    schema: "public",
    table: "users",
  },
  (payload) => {
    console.log("⚡ Realtime event received:", payload);
    const updated = payload.new;
    if (!updated) return;

    if (updated.public_user_id === currentUserId) {
      setUserColor(updated.name_color);
    }
    refresh();
  }
)
    .subscribe((status) => {
      console.log("Realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [currentUserId, publicUser, refresh]);


  // messages for the active chat
  const activeRoom = useMemo(
  () => chatRooms.find((r) => r.id === activeChatId) || null,
  [chatRooms, activeChatId]
);

  const { messages, loading: messagesLoading, sendMessage } = useMessages(activeChatId);
const activeRoomLabel = activeRoom
  ? (activeRoom.type === "private"
      ? activeRoom.participants.filter(p => p.id !== currentUserId).map(p => p.username).join(", ")
      : activeRoom.name || activeRoom.participants.filter(p => p.id !== currentUserId).map(p => p.username).join(", "))
  : "";

  const availableToAdd = friends.filter(
  f => !activeRoom?.participants.some(p => p.id === f.public_user_id)
);
const handleAddPeople = async (newUserIds) => {
  if (!activeChatId) return;
  const rows = newUserIds.map(uid => ({ chat_id: activeChatId, user_id: uid }));

  const { error } = await supabase.from("chat_participants").insert(rows);
  if (error) {
    console.error("Error adding people:", error);
  } else {
    await refresh(); // reload rooms
    setShowAddModal(false); // close modal
  }
};
// LEAVE CHAT: core logic
const leaveChat = async () => {
  try {
    if (!activeChatId || !currentUserId) return;

    // 1) remove me from participants
    const { error: delErr } = await supabase
      .from("chat_participants")
      .delete()
      .eq("chat_id", activeChatId)
      .eq("user_id", currentUserId);
    if (delErr) throw delErr;


    const { data: remaining, error: remErr } = await supabase
      .from("chat_participants")
      .select("user_id", { count: "exact", head: false })
      .eq("chat_id", activeChatId);
    if (remErr) throw remErr;

    if (!remaining || remaining.length === 0) {

      await supabase.from("chat_messages").delete().eq("chat_id", activeChatId);
      await supabase.from("chat_rooms").delete().eq("id", activeChatId);
    } else {
      // still members → post a system-like message for others
      const whoLeft = publicUser?.username || "";
      await supabase.from("chat_messages").insert([{
        chat_id: activeChatId,
        sender_id: currentUserId, // stored as me; I won't see it after leaving
        content: `${whoLeft} has left the chat.`
      }]);
    }

    setShowLeaveModal(false);
    setActiveChatId(null);
    await refresh(); // reload chat list
  } catch (e) {
    console.error("Leave chat error:", e);
  }
};


  const displayRoomName = useMemo(() => {
    if (!activeRoom) return "";
    if (activeRoom.type === "private") {
      return activeRoom.participants
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.username)
        .join(", ");
    }
    // group: prefer room.name, else list others
    const fallback = activeRoom.participants
      .filter((p) => p.id !== currentUserId)
      .map((p) => p.username)
      .join(", ");
    return activeRoom.name || fallback || "Group Chat";
  }, [activeRoom, currentUserId]);

  const toggleFriendSelection = (friendUsername) => {
    setSelectedFriends((prev) =>
      prev.includes(friendUsername)
        ? prev.filter((n) => n !== friendUsername)
        : [...prev, friendUsername]
    );
  };

const startChat = async () => {
  if (!currentUserId || selectedFriends.length === 0) return;

  // friends selected → convert to their public_user_id values
  const selectedIds = selectedFriends
    .map(username => friends.find(f => f.username === username)?.public_user_id)
    .filter(Boolean);

  // Include current user always
  const participantIds = Array.from(new Set([currentUserId, ...selectedIds]));

  // 🛑 CHECK FOR EXISTING 1-on-1 chat
  if (participantIds.length === 2) {
    const existingPrivateChat = chatRooms.find(
      room =>
        room.type === "private" &&
        room.participants.length === 2 &&
        room.participants.some(p => p.id === participantIds[0]) &&
        room.participants.some(p => p.id === participantIds[1])
    );

    if (existingPrivateChat) {
      console.log("PRIVATE CHAT ALREADY EXISTS ✅", existingPrivateChat.id);
      setActiveChatId(existingPrivateChat.id);
      setSelectedFriends([]);
      return;
    }
  }

  // 🔥 If no existing, create new chat
  const chatType = participantIds.length === 2 ? "private" : "group";
  const chatName =
    chatType === "private"
      ? selectedFriends[0]
      : `Chat with ${selectedFriends.join(", ")}`;

  const { data: newChat, error } = await supabase
    .from("chat_rooms")
    .insert([{ name: chatName, type: chatType }])
    .select()
    .single();

  if (error) {
    console.error("Error creating chat:", error);
    return;
  }

  // insert participants
  const participantRows = participantIds.map(uid => ({
    chat_id: newChat.id,
    user_id: uid
  }));

  await supabase.from("chat_participants").insert(participantRows);

  await refresh(); // reload chat rooms
  setActiveChatId(newChat.id); // open new chat
  setSelectedFriends([]); // reset selection
};



  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId || !currentUserId) return;
    await sendMessage(currentUserId, newMessage.trim());
    setNewMessage("");
  };

  // sidebar preview helpers
  const roomLabel = (room) => {
    if (room.type === "private") {
      return room.participants
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.username)
        .join(", ");
    }
    return room.name ||
      room.participants.filter((p) => p.id !== currentUserId).map((p) => p.username).join(", ") ||
      "Group Chat";
  };

  const roomPreview = (room) => {
    if (room.latestMessage) {
      const fromMe = room.latestMessage.sender_id === currentUserId;
      const prefix = fromMe
        ? "You: "
        : (() => {
            const who =
              room.participants.find((p) => p.id === room.latestMessage.sender_id)?.username ||
              "";
            return `${who}: `;
          })();
      return truncate(prefix + room.latestMessage.content, 40);
    }
    // No messages yet → show "Created on Mon DD" (your choice D)
    const created = new Date(room.created_at);
    const stamp = created.toLocaleString([], { month: "short", day: "numeric" });
    return `Created on ${stamp}`;
  };

  if (userLoading || chatLoading) return <p>Loading…</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (!currentUserId) return <p>Not signed in.</p>;

return (
  <div className="msn-container">
    {/* Sidebar */}
    {showSidebar && (
      <div className="msn-sidebar open">
        <h3 className="msn-title">MSN Reborn</h3>

        {/* Start New Chat */}
        <div className="friends-list start-chat-section">
          <h4 style={{ margin: "10px 0 5px 10px", fontSize: "0.95rem" }}>
            Start New Chat
          </h4>

          {friendsLoading ? (
            <p style={{ margin: 10 }}>Loading friends…</p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.public_user_id}
                className={`friend-item ${
                  selectedFriends.includes(friend.username) ? "active" : ""
                }`}
                onClick={() => toggleFriendSelection(friend.username)}
              >
                <FaUserCircle className="friend-avatar" />
                <span>{friend.username}</span>
              </div>
            ))
          )}
        </div>

        <button
          className="start-chat-btn"
          onClick={startChat}
          style={{
            margin: "10px",
            padding: "8px",
            background: "#005a9e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Start Chat
        </button>

<div className="sidebar-gap"></div>

        <div className="friends-list chats-section">
          <h4 style={{ margin: "10px 0 5px 10px", fontSize: "0.95rem" }}>
            Your Chats
          </h4>
          {chatRooms.map((room) => (
            <div
              key={room.id}
              className={`friend-item ${
                room.id === activeChatId ? "active" : ""
              }`}
              onClick={() => setActiveChatId(room.id)}
            >
              <FaUserCircle className="friend-avatar" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <span style={{ fontWeight: 600 }}>{roomLabel(room)}</span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    opacity: 0.9,
                  }}
                >
                  <span>{roomPreview(room)}</span>
                  <span>{fmtRelTime(room.lastActivity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Chat Section */}
    {activeRoom ? (
      <div className="chat-section">
        {/* Tabs bar */}
        {chatRooms.length > 0 && (
          <div className="chat-tabs">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                className={`chat-tab ${
                  room.id === activeChatId ? "active" : ""
                }`}
                onClick={() => setActiveChatId(room.id)}
              >
                {roomLabel(room)}
                <span
                  className="close-tab"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChatId(
                      activeChatId === room.id
                        ? chatRooms[0]?.id || null
                        : activeChatId
                    );
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FiMenu />
          </button>
          <h4 style={{ flex: 1 }}>{displayRoomName}</h4>
          <button
            className="msn-btn xp-secondary"
            onClick={() => setShowAddModal(true)}
          >
            Add People
          </button>
          <button
            className="msn-btn xp-secondary"
            onClick={() => setShowLeaveModal(true)}
          >
            Leave Chat
          </button>
            <button
    className="msn-btn xp-secondary"
    onClick={() => setShowSettingsModal(true)}
    title="Settings"
  >
    <FiSettings />
  </button>
        </div>

        {/* Messages */}
        <div className="chat-body">
          {messagesLoading ? (
            <p style={{ color: "#555" }}>Loading messages…</p>
          ) : (
            messages.map((msg) => {
              const sender = activeRoom.participants.find(
                (p) => p.id === msg.sender_id
              );
              const senderName = sender?.username || "Unknown";

              return (
                <div
                  key={msg.id}
                  className={`chat-message-wrapper ${
                    msg.sender_id === currentUserId ? "sent" : "received"
                  }`}
                >
                  {activeRoom.type === "group" &&
                    msg.sender_id !== currentUserId && (
                      <div className="sender-name" style={{ color: sender?.name_color || "#0078d4" }}>{senderName}</div>
                    )}
<div
  className={`chat-bubble ${
    msg.sender_id === currentUserId ? "sent" : "received"
  }`}
>
  <div
    style={{
color:
  msg.sender_id === currentUserId
    ? userColor || "#003366"
    : sender?.name_color || "#003366",

    }}
  >
    {renderMessageContent(msg.content)}
  </div>
  <div className="timestamp">{fmtRelTime(msg.created_at)}</div>
</div>
                </div>
              );
            })
          )}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {Object.entries(emojiMap).map(([code, src]) => (
              <img
                key={code}
                src={src}
                alt={code}
                title={code}
                className="emoji-option"
                onClick={() => {
                  setNewMessage((prev) => prev + " " + code + " ");
                  setShowEmojiPicker(false);
                }}
              />
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            type="button"
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          <button onClick={handleSend}>
            <IoSend />
          </button>
        </div>
      </div>
    ) : (
      <div
        className="chat-section"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#555" }}>Select friends and start a chat!</p>
      </div>
    )}

    {/* Modals */}
    <LeaveChatModal
      open={showLeaveModal}
      chatName={activeRoomLabel}
      onCancel={() => setShowLeaveModal(false)}
      onConfirm={leaveChat}
    />
    <AddPeopleModal
      open={showAddModal}
      friends={availableToAdd}
      existing={activeRoom?.participants}
      onCancel={() => setShowAddModal(false)}
      onConfirm={handleAddPeople}
    />
    <SettingsModal
      open={showSettingsModal}
      onClose={() => setShowSettingsModal(false)}
      userId={currentUserId}
      onColorChange={(color) => setUserColor(color)}
    />
  </div>
);
}
