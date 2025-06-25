import { Request, Response } from "express"
import { createUsuario } from "../src/controllers/UsuarioController"
import UsuarioModel from "../src/models/UsuarioModel"
import { cpf } from "cpf-cnpj-validator"

jest.mock("../src/models/UsuarioModel")
jest.mock("cpf-cnpj-validator")

describe("Testes de cadastro de usuário", () => {
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        req = { body: {} }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test("Erro 400 porque todos os campos são obrigatórios", async () => {
        await createUsuario(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Todos os campos são obrigatórios" })
    })

    test("Erro 400 porque o CPF é inválido", async () => {
        req.body = { nome: "Milena", cpfUsuario: "12345678901", email: "milena@gmail.com", senha: "SenhaForte123@" };
        (cpf.isValid as jest.Mock).mockReturnValue(false) // Simula CPF inválido

        await createUsuario(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "CPF inválido ou não existe" })
    })

    test("Erro 400 porque o e-mail é inválido", async () => {
        req.body = { nome: "Milena", cpfUsuario: "12345678901", email: "emailinvalido", senha: "SenhaForte123" };
        (cpf.isValid as jest.Mock).mockReturnValue(true);

        await createUsuario(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Email inválido" })
    })

    test("Erro 400 porque a senha é muito fraca", async () => {
        req.body = { nome: "Milena", cpfUsuario: "12345678901", email: "milena@gmail.com", senha: "123" };

        (cpf.isValid as jest.Mock).mockReturnValue(true);
        (UsuarioModel.validarNivelSenha as jest.Mock).mockReturnValue({ valida: false, requisitos: "A senha deve ter pelo menos 8 caracteres." });

        await createUsuario(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ 
            error: "Senha muito fraca",
            detalhes: "A senha deve ter pelo menos 8 caracteres."
        })
    })

    test("Cadastro de usuário realizado com sucesso", async () => {
        req.body = { nome: "Milena", cpfUsuario: "12345678901", email: "milena@gmail.com", senha: "SenhaForte123@" };

        (cpf.isValid as jest.Mock).mockReturnValue(true);
        (UsuarioModel.validarNivelSenha as jest.Mock).mockReturnValue({ valida: true }); // Simula senha válida
        (UsuarioModel.create as jest.Mock).mockResolvedValue(req.body); // Simula criação do usuário

        await createUsuario(req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(req.body)
    })
})