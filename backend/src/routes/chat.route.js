import {accessChat,fetchChats,createGroupChat, renameGroup, addToGroup, removeFromGroup} from '../controllers/chat.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import {Router} from 'express'


const router=Router();
router.use(verifyJWT)
router.route('/').post(accessChat)
router.route('/').get(fetchChats)
router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupadd").put(addToGroup);
router.route("/groupremove").put(removeFromGroup);


export default router