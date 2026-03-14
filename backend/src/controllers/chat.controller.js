import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "UserId params not sent with request");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -refreshToken")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username email avatar",
  });

  if (isChat.length > 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, isChat[0], "Chat retrieved successfully"));
  }

  var chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);

    const fullChat = await createdChat.populate(
      "users",
      "-password -refreshToken",
    );
    return res
      .status(200)
      .json(new ApiResponse(200, fullChat, "New Chat created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error creating the chat");
  }
});
const fetchChats = asyncHandler(async (req, res) => {
  //dashboard for the chat- have all the chat i have done sorted,chats owners pic,latest message
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password -refreshToken")
      .populate("groupAdmin", "-password -refreshToken")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "username avatar email",
    });
    return res
      .status(200)
      .json(new ApiResponse(200, results, "User chats fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Error while fetching chats");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    // kyuki aage chalkar qroup avatar bhi daalna hoga isliye no req.body
    throw new ApiError(400, "Please fill all the fields (name and users)");
  }

  let users;
  try {
    users = JSON.parse(req.body.users);
  } catch (error) {
    users = req.body.users;
  }
  if (users.length < 2) {
    throw new ApiError(
      400,
      "More than 2 users are required to form a group chat",
    );
  }

  users.push(req.user._id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id, // Tumne banaya hai toh tum Admin ho
    });
    const fullGroupChat = await groupChat.populate([
      { path: "users", select: "-password -refreshToken" },
      { path: "groupAdmin", select: "-password -refreshToken" },
    ]);

    // 7. Response bhej do
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fullGroupChat,
          "New Group Chat Created Successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message || "Error while creating group chat");
  }
});
const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    // findByIdAndUpdate: Pehla argument ID, doosra jo change karna hai
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
    .populate("users", "-password -refreshToken")
    .populate("groupAdmin", "-password -refreshToken");

    if (!updatedChat) {
        throw new ApiError(404, "Chat Not Found");
    } else {
        return res.status(200).json(
            new ApiResponse(200, updatedChat, "Group name updated successfully")
        );
    }
});

const addToGroup=asyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body

    const added=await Chat.findByIdAndUpdate(chatId,{$push:{userId}},{new:true})
    .populate("users","-password -refreshToken")
    .populate("groupAdmin",'-password -refreshToken')

    if(!added){
        throw new ApiError(404,"chat not found")
    }else{
        return res.status(200).json(
            new ApiResponse(200, added, "User added to the group")
        );
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // $pull operator: Array me se specific item dhoondh kar nikalne ke liye
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
    .populate("users", "-password -refreshToken")
    .populate("groupAdmin", "-password -refreshToken");

    if (!removed) {
        throw new ApiError(404, "Chat Not Found");
    } else {
        return res.status(200).json(
            new ApiResponse(200, removed, "User removed from the group")
        );
    }
});

export { accessChat, fetchChats, createGroupChat,renameGroup,addToGroup,removeFromGroup };
