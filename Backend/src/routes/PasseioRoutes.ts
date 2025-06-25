import express from "express"
import { createPasseio, deletePasseioById, getPasseioById, getPasseios, updatePasseio } from "../controllers/PasseioController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/passeios", authMiddleware, getPasseios)
router.get("/passeio/:id", authMiddleware, getPasseioById)
router.post("/cadastro-passeio", authMiddleware, createPasseio)
router.put("/passeio/:id", authMiddleware, updatePasseio)
router.delete("/passeio/:id", authMiddleware, deletePasseioById)

export default router