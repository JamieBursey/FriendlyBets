import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";

export const useMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load messages initially
  const loadMessages = async () => {
    if (!chatId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
    if (!error) setMessages(data);
    setLoading(false);
  };

  // Subscribe to realtime message updates
  useEffect(() => {
    if (!chatId) return;

    loadMessages(); // Initial load

    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]); // ✅ instantly adds message to UI
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // Send a message
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
