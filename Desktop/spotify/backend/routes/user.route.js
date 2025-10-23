import { Router } from "express";
import { getAllUsers, getMessages, sendMessage } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.post("/messages", protectRoute, sendMessage);

export default router;
