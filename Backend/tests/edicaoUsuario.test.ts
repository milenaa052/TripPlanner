import { Request, Response } from "express"
import { updateUsuario } from "../src/controllers/UsuarioController"
import UsuarioModel from "../src/models/UsuarioModel"
import * as cpfValidator from "cpf-cnpj-validator"

jest.mock("../src/models/UsuarioModel")
jest.mock("cpf-cnpj-validator", () => ({
    cpf: {
        isValid: jest.fn()
    }
}))

describe("Testes de edição de usuário", () => {
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        req = {
            params: { id: "1" },
            body: {
                usuario: {
                    idUsuario: 1 
                }
            }
        } as Request<{ id: string }>

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        cpfValidator.cpf.isValid = jest.fn();
    })

    test("Erro 403 porque o usuário não tem permissão para editar", async () => {
        req.body.usuario.idUsuario = 2 // Simula outro usuário

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({ error: "Você não tem permissão para editar este usuário" })
    })

    test("Erro 400 porque todos os campos são obrigatórios", async () => {
        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "Todos os campos são obrigatórios" })
    })

    test("Erro 404 porque o usuário não foi encontrado", async () => {
        req.body = {
            usuario: { idUsuario: 1 },
            nome: "Milena", cpfUsuario: "12345678901", senha: "SenhaForte123@"
        };

        (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(null) // Simula que o usuário não foi encontrado

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: "Usuario não encontrado" })
    })

    test("Erro 400 porque o email não pode ser alterado", async () => {
        req.body = {
            usuario: { idUsuario: 1 },
            nome: "Milena",
            cpfUsuario: "12345678901",
            senha: "SenhaForte123@",
            email: "novoemail@example.com"
        };

        const mockUsuario = {
            nome: "Antigo",
            cpfUsuario: "11111111111",
            senha: "SenhaAntiga123@",
            email: "emailoriginal@example.com",
            save: jest.fn()
        };

        (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(mockUsuario);
        cpfValidator.cpf.isValid = jest.fn().mockReturnValue(true);
        (UsuarioModel.validarNivelSenha as jest.Mock).mockReturnValue({ valida: true });

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: "Não é permitido alterar o email"
        })
    })


    test("Erro 400 porque o CPF é inválido", async () => {
        req.body = {
            usuario: { idUsuario: 1 },
            nome: "Milena", cpfUsuario: "12345678901", senha: "SenhaForte123@"
        };

        (UsuarioModel.findByPk as jest.Mock).mockResolvedValue({
            nome: "",
            cpfUsuario: "",
            senha: "",
            save: jest.fn()
        })

        cpfValidator.cpf.isValid = jest.fn().mockReturnValue(false); // Simula CPF inválido

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: "CPF inválido ou não existe" })
    })

    test("Erro 400 porque a senha é muito fraca", async () => {
        req.body = {
            usuario: { idUsuario: 1 },
            nome: "Milena",
            cpfUsuario: "12345678901",
            senhaAtual: "SenhaAntiga123@",
            novaSenha: "fraca"
        };

        const mockUsuario = {
            nome: "Antigo",
            cpfUsuario: "11111111111",
            senha: "SenhaAntiga123@",
            email: "milena@example.com",
            validarSenha: jest.fn().mockResolvedValue(true),
            save: jest.fn()
        };

        (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(mockUsuario);

        cpfValidator.cpf.isValid = jest.fn().mockReturnValue(true);

        (UsuarioModel.validarNivelSenha as jest.Mock).mockReturnValue({
            valida: false,
            requisitos: "A senha deve ter pelo menos 8 caracteres."
        });

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ 
            error: "Senha muito fraca",
            detalhes: "A senha deve ter pelo menos 8 caracteres."
        })
    })

    test("Atualização de usuário realizado com sucesso", async () => {
        req.body = {
            usuario: { idUsuario: 1 },
            nome: "Milena",
            cpfUsuario: "12345678901",
            senhaAtual: "SenhaAntiga123@",
            novaSenha: "SenhaForte123@"
        };

        const mockUsuario = {
            nome: "Antigo",
            cpfUsuario: "11111111111",
            senha: "SenhaAntiga123@",
            email: "milena@example.com",
            validarSenha: jest.fn().mockResolvedValue(true),
            save: jest.fn()
        };

        (UsuarioModel.findByPk as jest.Mock).mockResolvedValue(mockUsuario);
        cpfValidator.cpf.isValid = jest.fn().mockReturnValue(true);
        (UsuarioModel.validarNivelSenha as jest.Mock).mockReturnValue({ valida: true }); // Simula senha válida

        await updateUsuario(req as Request<{ id: string }>, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            nome: "Milena",
            cpfUsuario: "12345678901",
            senha: "SenhaForte123@"
        }))
    })
})