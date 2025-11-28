import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export const useMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages with sender data
  const loadMessages = async () => {
    if (!chatId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("chat_messages")
      .select(`
        id,
        chat_id,
        sender_id,
        content,
        created_at,
        users:sender_id (
          username,
          name_color
        )
      `)
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Message load error:", error);
      setLoading(false);
      return;
    }

    const mapped = data.map((msg) => ({
      ...msg,
      senderName: msg.users?.username || "Unknown",
      name_color: msg.users?.name_color || "#ffffff",
    }));

    setMessages(mapped);
    setLoading(false);
  };

  // Realtime subscription
  useEffect(() => {
    if (!chatId) return;

    loadMessages();

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          const msg = payload.new;

          // fetch user so the realtime message ALSO gets name color + username
          const { data: user } = await supabase
            .from("users")
            .select("username, name_color")
            .eq("public_user_id", msg.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              senderName: user?.username || "Unknown",
              name_color: user?.name_color || "#ffffff",
            },
          ]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [chatId]);

  // Send message
  const sendMessage = async (senderId, content) => {
    await supabase.from("chat_messages").insert([
      {
        chat_id: chatId,
        sender_id: senderId,
        content,
      },
    ]);
  };

  return { messages, loading, sendMessage };
};
