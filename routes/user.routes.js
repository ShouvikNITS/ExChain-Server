import express from "express"
import {getUsers, addUser, loginUser} from "../controllers/user.controller.js";
const userRouter = express.Router()

userRouter.get('/all', getUsers);
userRouter.post('/add', addUser);
userRouter.post("/login", loginUser)

export default userRouter;