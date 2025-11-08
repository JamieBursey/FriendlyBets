import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../supabaseClient";

export const useChatRooms = (currentUserId) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Get participant rooms
      const { data: participantRows, error: pError } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", currentUserId);

      if (pError) throw pError;
      if (!participantRows?.length) {
        setChatRooms([]);
        setLoading(false);
        return;
      }

      const chatIds = [...new Set(participantRows.map(r => r.chat_id))];

      // 2️⃣ Room metadata
      const { data: roomRows, error: rError } = await supabase
        .from("chat_rooms")
        .select("id, name, type, created_at")
        .in("id", chatIds);
      if (rError) throw rError;

      // 3️⃣ Participants
      const { data: allParticipants, error: apError } = await supabase
        .from("chat_participants")
        .select("chat_id, user_id")
        .in("chat_id", chatIds);
      if (apError) throw apError;

      // 4️⃣ Users with name_color
      const userIds = [...new Set(allParticipants.map(p => p.user_id))];
      const { data: userRows, error: uError } = await supabase
        .from("users")
        .select("public_user_id, username, name_color")
        .in("public_user_id", userIds);
      if (uError) throw uError;

      const idToUser = new Map(userRows.map(u => [u.public_user_id, u]));

      // 5️⃣ Latest messages
      const { data: msgRows } = await supabase
        .from("chat_messages")
        .select("chat_id, content, sender_id, created_at")
        .in("chat_id", chatIds)
        .order("created_at", { ascending: false });

      const latestMsg = new Map();
      msgRows?.forEach(msg => {
        if (!latestMsg.has(msg.chat_id)) latestMsg.set(msg.chat_id, msg);
      });

      // 6️⃣ Assemble room list
      const rooms = roomRows.map(room => {
        const participants = allParticipants
          .filter(ap => ap.chat_id === room.id)
          .map(ap => ({
            id: ap.user_id,
            username: idToUser.get(ap.user_id)?.username || "Unknown",
            name_color: idToUser.get(ap.user_id)?.name_color || "#ffffff",
          }));

        return {
          ...room,
          participants,
          latestMessage: latestMsg.get(room.id) || null,
          lastActivity:
            latestMsg.get(room.id)?.created_at || room.created_at,
        };
      });

      rooms.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
      setChatRooms(rooms);
    } catch (err) {
      console.error(err);
      setError(err);
    }

    setLoading(false);
  }, [currentUserId]); // ✅ stable dependency

  // Run once or when user changes
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]); // ✅ no ESLint warning now

  return { chatRooms, loading, error, refresh: fetchRooms };
};
