import { Request, Response } from "express"
import request from "supertest"
import { updateViagem, deleteViagemById } from "../src/controllers/ViagemController"
import ViagemModel from "../src/models/ViagemModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de viagens", () => {
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
        test("Erro 404 ao atualizar viagem inexistente", async () => {
            req.params = { id: "999" }
            req.body = { 
                localOrigem: "Campo Mourão",
                localDestino: "Roma",
                codigoPais: "IT",
                dataInicial: "2023-01-01",
                dataFinal: "2023-01-10", 
                usuario: {
                    idUsuario: 1 
                } 
            };

            jest.spyOn(ViagemModel, "findByPk").mockResolvedValue(null)
            
            await updateViagem(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Viagem não encontrada" })
        })

        test("Erro 404 ao deletar viagem inexistente", async () => {
            jest.spyOn(ViagemModel, "findByPk").mockResolvedValue(null)
            
            await deleteViagemById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Viagem não encontrada" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /viagens deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/viagens")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /viagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/viagem/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("POST /cadastro-viagem deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .post("/cadastro-viagem")
                .send({ 
                    localOrigem: "Campo Mourão",
                    localDestino: "Roma",
                    codigoPais: "IT",
                    dataInicial: "2023-01-01",
                    dataFinal: "2023-01-10", 
                    usuarioId: 1  
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /viagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/viagem/1")
                .send({ 
                    localOrigem: "Campo Mourão",
                    localDestino: "Atenas",
                    codigoPais: "GR",
                    dataInicial: "2023-01-01",
                    dataFinal: "2023-01-10", 
                    usuarioId: 1 
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /viagem/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/despesa/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})