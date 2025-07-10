import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import {
  IconMessageCircle2,
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { HiOutlineSparkles } from "react-icons/hi2";

const drawerWidth = 280;
const miniWidth = 72;

const Sidebar = ({
  chats,
  currentChatId,
  onSelect,
  onNew,
  onEdit,
  onDelete,
  open,
  onToggle,
  mobile = false, // NEW: is mobile view
  onClose, // NEW: close drawer on mobile
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const handleEditOpen = (id, name) => {
    setEditId(id);
    setEditValue(name);
  };
  const handleEditClose = () => {
    setEditId(null);
    setEditValue("");
  };
  const handleEditSave = () => {
    onEdit(editId, editValue.trim() || "Untitled Chat");
    handleEditClose();
  };
  const handleDelete = (id) => {
    setDeleteId(id);
  };
  const handleDeleteConfirm = () => {
    onDelete(deleteId);
    setDeleteId(null);
  };
  const handleDeleteCancel = () => setDeleteId(null);

  return (
    <Drawer
      variant={mobile ? "temporary" : "permanent"}
      open={open}
      onClose={mobile ? onClose : undefined}
      ModalProps={mobile ? { keepMounted: true } : undefined}
      PaperProps={{
        sx: {
          width: open ? drawerWidth : miniWidth,
          minWidth: open ? drawerWidth : miniWidth,
          maxWidth: open ? drawerWidth : miniWidth,
          boxSizing: "border-box",
          bgcolor: isDark ? "#18191c" : "#f7f7fa",
          color: isDark ? "#fff" : "#222",
          borderRight: `1.5px solid ${isDark ? "#23242a" : "#e0e0e0"}`,
          px: 0,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          ...(mobile && {
            width: "100vw",
            minWidth: 0,
            maxWidth: "100vw",
            borderRight: 0,
          }),
        },
      }}
    >
      {/* Header with logo and app name */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: open ? 2 : 0,
          py: 2,
          gap: 1,
          justifyContent: open ? "flex-start" : "center",
          position: "relative",
        }}
      >
        {mobile && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: isDark ? "#fff" : "#222",
              position: "absolute",
              left: 8,
              top: 8,
              zIndex: 2,
            }}
          ></IconButton>
        )}
        {open ? (
          <>
            <Box
              sx={{
                bgcolor: isDark ? "#23242a" : "#e3f2fd",
                borderRadius: 2,
                p: 1,
                mr: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HiOutlineSparkles
                size={24}
                style={{ color: isDark ? "#90caf9" : "#1976d2" }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDark ? "#fff" : "#1976d2",
                letterSpacing: 0.5,
                fontSize: 20,
              }}
            >
              Chat-Mate
            </Typography>
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Collapse">
              <IconButton
                onClick={onToggle}
                size="small"
                sx={{ color: isDark ? "#fff" : "#222" }}
              >
                <IconChevronLeft size={22} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Expand" placement="right">
            <IconButton
              onClick={onToggle}
              size="small"
              sx={{ color: isDark ? "#fff" : "#222", mx: "auto" }}
            >
              <IconChevronRight size={22} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {/* New Chat Button */}
      <Box
        sx={{
          px: open ? 2 : 0,
          pb: 1,
          display: "flex",
          justifyContent: open ? "flex-start" : "center",
        }}
      >
        <Tooltip title="New Chat" placement={open ? "bottom" : "right"}>
          <Button
            variant={open ? "outlined" : "contained"}
            color="primary"
            startIcon={open ? <IconPlus size={18} /> : null}
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              py: open ? 1.1 : 0,
              fontSize: open ? 16 : 0,
              bgcolor: open ? (isDark ? "#23242a" : "#fff") : "primary.main",
              borderColor: isDark ? "#23242a" : "#d0d7e2",
              boxShadow: "none",
              mb: 1.5,
              minWidth: open ? 0 : 48,
              width: open ? "100%" : 48,
              height: 48,
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .MuiButton-startIcon": {
                ml: open ? 0 : "auto",
                mr: open ? 1 : "auto",
              },
              "&:hover": {
                bgcolor: open
                  ? isDark
                    ? "#23242a"
                    : "#f5f5f5"
                  : "primary.dark",
              },
            }}
            onClick={onNew}
          >
            {open ? "New Chat" : <IconPlus size={22} />}
          </Button>
        </Tooltip>
      </Box>
      {/* Conversations label */}
      {open && (
        <Typography
          variant="subtitle2"
          sx={{
            px: 2,
            pb: 0.5,
            color: isDark ? "#b0b3b8" : "#555",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Conversations
        </Typography>
      )}
      {/* Chat List */}
      <List
        dense
        sx={{
          px: open ? 1 : 0,
          pt: 0.5,
          display: "flex",
          flexDirection: "column",
          alignItems: open ? "stretch" : "center",
        }}
      >
        {chats.length === 0 && open && (
          <ListItem>
            <ListItemText
              primary={
                <Typography color="text.secondary">No chats yet</Typography>
              }
            />
          </ListItem>
        )}
        {chats.map((chat) => {
          const chatItem = (
            <ListItem
              key={chat.id}
              button
              selected={chat.id === currentChatId}
              onClick={() => onSelect(chat.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor:
                  chat.id === currentChatId
                    ? isDark
                      ? "#23242a"
                      : "#e3f2fd"
                    : "transparent",
                boxShadow: chat.id === currentChatId ? 2 : "none",
                px: open ? 2 : 0,
                py: 1.2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  bgcolor: isDark ? "#23242a" : "#f0f4fa",
                  border: `1.5px solid ${isDark ? "#90caf9" : "#1976d2"}`,
                },
                border:
                  chat.id === currentChatId
                    ? `1.5px solid ${isDark ? "#90caf9" : "#1976d2"}`
                    : `1.5px solid transparent`,
                transition: "background 0.2s, border 0.2s",
                minHeight: 48,
                justifyContent: open ? "flex-start" : "center",
                width: open ? "100%" : 48,
                minWidth: open ? undefined : 44,
                maxWidth: open ? undefined : 52,
                mx: open ? 0 : "auto",
              }}
            >
              <Box
                sx={{
                  mr: open ? 1 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: open ? 32 : 28,
                }}
              >
                <IconMessageCircle2
                  size={20}
                  style={{
                    color:
                      chat.id === currentChatId
                        ? isDark
                          ? "#90caf9"
                          : "#1976d2"
                        : isDark
                        ? "#b0b3b8"
                        : "#888",
                  }}
                />
              </Box>
              {open && (
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: chat.id === currentChatId ? 700 : 500,
                        color:
                          chat.id === currentChatId
                            ? isDark
                              ? "#fff"
                              : "#222"
                            : isDark
                            ? "#b0b3b8"
                            : "#222",
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chat.name}
                    </Typography>
                  }
                />
              )}
              {open && (
                <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                  <Tooltip title="Edit name">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditOpen(chat.id, chat.name);
                      }}
                      sx={{
                        color: isDark ? "#b0b3b8" : "#888",
                        "&:hover": { color: isDark ? "#90caf9" : "#1976d2" },
                      }}
                    >
                      <IconEdit size={17} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete chat">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                      sx={{
                        color: isDark ? "#b0b3b8" : "#888",
                        "&:hover": { color: isDark ? "#e57373" : "#e53935" },
                      }}
                    >
                      <IconTrash size={17} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </ListItem>
          );
          return open ? (
            chatItem
          ) : (
            <Tooltip key={chat.id} title={chat.name} placement="right">
              {chatItem}
            </Tooltip>
          );
        })}
      </List>
      {/* Edit Dialog */}
      <Dialog open={!!editId} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Chat Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chat Name"
            type="text"
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleEditSave()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Chat?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar;
