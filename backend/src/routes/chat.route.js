import { Router } from 'express';
import { sendMessage, getChats, getMessages, deleteChat } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';

const chatRouter = Router();

chatRouter.post("/message", authenticate, sendMessage)
chatRouter.get("/", authenticate, getChats)
chatRouter.get("/:chatId/messages", authenticate, getMessages)
chatRouter.delete("/delete/:chatId", authenticate, deleteChat)

export default chatRouter;