import { Request, Response } from "express"
import { loginUsuario } from "../src/controllers/loginController"
import UsuarioModel from "../src/models/UsuarioModel"
import { gerarToken } from "../src/utils/jwt"

jest.mock("../src/models/UsuarioModel")
jest.mock("../src/utils/jwt")

describe("Testes de autenticação do usuário", () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
  })

  test("Erro 400 porque não encontrou o email ou senha", async () => {
    await loginUsuario(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Email e senha são obrigatórios" })
  })

  test("Erro 400 porque o formato do email é inválido", async () => {
    req.body = { email: "emailinvalido", senha: "12345" }
    await loginUsuario(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: "Formato de e-mail inválido" })
  })

  test("Erro 404 porque o usuário não foi encontrado", async () => {
    req.body = { email: "milena@gmail.com", senha: "12345" };
    (UsuarioModel.findOne as jest.Mock).mockResolvedValue(null) // Simula que o usuário não foi encontrado

    await loginUsuario(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: "Usuário não encontrado" })
  })

  test("Erro 401 porque a senha é inválida", async () => {
    req.body = { email: "milena@gmail.com", senha: "12345" }
    const mockUser  = {
      validarSenha: jest.fn().mockResolvedValue(false) // Simula que a senha é inválida
    };

    (UsuarioModel.findOne as jest.Mock).mockResolvedValue(mockUser)
    await loginUsuario(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" })
  })

  test("Login realizado com sucesso", async () => {
    req.body = { email: "milena@gmail.com", senha: "12345" }
    const mockUser  = {
      idUsuario: 1,
      nome: "Milena",
      cpfUsuario: "12345678901",
      email: "milena@gmail.com",
      validarSenha: jest.fn().mockResolvedValue(true) // Simula que a senha é válida
    };

    (UsuarioModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (gerarToken as jest.Mock).mockReturnValue("token123") // Simula a geração de um token

    await loginUsuario(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Login realizado com sucesso",
      token: "token123",
      usuario: {
        id: mockUser .idUsuario,
        nome: mockUser .nome,
        cpfUsuario: mockUser .cpfUsuario,
        email: mockUser .email
      }
    })
  })
})