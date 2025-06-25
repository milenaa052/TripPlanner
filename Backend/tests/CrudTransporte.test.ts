import { Request, Response } from "express"
import request from "supertest"
import { updateTransporte, deleteTransporteById } from "../src/controllers/TransporteController"
import TransporteModel from "../src/models/TransporteModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de transportes", () => {
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
        test("Erro 404 ao atualizar transporte inexistente", async () => {
            req.params = { id: "999" }
            req.body = { 
                tipoTransporte: "Carro",
                origemTransporte: "Hotel A",
                destinoTransporte: "Coliseu",
                gastoTransporte: 20,
                dataTransporte: "2023-01-01",
                viagemId: 1
            };

            jest.spyOn(TransporteModel, "findByPk").mockResolvedValue(null)
            
            await updateTransporte(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Transporte não encontrado" })
        })

        test("Erro 404 ao deletar transporte inexistente", async () => {
            jest.spyOn(TransporteModel, "findByPk").mockResolvedValue(null)
            
            await deleteTransporteById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Transporte não encontrado" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /transportes deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/transportes")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /transporte/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/transporte/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("POST /cadastro-transporte deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .post("/cadastro-transporte")
                .send({ 
                    tipoTransporte: "Carro",
                    origemTransporte: "Hotel A",
                    destinoTransporte: "Coliseu",
                    gastoTransporte: 20,
                    dataTransporte: "2023-01-01",
                    viagemId: 1
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /transporte/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/transporte/1")
                .send({ 
                    tipoTransporte: "Carro",
                    origemTransporte: "Hotel A",
                    destinoTransporte: "Coliseu",
                    gastoTransporte: 20,
                    dataTransporte: "2023-01-01",
                    viagemId: 1
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /transporte/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/transporte/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})