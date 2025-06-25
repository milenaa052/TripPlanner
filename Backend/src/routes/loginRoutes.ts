import express from "express"
import { loginUsuario, usuarioLogado } from "../controllers/loginController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/usuario/perfil", authMiddleware, usuarioLogado)
router.post("/login", loginUsuario)

export default router