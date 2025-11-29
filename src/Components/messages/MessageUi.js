import { useMemo, useState,useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { IoColorPalette } from "react-icons/io5";
import { FaPalette } from "react-icons/fa";
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
const [isShaking, setIsShaking] = useState(false);
const [someoneTyping, setSomeoneTyping] = useState(null);


const sendNudge = async () => {
  if (!activeChatId) return;

  await sendMessage(currentUserId, "/nudge"); // store as a special system command
};

useEffect(() => {
  const channel = supabase
    .channel("typing")
    .on("broadcast", { event: "typing" }, (payload) => {
      if (
        payload.payload.roomId === activeChatId &&
        payload.payload.userId !== currentUserId
      ) {
        setSomeoneTyping(payload.payload.username);

        setTimeout(() => setSomeoneTyping(null), 2000); // auto-clear
      }
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [activeChatId, currentUserId]);



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
useEffect(() => {
  const last = messages[messages.length - 1];
  if (!last) return;

  const isNudge = last.content === "/nudge";
  const fromOther = last.sender_id !== currentUserId;

  if (isNudge && fromOther) {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 800);
  }
}, [messages, currentUserId]);
const handleTyping = async (text) => {
  setNewMessage(text);
if (!activeChatId) return;
  await supabase.channel("typing")
    .send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId: currentUserId,
        roomId: activeChatId,
        username: publicUser?.username
      }
    });
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

  // convert selected usernames → IDs
  const selectedIds = selectedFriends
    .map(username => friends.find(f => f.username === username)?.public_user_id)
    .filter(Boolean);

  // include self
  const participantIds = Array.from(new Set([currentUserId, ...selectedIds]));

  // ALWAYS TREAT NEW CHATS AS GROUPS
  const chatType = "group";

  const chatName = `Chat with ${selectedFriends.join(", ")}`;

  const { data: newChat, error } = await supabase
    .from("chat_rooms")
    .insert([{ name: chatName, type: chatType }])
    .select()
    .single();

  if (error) {
    console.error("Error creating chat:", error);
    return;
  }

  const participantRows = participantIds.map(uid => ({
    chat_id: newChat.id,
    user_id: uid,
  }));

  await supabase.from("chat_participants").insert(participantRows);

  await refresh();
  setActiveChatId(newChat.id);
  setSelectedFriends([]);
};




  const handleSend = async () => {
    if (!newMessage.trim() || !activeChatId || !currentUserId) return;
    await sendMessage(currentUserId, newMessage.trim());
    setNewMessage("");
  };

  // sidebar preview helpers

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
 <div className={`msn-container ${isShaking ? "shake-screen" : ""}`}>

    {/* HEADER — Classic Blue MSN Bar */}
    <div className="msn-header">
      MSN Reborn
    </div>

    <div style={{ display: "flex", flex: 1 }}>
      {/* SIDEBAR */}
{/* SIDEBAR */}
<div className={`msn-sidebar ${showSidebar ? "show" : ""}`}>
  {/* CONTACT LIST */}
  <div className="msn-section-title">Contacts</div>

  {friends.map((f) => (
    <div
      key={f.public_user_id}
      className="friend-item"
      onClick={() => {
        setSelectedFriends([f.username]);
        startChat();
      }}
    >
      <FaUserCircle className="friend-avatar" />
      <span>{f.username}</span>
    </div>
  ))}

  {/* SEPARATOR LINE */}
  <div className="msn-separator"></div>

  {/* ACTIVE CHAT ROOMS */}
  <div className="msn-section-title">Your Chats</div>

  {chatRooms.map((room) => (
    <div
      key={room.id}
      className={`chatroom-item ${
        activeChatId === room.id ? "active-chatroom" : ""
      }`}
      onClick={() => setActiveChatId(room.id)}
    >
      {/* Room name */}
      <div className="chatroom-name">
        {room.type === "private"
          ? room.participants
              .filter((p) => p.id !== currentUserId)
              .map((p) => p.username)
              .join(", ")
          : room.name}
      </div>

      {/* Preview (latest message or created date) */}
      <div className="chatroom-preview">
        {roomPreview(room)}
      </div>
    </div>
  ))}
</div>


      {/* MAIN CHAT SECTION */}
      <div className="chat-section">
        {/* TAB BAR */}
        <div className="chat-tabs">
          {activeRoom && (
            <div className="chat-tab active">
              {displayRoomName}
              <span
                className="close-tab"
                onClick={() => setActiveChatId(null)}
              >
                ×
              </span>
            </div>
          )}
        </div>

        {/* CHAT HEADER BAR */}
        <div className="chat-header">
          <button className="menu-btn" onClick={() => setShowSidebar(!showSidebar)}>
            <FiMenu />
          </button>
<button className="msn-btn" onClick={sendNudge}>
  🫨 Nudge
</button>


          <h4>{displayRoomName}</h4>

          {/* Name Color Picker Button */}
          <button
            className="msn-btn color-button"
            title="Change your chat name color"
            onClick={() => setShowSettingsModal(true)}
          >
            <IoColorPalette />
          </button>

          {/* Add people button */}
          {activeRoom && activeRoom.type === "group" && (
            <button
              className="msn-btn"
              onClick={() => setShowAddModal(true)}
            >
              Add People
            </button>
          )}

          {/* Leave chat */}
          {activeRoom && (
            <button
              className="msn-btn"
              onClick={() => setShowLeaveModal(true)}
            >
              Leave
            </button>
          )}
        </div>

        {/* MESSAGES */}
        <div className="chat-body">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message-wrapper ${
                msg.sender_id === currentUserId ? "sent" : "received"
              }`}
            >
              <div className="chat-bubble">
                {/* sender name */}
                <div
                  className="sender-name"
                  style={{ color: msg.name_color }}
                >
                  {msg.senderName}
                </div>

                {/* message content (supports emojis) */}
                <div>{renderMessageContent(msg.content)}</div>

                <div className="timestamp">
                  {fmtRelTime(msg.created_at)}
                </div>
                {someoneTyping && (
  <div className="typing-indicator">
    {someoneTyping} is typing…
  </div>
)}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT BAR */}
        <div className="chat-input">
          {/* Emoji button */}
          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker((x) => !x)}
          >
            🙂
          </button>

          {/* typing input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            className="msn-input"
            placeholder="Type a message…"
          />

          {/* send */}
          <button
            className="msn-send-btn"
            onClick={handleSend}
          >
            <IoSend />
          </button>

          {/* Emoji picker */}
{showEmojiPicker && (
  <div className="emoji-picker">
    {Object.entries(emojiMap).map(([key, emoji]) => (
      <button
        key={key}
        className="emoji-btn-item"
        onClick={() => {
          setNewMessage((prev) => prev + " " + key + " ");
          setShowEmojiPicker(false);
        }}
      >
        <img src={emoji} alt={key} className="emoji-inline" />
      </button>
    ))}
  </div>
)}
        </div>
      </div>
    </div>

    {/* POPUP MODALS */}
    <SettingsModal
      open={showSettingsModal}
      onClose={() => setShowSettingsModal(false)}
      userId={currentUserId}
      onColorChange={setUserColor}
    />

<AddPeopleModal
  open={showAddModal}
  friends={availableToAdd}                
  existing={activeRoom?.participants || []}
  onCancel={() => setShowAddModal(false)} 
  onConfirm={handleAddPeople}          
  />

<LeaveChatModal
  open={showLeaveModal}
  chatName={displayRoomName}
  onCancel={() => setShowLeaveModal(false)}
  onConfirm={leaveChat}
/>

  </div>
);

}
