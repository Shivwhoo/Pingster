import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId,replyTo } = req.body;

if (!content && (!req.files || req.files.length === 0)) {
        throw new ApiError(400, "Please provide text content or an attachment to send a message");
    }

    if (!chatId) {
        throw new ApiError(400, "Chat ID is required");
    }

    // `var` hatakar `const` use kiya. Speling mistake thik ki (newMesssage -> newMessage)
    const newMessage = {
        sender: req.user._id,
        chat: chatId
    };

    
    
    if(content) newMessage.content=content

    if(replyTo){
        newMessage.replyTo=replyTo
    }

    if (req.files && req.files.length > 0) {
        // Agar ek sath 3-4 photos aayi hain, toh sabko ek sath Cloudinary par bhejne ke liye Promise.all use karenge (Fast & Pro approach)
        const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));
        const uploadedFiles = await Promise.all(uploadPromises);

        const attachmentsArray = [];
        
        uploadedFiles.forEach((file,index) => {
            if (file) {
                attachmentsArray.push({
                    url: file.url,
                    fileType: req.files[index].mimetype
                });
            }
        });

        newMessage.attachments = attachmentsArray;
    }

    try {
        // Step 1: Message create kiya
        let message = await Message.create(newMessage);

        // Step 2: Ek hi sath saari cheezein populate kar li (Fast & Clean)
        message = await message.populate([
            { path: "sender", select: "username avatar" },
            { path: "chat" }
        ]);

        if (replyTo) {
            message = await message.populate({
                path: "replyTo",
                select: "content sender isDeleted", // Purane message ka data
                populate: {
                    path: "sender",
                    select: "username" // Purane message bhejane wale ka naam
                }
            });
        }

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


const deleteMessage=asyncHandler(async(req,res)=>{
    const {messageId}=req.params;
    const message=await Message.findById(messageId)

    if(!message){
        throw new ApiError(404,"Message not found")
    }

    if(message.sender.toString()!== req.user._id.toString()){
        throw new ApiError(403,"You cant delete others' message")
    }

    message.isDeleted=true;
    message.content = "";
    message.attachments=[]
    await message.save();

    return res.status(200).json(
        new ApiResponse(200, message, "Message deleted for everyone")
    );

})

const markMessagesAsRead = asyncHandler(async (req, res) => {
    // 1. URL se chatId nikalenge
    const { chatId } = req.params;

    // 2. Database update query
    const result = await Message.updateMany(
        { 
            chat: chatId, 
            sender: { $ne: req.user._id }, 
            readBy: { $ne: req.user._id } 
        },
        { 
            $addToSet: { readBy: req.user._id } 
        }
    );

    // 3. Response bhej do
    return res.status(200).json(
        new ApiResponse(200, result, "All messages marked as read")
    );
});

// Upar yeh import zaroor check kar lena, kyunki hum Chat ko update kar rahe hain
// import { Chat } from "../models/chat.model.js";

const togglePinMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;


    const message = await Message.findById(messageId);

    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    const chat = await Chat.findById(message.chat);

    if (!chat) {
        throw new ApiError(404, "Chat not found");
    }
    let responseText = "";

    if (chat.pinnedMessage?.toString() === messageId.toString()) {
        chat.pinnedMessage = null;
        responseText = "Message unpinned successfully 📍";
    } else {

        chat.pinnedMessage = messageId;
        responseText = "Message pinned successfully 📌";
    }

    await chat.save();

    const updatedChat = await Chat.findById(chat._id).populate("pinnedMessage");

    return res.status(200).json(
        new ApiResponse(200, updatedChat, responseText)
    );
});

const editMessage=asyncHandler(async(req,res)=>{
    const {messageId}=req.params;
    const {content}=req.body;

    if(!content || content.trim===""){
        throw new ApiError(400,"New content is required")
    }

    const message=await Message.findById(messageId)

    if(!message){
        throw new ApiError(404,"Message is not found");
    }

    if(req.user._id.toString() !==message.sender.toString()){
        throw new ApiError(403,"Unautorized access")
    }

    if(message.isDeleted){
        throw new ApiError(400,"Cannot edit a deleted message")
    }

    message.content=content;
    message.isEdited=true;

    await message.save();

    const updatedMessage=await Message.findById(messageId).populate("sender","username avatar").populate("chat")

    return res.status(200).json(
        new ApiResponse(200, updatedMessage, "Message edited successfully ✏️")
    );
})

export {sendMessage,allMessages,deleteMessage,markMessagesAsRead,togglePinMessage,editMessage}

