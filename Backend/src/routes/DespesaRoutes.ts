import express  from "express"
import { createDespesa, deleteDespesaById, getDespesasByViagem, getDespesasById, updateDespesa } from "../controllers/DespesaController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/despesas", authMiddleware, getDespesasByViagem)
router.get("/despesa/:id", authMiddleware, getDespesasById)
router.post("/cadastro-despesa", authMiddleware, createDespesa)
router.put("/despesa/:id", authMiddleware, updateDespesa)
router.delete("/despesa/:id", authMiddleware, deleteDespesaById)

export default router