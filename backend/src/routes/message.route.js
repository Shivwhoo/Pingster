import { Router } from "express";
import { sendMessage,allMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.use(verifyJWT);

router.route("/").post(sendMessage);
router.route("/:chatId").get(allMessages);

export default router;