import express from "express"
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuarioById } from "../controllers/UsuarioController"
import { authMiddleware } from "../middleware/authMiddleware"
 
const router = express.Router()

router.post("/cadastro-usuario", createUsuario)

router.get("/usuarios", authMiddleware, getUsuarios)
router.get("/usuario/:id", authMiddleware, getUsuarioById)
router.put("/usuario/:id", authMiddleware, updateUsuario)
router.delete("/usuario/:id", authMiddleware, deleteUsuarioById)

export default router