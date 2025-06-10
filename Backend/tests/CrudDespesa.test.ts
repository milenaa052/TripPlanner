import { Request, Response } from "express"
import request from "supertest"
import { updateDespesa, deleteDespesaById } from "../src/controllers/DespesaController"
import DespesaModel from "../src/models/DespesaModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de despesas", () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: jest.Mock

    beforeEach(() => {
        req = { 
            body: {},
            params: {},
            query: {},
            headers: {}
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        }
        next = jest.fn()

        jest.clearAllMocks()
    })

    afterAll(async () => {
        await sequelize.close()
    })

    describe("Testes de validação", () => {
        test("Erro 404 ao atualizar despesa inexistente", async () => {
            req.params = { id: "999" }
            req.body = { 
                tipoDespesa: "Transporte", 
                gasto: 100, 
                dataDespesa: "2023-01-01", 
                viagemId: 1 
            };

            (DespesaModel.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null)
            
            await updateDespesa(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Despesa não encontrada" })
        })

        test("Erro 404 ao deletar despesa inexistente", async () => {
            (DespesaModel.findByPk as jest.Mock) = jest.fn().mockResolvedValue(null)
            
            await deleteDespesaById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Despesa não encontrada" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /despesas deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/despesas")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /despesa/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/despesa/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("POST /cadastro-despesa deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .post("/cadastro-despesa")
                .send({ tipoDespesa: "Transporte", gasto: 100 })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /despesa/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/despesa/1")
                .send({ tipoDespesa: "Transporte", gasto: 150 })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /despesa/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/despesa/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})