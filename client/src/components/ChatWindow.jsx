import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        px: { xs: 1, sm: 3 },
        py: 2,
        bgcolor: "background.default",
        minHeight: 0,
      }}
    >
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          message={msg.content}
          isUser={msg.role === "user"}
          file={msg.file}
        />
      ))}
      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatWindow;
