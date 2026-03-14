import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        throw new ApiError(400, "Invalid data passed into req (content or chat not provided)");
    }

    // `var` hatakar `const` use kiya. Speling mistake thik ki (newMesssage -> newMessage)
    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        // Step 1: Message create kiya
        let message = await Message.create(newMessage);

        // Step 2: Ek hi sath saari cheezein populate kar li (Fast & Clean)
        message = await message.populate([
            { path: "sender", select: "username avatar" },
            { path: "chat" }
        ]);

        // Step 3: Chat ke andar wale users ko deep populate kiya (Bug Fix: chats -> chat)
        message = await User.populate(message, {
            path: "chat.users",
            select: "username avatar email"
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id, 
        });

        return res.status(200).json(
            new ApiResponse(200, message, "Message sent successfully")
        );
    } catch (error) {

        throw new ApiError(500, error.message || "Error while sending message");
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username avatar email") 
            .populate("chat"); 

        return res.status(200).json(
            new ApiResponse(200, messages, "Messages fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Error while fetching messages");
    }
});



export {sendMessage,allMessages}