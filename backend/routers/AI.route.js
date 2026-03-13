import { getAllThreads , getThread , deleteThread , chat } from "../controllers/AI.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

import express from "express";
const router = express.Router();


router.get('/threads' , verifyUser , getAllThreads);
router.get('/thread/:threadId' , verifyUser , getThread);
router.delete('/thread/:threadId' , verifyUser , deleteThread);
router.post('/chat/:threadId' , verifyUser , chat);


export default router;