import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      trim: true
      // Isko required nahi kiya kyunki ho sakta hai user sirf image/file bheje, bina text ke.
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    
    // --- ADVANCED FIELDS ---

    attachments: [
      {
        // Agar kal ko Cloudinary ya AWS S3 par images/files upload karni ho
        url: String,
        fileType: String // e.g., "image/png", "application/pdf", "text/javascript"
      }
    ],
    readBy: [
      {
        // Read Receipts (Blue Ticks). Jo user message read karega, uska ID isme push ho jayega
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    replyTo: {
      // Threading/Quoting: Agar ye message kisi purane message ka reply hai
      type: Schema.Types.ObjectId,
      ref: "Message"
    },
    isEdited: {
      // UI me "(edited)" dikhane ke liye
      type: Boolean,
      default: false
    },
    isDeleted: {
      // Soft Delete: Agar user "Delete for Everyone" kare, toh document database se nahi udega, bas ye true ho jayega aur UI par likha aayega "Message deleted."
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

export const Message = mongoose.model("Message", messageSchema);