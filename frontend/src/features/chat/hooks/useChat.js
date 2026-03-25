import { initializeSocketConnection } from "../service/chat.socket.js";
import { sendMessage, getAllChats, getMessages, deleteChat } from "../service/chats.api.js";
import {
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    setMessages,
    setChats,
    removeChat
} from "../chat.slice.js";
import { useDispatch, useSelector } from "react-redux";

const TEMP_ID = "temp_chat";

export const useChat = () => {
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chat.chats);

    async function handleSendMessage({ message, chatId }) {
        try {
            if (chatId) {
                dispatch(addNewMessage({ chatId, content: message, role: "user" }));
            } else {
                dispatch(createNewChat({ chatId: TEMP_ID, title: message.slice(0, 40) }));
                dispatch(addNewMessage({ chatId: TEMP_ID, content: message, role: "user" }));
                dispatch(setCurrentChatId(TEMP_ID));
            }

            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await sendMessage({ message, chatId: chatId || null });
            const { chat, aiMessage } = data;
            const realId = chat._id?.toString();

            if (!chatId) {
                dispatch(createNewChat({ chatId: realId, title: chat.title }));
                dispatch(addNewMessage({ chatId: realId, content: message, role: "user" }));

                dispatch(removeChat(TEMP_ID));
                dispatch(setCurrentChatId(realId));
            }

            dispatch(addNewMessage({ chatId: realId, content: aiMessage.content, role: aiMessage.role }));

        } catch (error) {
            console.error("Send message failed:", error);
            dispatch(removeChat(TEMP_ID));
            dispatch(setCurrentChatId(null));
            dispatch(setError(error?.message || "Failed to send message"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            const data = await getAllChats();

            const chatArray = Array.isArray(data) ? data : (data?.chats || []);

            const formatted = chatArray.reduce((acc, chat) => {
                const id = chat._id?.toString();
                acc[id] = {
                    id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, {});

            dispatch(setChats(formatted));
        } catch (error) {
            console.error("Get chats failed:", error);
            dispatch(setError(error?.message || "Failed to load chats"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId) {
        try {
            if (!chatId) {
                console.error("handleOpenChat: chatId is undefined!");
                return;
            }

            if (chats[chatId]?.messages.length === 0) {
                const data = await getMessages({ chatId: chatId });
                const msgArray = Array.isArray(data) ? data : (data?.messages || []);

                const formattedMessages = msgArray.map((msg) => ({
                    content: msg.content,
                    role: msg.role,
                }));

                dispatch(setMessages({ chatId, messages: formattedMessages }));
            }

            dispatch(setCurrentChatId(chatId));
        } catch (error) {
            console.error("Open chat failed:", error);
            dispatch(setError(error?.message || "Failed to open chat"));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            if (!chatId) {
                console.error("handleDeleteChat: chatId is undefined!");
                return;
            }

            dispatch(setLoading(true));
            dispatch(setError(null));

            await deleteChat({ chatId: chatId });
           
            const data = await getAllChats();

            const chatArray = Array.isArray(data) ? data : (data?.chats || []);

            const formatted = chatArray.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, {});

            dispatch(setChats(formatted));
            dispatch(setCurrentChatId(null));

        } catch (error) {
            console.error("Delete chat failed:", error);
            dispatch(setError(error?.message || "Failed to delete chat"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
    };
};