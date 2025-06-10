import { Request, Response } from "express"
import request from "supertest"
import { updatePasseio, deletePasseioById } from "../src/controllers/PasseioController"
import PasseioModel from "../src/models/PasseioModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de passeios", () => {
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
        test("Erro 404 ao atualizar passeio inexistente", async () => {
            req.params = { id: "999" }
            req.body = { 
                dataPasseio: "2023-01-01",
                localPasseio: "Coliseu",
                horaInicial: "08:00",
                horaFinal: "10:00",
                gastoPasseio: 25,
                viagemId: 1
            };

            jest.spyOn(PasseioModel, "findByPk").mockResolvedValue(null)
            
            await updatePasseio(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Passeio não encontrado" })
        })

        test("Erro 404 ao deletar passeio inexistente", async () => {
            jest.spyOn(PasseioModel, "findByPk").mockResolvedValue(null)
            
            await deletePasseioById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Passeio não encontrado" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /passeios deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/passeios")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /passeio/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/passeio/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("POST /cadastro-passeio deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .post("/cadastro-passeio")
                .send({ 
                    dataPasseio: "2023-01-01",
                    localPasseio: "Coliseu",
                    horaInicial: "08:00",
                    horaFinal: "10:00",
                    gastoPasseio: 25,
                    viagemId: 1
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /passeio/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/passeio/1")
                .send({ 
                    dataPasseio: "2023-01-01",
                    localPasseio: "Coliseu",
                    horaInicial: "08:00",
                    horaFinal: "10:00",
                    gastoPasseio: 25,
                    viagemId: 1
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /passeio/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/passeio/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})