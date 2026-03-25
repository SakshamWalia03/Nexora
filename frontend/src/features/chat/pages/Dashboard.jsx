import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
const ReactMarkdown = React.lazy(() => import("react-markdown"));
const remarkGfm = React.lazy(() => import("remark-gfm"));
import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { setCurrentChatId } from "../chat.slice";
import { Navigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────────────────────────
const stripMarkdown = (text) => {
  return (
    text
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.replace(/\*(.*?)\*/g, "$1")
      ?.replace(/`(.*?)`/g, "$1")
      ?.replace(/#{1,6}\s/g, "")
      ?.replace(/\[(.*?)\]\(.*?\)/g, "$1")
      ?.trim() || "New conversation"
  );
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ── Nexora Logo ──────────────────────────────────────────────────────────────
const NexoraLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient
        id="dlbg"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1b0f3a" />
        <stop offset="1" stopColor="#0b1e35" />
      </linearGradient>
      <linearGradient
        id="dlng"
        x1="10"
        y1="10"
        x2="30"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#c4b5fd" />
        <stop offset="0.5" stopColor="#818cf8" />
        <stop offset="1" stopColor="#22d3ee" />
      </linearGradient>
      <linearGradient
        id="dlrg"
        x1="0"
        y1="0"
        x2="40"
        y2="40"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#7c3aed" stopOpacity="0.9" />
        <stop offset="1" stopColor="#0891b2" stopOpacity="0.5" />
      </linearGradient>
      <filter id="dlgw">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect
      x="0.6"
      y="0.6"
      width="38.8"
      height="38.8"
      rx="11"
      fill="url(#dlbg)"
    />
    <rect
      x="0.6"
      y="0.6"
      width="38.8"
      height="38.8"
      rx="11"
      fill="none"
      stroke="url(#dlrg)"
      strokeWidth="1.2"
    />
    <path
      d="M11 29V11L29 29V11"
      stroke="url(#dlng)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#dlgw)"
    />
  </svg>
);

// ── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name }) => (
  <div
    className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shrink-0 text-white font-semibold text-xs"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
  >
    {name ? name.slice(0, 2).toUpperCase() : "U"}
  </div>
);

// ── AI message bubble ─────────────────────────────────────────────────────────
const AIBubble = ({ content }) => {
  const cleaned = content?.replace(/\\n/g, "\n") || "";
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-500/30 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5">
        <NexoraLogo size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold text-violet-400 mb-1.5 uppercase tracking-widest"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Nexora
        </p>
        <div
          className="prose prose-invert prose-sm max-w-none
            prose-p:text-slate-200 prose-p:leading-7 prose-p:my-1
            prose-headings:text-white prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
            prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-slate-300
            prose-code:text-cyan-300 prose-code:bg-white/[0.07] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0d0d18] prose-pre:border prose-pre:border-white/[0.08] prose-pre:rounded-xl prose-pre:p-4 prose-pre:my-3 prose-pre:overflow-x-auto
            prose-pre:text-slate-200
            prose-ul:text-slate-200 prose-ul:my-2 prose-ul:pl-5
            prose-ol:text-slate-200 prose-ol:my-2 prose-ol:pl-5
            prose-li:my-0.5 prose-li:leading-7
            prose-li:marker:text-violet-400
            prose-blockquote:border-l-2 prose-blockquote:border-violet-500 prose-blockquote:text-slate-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-3
            prose-hr:border-white/[0.08]
            prose-table:text-sm
            prose-th:text-white prose-th:font-semibold prose-th:bg-white/[0.05] prose-th:px-3 prose-th:py-2
            prose-td:text-slate-300 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-white/[0.08]
            prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <React.Suspense fallback={<p className="text-slate-400 text-xs">Loading...</p>}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleaned}</ReactMarkdown>
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

// ── User message bubble ───────────────────────────────────────────────────────
const UserBubble = ({ content, userName }) => (
  <div className="flex gap-3 items-start justify-end">
    <div className="max-w-[75%] bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tr-sm px-4 py-3">
      <p
        className="text-slate-100 text-sm leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {content}
      </p>
    </div>
    <Avatar name={userName} />
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);

  const chat = useChat();
  const auth = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const chatList = Object.values(chats).sort(
    (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0),
  );

  const filteredChats = chatList.filter((c) =>
    (c.title || "New conversation")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const activeChat = currentChatId ? chats[currentChatId] : null;
  const activeMessages = activeChat?.messages || [];

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, isLoading]);

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
    setInputValue("");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSelectChat = async (chatId) => {
    if (!chatId) return;
    setInputValue("");
    await chat.handleOpenChat(chatId);
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await chat.handleSendMessage({ message: text, chatId: currentChatId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    setDeleteConfirm(chatId);
  };

  const confirmDelete = async () => {
    const chatId = deleteConfirm;
    setDeleteConfirm(null);
    await chat.handleDeleteChat(chatId);
  };

  const userName = user?.username || user?.name || "User";

  return (
    <div
      className="flex h-screen bg-[#0a0a0f] overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className={`${sidebarOpen ? "w-72" : "w-0"} shrink-0 transition-all duration-300 ease-in-out overflow-hidden flex flex-col border-r border-white/[0.06] bg-[#0d0d14]`}
      >
        <div className="flex flex-col h-full w-72">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <NexoraLogo size={28} />
              <span
                className="text-white text-base font-semibold"
                style={{ letterSpacing: "-0.02em" }}
              >
                Nexora
              </span>
            </div>
            <button
              onClick={handleNewChat}
              title="New chat"
              className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 mb-3">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
              <svg
                className="w-3.5 h-3.5 text-slate-500 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats…"
                className="bg-transparent text-slate-300 text-xs outline-none w-full placeholder-slate-600"
              />
            </div>
          </div>

          {/* Label */}
          <p
            className="text-[10px] text-slate-600 uppercase tracking-[0.12em] font-medium px-4 mb-2"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Recent
          </p>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-hide">
            {filteredChats.length === 0 && (
              <p className="text-slate-600 text-xs text-center py-8">
                {chatList.length === 0 ? "No chats yet" : "No chats found"}
              </p>
            )}
            {filteredChats.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectChat(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group relative flex items-center gap-1 cursor-pointer ${
                  currentChatId === c.id
                    ? "bg-violet-500/[0.12] border border-violet-500/20"
                    : "hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {currentChatId === c.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-violet-400 to-cyan-400 rounded-full" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={`text-xs font-medium truncate leading-snug ${currentChatId === c.id ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}
                    >
                      {stripMarkdown(c.title)}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                    {timeAgo(c.lastUpdated)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(e, c.id)}
                  title="Delete chat"
                  className="opacity-0 group-hover:opacity-100 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* User footer */}
          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
              <Avatar name={userName} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm text-white font-medium truncate"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {userName}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {user?.email || "nexora user"}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu((prev) => !prev)}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>

                {showSettingsMenu && (
                  <div className="absolute right-0 bottom-10 w-44 bg-[#0f0f18] border border-white/[0.10] rounded-xl shadow-lg overflow-hidden">
                    {/* Logout (current session) */}
                    <button
                      onClick={async () => {
                        setShowSettingsMenu(false);
                        try {
                          await auth.handleLogout();
                          toast.success("Logged out successfully");
                          window.location.href = "/login";
                        } catch (e) {
                          console.error("Logout failed", e);
                          toast.error("Logout failed");
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.06] transition-all"
                    >
                      Sign out
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.08]" />

                    {/* Logout all devices */}
                    <button
                      onClick={async () => {
                        setShowSettingsMenu(false);
                        try {
                          await auth.handleLogoutAll();
                          toast.success("Logged out from all devices");
                          window.location.href = "/login";
                        } catch (e) {
                          console.error("Logout all failed", e);
                          toast.error("Logout all failed");
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Sign out all devices
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06] shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1
            className="flex-1 text-sm font-medium text-slate-300 truncate"
            style={{ letterSpacing: "-0.01em" }}
          >
            {stripMarkdown(activeChat?.title) || "New conversation"}
          </h1>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-medium transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New chat
          </button>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {activeMessages.length > 0 ? (
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
              {activeMessages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble
                    key={i}
                    content={msg.content}
                    userName={userName}
                  />
                ) : (
                  <AIBubble key={i} content={msg.content} />
                ),
              )}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-500/30 border border-violet-500/25 flex items-center justify-center shrink-0 mt-0.5">
                    <NexoraLogo size={16} />
                  </div>
                  <div className="flex items-center gap-1 pt-2">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce"
                        style={{ animationDelay: `${j * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 pb-32">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl scale-110" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b0f3a] to-[#0b1e35] border border-violet-500/30 flex items-center justify-center">
                  <NexoraLogo size={32} />
                </div>
              </div>
              <h2
                className="text-white text-2xl font-bold mb-2 text-center"
                style={{ letterSpacing: "-0.03em" }}
              >
                What can I help with?
              </h2>
              <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed">
                Ask anything — Nexora is ready to think, search, and answer.
              </p>
              <div className="flex flex-wrap gap-2 mt-7 justify-center max-w-sm">
                {[
                  "Explain quantum computing",
                  "Write a React hook",
                  "Summarize a topic",
                  "Debug my code",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputValue(s);
                      setTimeout(() => textareaRef.current?.focus(), 50);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:text-slate-200 hover:border-white/[0.12] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── INPUT BAR ── */}
        <div className="shrink-0 px-4 pb-5 pt-3">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-white/[0.05] border border-white/[0.10] rounded-2xl shadow-2xl shadow-black/40 focus-within:border-violet-500/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                rows={1}
                disabled={isLoading}
                className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-600 outline-none resize-none px-4 pt-3.5 pb-12 max-h-40 leading-relaxed disabled:opacity-50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
                <span
                  className="text-[10px] text-slate-700 ml-1"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  Enter ↵ to send · Shift+Enter for newline
                </span>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    inputValue.trim() && !isLoading
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-500 shadow-lg shadow-violet-500/30 text-white"
                      : "bg-white/[0.05] text-slate-700 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-[#0f0f18] border border-white/[0.10] rounded-2xl p-6 shadow-2xl shadow-black/60">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3
              className="text-white text-base font-semibold mb-1.5"
              style={{ letterSpacing: "-0.02em" }}
            >
              Delete this chat?
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This conversation will be permanently deleted and cannot be
              recovered.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] transition-all active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .prose pre::-webkit-scrollbar { height: 4px; }
        .prose pre::-webkit-scrollbar-track { background: transparent; }
        .prose pre::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
