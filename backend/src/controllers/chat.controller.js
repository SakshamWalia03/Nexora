import { generateResponse, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from '../models/message.model.js'

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    let title = null;
    let chat = null;

    if (!chatId) {
      title = await generateTitle(message);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    } else {
      chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    }

    const chatRef = chatId || chat._id;

    await messageModel.create({
      chat: chatRef,
      content: message,
      role: "user",
    });

    const messages = await messageModel
      .find({ chat: chatRef })
      .sort({ createdAt: 1 });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: chatRef,
      content: result,
      role: "ai",
    });

    console.log(title);
    

    res.status(201).json({
      title,
      chat,
      aiMessage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export async function getChats(req, res) {
  try {
    const userId = req.user.id;

    const chats = await chatModel.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages retrieved successfully",
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    await messageModel.deleteMany({ chat: chatId });

    await chatModel.deleteOne({ _id: chatId });

    res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}