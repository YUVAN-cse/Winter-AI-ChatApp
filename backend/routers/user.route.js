import {register , login , logout , refresh , deleteUser} from "../controllers/auth.controllers.js";
import {getAllUsers , getProfile} from "../controllers/auth.controllers.js";
import {verifyUser} from "../middlewares/auth.middleware.js";
import express from "express";
const router = express.Router();

router.post('/register' , register);
router.post('/login' , login);
router.post('/refresh' , refresh);



router.post('/logout' , verifyUser , logout);
router.post('/delete' , verifyUser , deleteUser);
router.get('/users' , verifyUser , getAllUsers);
router.get('/profile' , verifyUser , getProfile);


export default router;