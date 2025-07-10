import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Paper,
  IconButton,
  InputBase,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { getTheme } from "./theme";
import ThemeToggle from "./components/ThemeToggle";
import ChatWindow from "./components/ChatWindow";
import VoiceInput from "./components/VoiceInput";
import { sendMessageToOpenAI } from "./api/openai";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import ArticleIcon from "@mui/icons-material/Article";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const theme = useTheme();
  // Chat session state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: uuidv4(),
            name: "New Chat",
            messages: [
              {
                role: "assistant",
                content: "Hello! How can I help you today?",
              },
            ],
          },
        ];
  });
  const [currentChatId, setCurrentChatId] = useState(chats[0].id);
  const [themeMode, setThemeMode] = useState("light");
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingChatName, setEditingChatName] = useState(false);
  const [chatNameInput, setChatNameInput] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleInputChange = (e) => setInput(e.target.value);

  // Helper to get file icon and color
  const getFileIcon = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "pdf")
      return {
        icon: <PictureAsPdfIcon sx={{ fontSize: 32, color: "#e53935" }} />,
        color: "#ffebee",
      };
    if (ext === "docx" || ext === "doc")
      return {
        icon: <DescriptionIcon sx={{ fontSize: 32, color: "#1976d2" }} />,
        color: "#e3f2fd",
      };
    if (ext === "csv")
      return {
        icon: <TableChartIcon sx={{ fontSize: 32, color: "#43a047" }} />,
        color: "#e8f5e9",
      };
    if (ext === "txt" || ext === "md")
      return {
        icon: <ArticleIcon sx={{ fontSize: 32, color: "#6d4c41" }} />,
        color: "#efebe9",
      };
    return {
      icon: <InsertDriveFileIcon sx={{ fontSize: 32, color: "#757575" }} />,
      color: "#f5f5f5",
    };
  };

  // Enhanced thumbnail preview
  const getFilePreviewBox = (selected, preview, textSnippet = null) => {
    if (selected.type.startsWith("image/")) {
      return (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid #1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#e3f2fd",
          }}
        >
          {preview}
        </Box>
      );
    }
    const { icon, color } = getFileIcon(selected);
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 64,
          p: 0.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
            border: "2px solid #bdbdbd",
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            fontSize: 11,
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 60,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selected.name}
        </Box>
        {textSnippet && (
          <Box
            sx={{
              fontSize: 10,
              color: "text.secondary",
              mt: 0.5,
              maxWidth: 60,
              maxHeight: 24,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "pre-line",
            }}
          >
            {textSnippet}
          </Box>
        )}
      </Box>
    );
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      if (selected.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () =>
          setFilePreview(
            getFilePreviewBox(
              selected,
              <img
                src={reader.result}
                alt={selected.name}
                style={{ width: 48, height: 48, objectFit: "cover" }}
              />
            )
          );
        reader.readAsDataURL(selected);
      } else if (
        selected.type.startsWith("text/") ||
        selected.name.match(/\.(txt|md|js|py|json|csv|html|css)$/i)
      ) {
        const reader = new FileReader();
        reader.onload = () =>
          setFilePreview(
            getFilePreviewBox(
              selected,
              null,
              reader.result.split("\n").slice(0, 2).join("\n")
            )
          );
        reader.readAsText(selected);
      } else {
        setFilePreview(getFilePreviewBox(selected, null));
      }
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleVoiceResult = (text) => {
    setInput(text);
  };

  // Find current chat
  const currentChat = chats.find((c) => c.id === currentChatId) || chats[0];

  // Save chats to localStorage on change
  React.useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Chat actions
  const handleNewChat = () => {
    const newChat = {
      id: uuidv4(),
      name: "New Chat",
      messages: [
        { role: "assistant", content: "Hello! How can I help you today?" },
      ],
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };
  const handleSelectChat = (id) => {
    setCurrentChatId(id);
  };
  const handleEditChat = (id, name) => {
    setChats(chats.map((c) => (c.id === id ? { ...c, name } : c)));
  };
  const handleDeleteChat = (id) => {
    let idx = chats.findIndex((c) => c.id === id);
    let newChats = chats.filter((c) => c.id !== id);
    if (newChats.length === 0) {
      // Always keep at least one chat
      const newChat = {
        id: uuidv4(),
        name: "New Chat",
        messages: [
          { role: "assistant", content: "Hello! How can I help you today?" },
        ],
      };
      newChats = [newChat];
      setCurrentChatId(newChat.id);
    } else if (id === currentChatId) {
      // If deleting current, switch to next or previous
      setCurrentChatId(newChats[Math.max(0, idx - 1)].id);
    }
    setChats(newChats);
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    setLoading(true);
    let parts = [];
    let filename = file ? file.name : "";
    try {
      if (file) {
        if (file.type.startsWith("image/")) {
          // Image: send as inlineData part, then question as text part
          const imgData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]); // base64 only
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          parts.push({ inlineData: { mimeType: file.type, data: imgData } });
          if (input.trim()) {
            parts.push({ text: input.trim() });
          }
        } else if (
          file.type.startsWith("text/") ||
          filename.match(/\.(txt|md|js|py|json|csv|html|css)$/i)
        ) {
          // Text/code: combine file content and question in one part
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
          });
          let prompt = `Here is the content of the file "${filename}":\n${text.slice(
            0,
            12000
          )}\n`;
          if (input.trim()) {
            prompt += `\nQuestion: ${input.trim()}`;
          }
          parts.push({ text: prompt });
        } else if (filename.match(/\.pdf$/i)) {
          // PDF: extract text and combine with question
          const pdfData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let pdfText = "";
          for (let i = 1; i <= pdf.numPages && i <= 10; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            pdfText += content.items.map((item) => item.str).join(" ") + "\n";
          }
          let prompt = `Here is the content of the PDF file "${filename}":\n${pdfText.slice(
            0,
            12000
          )}\n`;
          if (input.trim()) {
            prompt += `\nQuestion: ${input.trim()}`;
          }
          parts.push({ text: prompt });
        } else if (filename.match(/\.docx$/i)) {
          // DOCX: extract text and combine with question
          const arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          const result = await mammoth.extractRawText({ arrayBuffer });
          let prompt = `Here is the content of the DOCX file "${filename}":\n${result.value.slice(
            0,
            12000
          )}\n`;
          if (input.trim()) {
            prompt += `\nQuestion: ${input.trim()}`;
          }
          parts.push({ text: prompt });
        } else {
          // Other files: just mention the file and the question
          let prompt = `File attached: ${filename} (file type not supported for preview)`;
          if (input.trim()) {
            prompt += `\nQuestion: ${input.trim()}`;
          }
          parts.push({ text: prompt });
        }
      } else if (input.trim()) {
        // No file, just send the question
        parts.push({ text: input.trim() });
      }
      // Add user message to current chat
      setChats((chats) =>
        chats.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "user", content: input, file },
                ],
              }
            : c
        )
      );
      setInput("");
      setFile(null);
      setFilePreview(null);
      // Send to Gemini backend
      const response = await sendMessageToOpenAI(parts);
      const assistantMsg = response.choices?.[0]?.message;
      setChats((chats) =>
        chats.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { ...assistantMsg, role: "assistant" },
                ],
              }
            : c
        )
      );
    } catch (err) {
      setError(
        err?.response?.data?.error?.message || "Failed to get response."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCloseSnackbar = () => setError("");

  // Inline chat name edit handlers
  const startEditChatName = () => {
    setChatNameInput(currentChat.name);
    setEditingChatName(true);
  };
  const saveChatName = () => {
    if (chatNameInput.trim()) {
      handleEditChat(currentChat.id, chatNameInput.trim());
    }
    setEditingChatName(false);
  };
  const handleChatNameInputKeyDown = (e) => {
    if (e.key === "Enter") saveChatName();
    if (e.key === "Escape") setEditingChatName(false);
  };

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Sidebar: permanent on desktop, swipeable drawer on mobile */}
        {isMobile ? (
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            onSelect={(id) => {
              handleSelectChat(id);
              setMobileSidebarOpen(false);
            }}
            onNew={() => {
              handleNewChat();
              setMobileSidebarOpen(false);
            }}
            onEdit={handleEditChat}
            onDelete={handleDeleteChat}
            open={mobileSidebarOpen}
            onToggle={() => setMobileSidebarOpen((o) => !o)}
            mobile={true}
            onClose={() => setMobileSidebarOpen(false)}
          />
        ) : (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              width: sidebarOpen ? 280 : 72,
              zIndex: 1200,
              transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <Sidebar
              chats={chats}
              currentChatId={currentChatId}
              onSelect={handleSelectChat}
              onNew={handleNewChat}
              onEdit={handleEditChat}
              onDelete={handleDeleteChat}
              open={sidebarOpen}
              onToggle={() => setSidebarOpen((o) => !o)}
              mobile={false}
            />
          </Box>
        )}
        {/* Main content shifts right based on sidebar width (desktop only) */}
        <Box
          sx={{
            ml: isMobile ? 0 : sidebarOpen ? "280px" : "72px",
            transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderRadius: 0,
              minHeight: 56,
              boxShadow: "none",
              bgcolor:
                theme.palette.mode === "dark" ? "#23242a" : "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isMobile && (
                <IconButton
                  onClick={() => setMobileSidebarOpen(true)}
                  sx={{ mr: 1 }}
                  size="large"
                >
                  <MenuIcon />
                </IconButton>
              )}
              {editingChatName ? (
                <input
                  value={chatNameInput}
                  autoFocus
                  onChange={(e) => setChatNameInput(e.target.value)}
                  onBlur={saveChatName}
                  onKeyDown={handleChatNameInputKeyDown}
                  style={{
                    fontWeight: 600,
                    fontSize: 18,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: "2px 8px",
                    outline: "none",
                  }}
                />
              ) : (
                <span
                  style={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: "pointer",
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 1px 6px #111, 0 1px 1px #000"
                        : "none",
                  }}
                  onClick={startEditChatName}
                >
                  {currentChat.name}
                </span>
              )}
              <IconButton
                size="small"
                onClick={startEditChatName}
                sx={{
                  ml: 0.5,
                  color: "#1976d2",
                  p: 0.5,
                  "&:hover": { bgcolor: "primary.50", color: "primary.dark" },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <ThemeToggle mode={themeMode} toggleTheme={handleThemeToggle} />
          </Paper>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <ChatWindow messages={currentChat.messages} />
          </Box>
          <Paper
            elevation={3}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: 0,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <IconButton component="label" disabled={loading}>
              <AttachFileIcon />
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.txt,.md,.doc,.docx,.json,.csv,.js,.py,.java,.c,.cpp,.ts,.tsx,.html,.css,.png,.jpg,.jpeg,.gif,.bmp,.webp"
              />
            </IconButton>
            <Box sx={{ flex: 1, mx: 1, minWidth: 0 }}>
              <InputBase
                sx={{ width: "100%" }}
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
                disabled={loading}
              />
              {file && (
                <Box
                  sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}
                >
                  {filePreview}
                  <Box
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                      maxWidth: 160,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{ ml: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <VoiceInput onResult={handleVoiceResult} disabled={loading} />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={(!input.trim() && !file) || loading}
              sx={{ ml: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Paper>
          <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            message={error}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
