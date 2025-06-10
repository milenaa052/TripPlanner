import express from "express"
import { createTransporte, deleteTransporteById, getTransporteById, getTransportes, updateTransporte } from "../controllers/TransporteController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/transportes", authMiddleware, getTransportes)
router.get("/transporte/:id", authMiddleware, getTransporteById)
router.post("/cadastro-transporte", authMiddleware, createTransporte)
router.put("/transporte/:id", authMiddleware, updateTransporte)
router.delete("/transporte/:id", authMiddleware, deleteTransporteById)

export default router