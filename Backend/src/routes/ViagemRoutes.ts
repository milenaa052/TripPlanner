import express from "express"
import { getViagens, getViagemById, createViagem, updateViagem, deleteViagemById } from "../controllers/ViagemController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/viagens", authMiddleware, getViagens)
router.get("/viagem/:id", authMiddleware, getViagemById)
router.post("/cadastro-viagem", authMiddleware, createViagem)
router.put("/viagem/:id", authMiddleware, updateViagem)
router.delete("/viagem/:id", authMiddleware, deleteViagemById)

export default router