import { Router } from "express";
import { sendMessage,allMessages,deleteMessage, markMessagesAsRead } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route("/").post(
    upload.array("attachments", 5), 
    sendMessage
);
router.route("/:chatId").get(allMessages);
router.route("/:messageId").delete(deleteMessage)
router.route("/:chatId/read").put(markMessagesAsRead);

export default router;