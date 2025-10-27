import express from "express";
import { AddUser } from "../Functions/User/AddUser.js";
import { RemoveUser } from "../Functions/User/RemoveUser.js";
import { loginUser } from "../Functions/Login/LoginUser.js";
import { AuthMiddleware } from "../Middleware/auth-middleware.js";
import { HelloUser } from "../Functions/Login/GetUser.js";

const route = express.Router();

route.post("/Cadastro", AddUser);
route.delete("/Cadastro/:id", RemoveUser);
route.post("/login", loginUser);
route.get("/profile", AuthMiddleware, HelloUser);

export default route;