import { Request, Response } from "express"
import request from "supertest"
import { updateHospedagem, deleteHospedagemById } from "../src/controllers/HospedagemController"
import HospedagemModel from "../src/models/HospedagemModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de hospedagens", () => {
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
        test("Erro 404 ao atualizar hospedagem inexistente", async () => {
            req.params = { id: "999" }
            req.body = { 
                localHospedagem: "Hotel A",
                dataCheckin: "2023-01-01",
                dataCheckout: "2023-01-10",
                gastoTotal: 800,
                viagemId: 1
            };

            jest.spyOn(HospedagemModel, "findByPk").mockResolvedValue(null)
            
            await updateHospedagem(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Hospedagem não encontrada" })
        })

        test("Erro 404 ao deletar hospedagem inexistente", async () => {
            jest.spyOn(HospedagemModel, "findByPk").mockResolvedValue(null)
            
            await deleteHospedagemById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Hospedagem não encontrada" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /hospedagens deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/hospedagens")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /hospedagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/hospedagem/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("POST /cadastro-hospedagem deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .post("/cadastro-hospedagem")
                .send({ 
                    localHospedagem: "Hotel A",
                    dataCheckin: "2023-01-01",
                    dataCheckout: "2023-01-10",
                    gastoTotal: 800,
                    viagemId: 1  
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /hospedagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/hospedagem/1")
                .send({ 
                    localHospedagem: "Hotel A",
                    dataCheckin: "2023-01-01",
                    dataCheckout: "2023-01-10",
                    gastoTotal: 800,
                    viagemId: 1
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /hospedagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/hospedagem/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})