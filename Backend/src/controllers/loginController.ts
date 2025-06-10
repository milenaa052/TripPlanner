import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { gerarToken } from "../utils/jwt"
import UsuarioModel from "../models/UsuarioModel"
import dotenv from 'dotenv'

dotenv.config()

export const loginUsuario = async (req: Request, res: Response) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400)
            .json({ error: "Email e senha são obrigatórios" })
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
        return res.status(400)
            .json({ error: "Formato de e-mail inválido" })
    }

    try {
        const usuario = await UsuarioModel.findOne({ where: { email } })

        if (!usuario) {
            return res.status(404)
                .json({ error: "Usuário não encontrado" })
        }

        const senhaValidada = await usuario.validarSenha(senha)

        if (!senhaValidada) {
            return res.status(401)
                .json({ error: "Credenciais inválidas" })
        }

        const token = gerarToken(usuario)

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.idUsuario,
                nome: usuario.nome,
                cpfUsuario: usuario.cpfUsuario,
                email: usuario.email
            }
        })

    } catch (error) {
        console.error("Erro no login:", error)
        return res.status(500).json({ error: "Erro interno no servidor" })
    }
}

export const usuarioLogado = (req: Request, res: Response) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido ou mal formatado" })
    }

    const token = authHeader.split(" ")[1]

    try {
        const segredo = process.env.JWT_SECRETA as string

        const decoded = jwt.verify(token, segredo)

        return res.status(200).json({
            mensagem: "Usuário autenticado com sucesso",
            usuario: decoded
        })
    } catch (error) {
        console.error("Erro ao verificar token:", error)
        return res.status(401).json({ error: "Token inválido ou expirado" })
    }
}