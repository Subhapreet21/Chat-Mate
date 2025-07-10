import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const MessageBubble = ({ message, isUser, file }) => {
  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={1.5}
    >
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          maxWidth: "75%",
          bgcolor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderTopRightRadius: isUser ? 0 : 12,
          borderTopLeftRadius: isUser ? 12 : 0,
        }}
      >
        {file && (
          <Box display="flex" alignItems="center" mb={0.5}>
            <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" noWrap>
              {file.name || "Attachment"}
            </Typography>
          </Box>
        )}
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;
