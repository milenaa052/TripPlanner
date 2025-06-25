import express from "express"
import { createHospedagem, deleteHospedagemById, getHospedagemById, getHospedagens, updateHospedagem } from "../controllers/HospedagemController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/hospedagens", authMiddleware, getHospedagens)
router.get("/hospedagem/:id", authMiddleware, getHospedagemById)
router.post("/cadastro-hospedagem", authMiddleware, createHospedagem)
router.put("/hospedagem/:id", authMiddleware, updateHospedagem)
router.delete("/hospedagem/:id", authMiddleware, deleteHospedagemById)

export default router