import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true
    },
    description: {
      // Advanced: Useful for channel topics (e.g., "System Error Logs")
      type: String,
      trim: true,
      default: ""
    },
    isGroupChat: {
      // Fixed Typo: was 'isGrouphat'
      type: Boolean,
      default: false
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    groupAvatar: {
      // Advanced: Custom icons for groups
      type: String,
      default: ""
    },
    pinnedMessage: {
      // Advanced: Keep important commands/messages pinned at the top
      type: Schema.Types.ObjectId,
      ref: "Message"
    },
    deletedFor: [
      {
        // Advanced: Handles "Clear Chat" without deleting it for the other person
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { 
    timestamps: true 
  }
);
9
export const Chat = mongoose.model("Chat", chatSchema);