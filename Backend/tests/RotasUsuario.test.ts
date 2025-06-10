import { Request, Response } from "express"
import request from "supertest"
import { deleteUsuarioById } from "../src/controllers/UsuarioController"
import UsuarioModel from "../src/models/UsuarioModel"
import app from "../src/app"
import sequelize from "../src/config/database"

describe("Testes das rotas de usuario", () => {
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
        test("Erro 404 ao deletar usuario inexistente", async () => {
            jest.spyOn(UsuarioModel, "findByPk").mockResolvedValue(null)
            
            await deleteUsuarioById(req as Request<{ id: string }>, res as Response)
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ error: "Usuario não encontrado" })
        })
    })

    describe("Testes de autenticação nas rotas", () => {
        // Mock para simular middleware de autenticação não autenticado
        const unauthenticatedAuthMiddleware = jest.fn((req, res, next) => {
            next()
        })

        test("GET /usuarios deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/usuarios")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("GET /usuario/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).get("/usuario/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("PUT /usuario/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app)
                .put("/usuario/1")
                .send({ 
                    nome: "Milena",
                    cpfUsuario: "12345678910",
                    email: "milena@gmail.com",
                    senha: "SenhaForte@123",
                })
            
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })

        test("DELETE /usuario/:id deve exigir autenticação", async () => {
            jest.mock("../src/middleware/authMiddleware", () => ({
                authMiddleware: unauthenticatedAuthMiddleware
            }))

            const response = await request(app).delete("/usuario/1")
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("Acesso não autorizado")
        })
    })
})