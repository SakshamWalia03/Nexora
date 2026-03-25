import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})


export async function sendMessage({ message, chatId }) {
    try {
        const { data } = await api.post(`/chats/message`, { message, chatId });
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function getAllChats() {
    try {
        const { data } = await api.get(`/chats`);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


export async function getMessages({ chatId }) {
    try {
        const { data } = await api.get(`/chats/${chatId}/messages`);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


export async function deleteChat({ chatId }) {
    try {
        const { data } = await api.delete(`/chats/delete/${chatId}`);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}