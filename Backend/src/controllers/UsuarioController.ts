import { Request, Response } from "express"
import { cpf } from "cpf-cnpj-validator"
import UsuarioModel from "../models/UsuarioModel"

export const getUsuarios = async (req: Request, res: Response) => {
    const usuarios = await UsuarioModel.findAll()
    return res.status(200).send(usuarios)
}

export const getUsuarioById = async (req: Request<{id: string}>, res: Response) => {
    const usuario = await UsuarioModel.findByPk(req.params.id)
    return res.status(200).json(usuario)
}

export const createUsuario = async (req: Request, res: Response) => {
    try {
        const { nome, cpfUsuario, email, senha } = req.body
    
        if(!nome || !cpfUsuario || !email || !senha) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        if (!cpf.isValid(cpfUsuario)) {
            return res.status(400)
                .json({error: "CPF inválido ou não existe"})
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            return res.status(400)
                .json({ error: "Email inválido" })
        }

        const validacaoNivelSenha =  UsuarioModel.validarNivelSenha(senha)
        if (!validacaoNivelSenha.valida) {
            return res.status(400).json({ 
                error: "Senha muito fraca",
                detalhes: validacaoNivelSenha.requisitos
            })
        }

        const usuario = await UsuarioModel.create({ 
            nome, 
            cpfUsuario, 
            email, 
            senha 
        })

        return res.status(201).json(usuario)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const updateUsuario = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const usuarioLogado = req.body.usuario.idUsuario
        const idUsuarioAtualizar = Number(req.params.id)

        if (Number(usuarioLogado) !== idUsuarioAtualizar) {
            return res.status(403).json({ error: "Você não tem permissão para editar este usuário" })
        }

        const { nome, cpfUsuario, email, senhaAtual, novaSenha } = req.body

        if(!nome || !cpfUsuario) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const usuario = await UsuarioModel.findByPk(req.params.id)

        if(!usuario) {
            return res.status(404)
                .json({error: "Usuario não encontrado"})
        }

        if (email && email !== usuario.email) {
            return res.status(400).json({ message: "Não é permitido alterar o email" })
        }

        if (!cpf.isValid(cpfUsuario)) {
            return res.status(400)
                .json({error: "CPF inválido ou não existe"})
        }

        usuario.nome = nome
        usuario.cpfUsuario = cpfUsuario

        if (senhaAtual && novaSenha) {
            const senhaCorreta = await usuario.validarSenha(senhaAtual)

            if (!senhaCorreta) {
                return res.status(401).json({ error: "Senha atual incorreta" })
            }

            const validacaoNivelSenha = UsuarioModel.validarNivelSenha(novaSenha)

            if (!validacaoNivelSenha.valida) {
                return res.status(400).json({ 
                    error: "Senha muito fraca",
                    detalhes: validacaoNivelSenha.requisitos
                })
            }

            usuario.senha = novaSenha
        }

        await usuario.save()

        return res.status(200).json(usuario)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const deleteUsuarioById = async (req: Request<{ id: string}>, res: Response) => {  
    try {
        const usuario = await UsuarioModel.findByPk(req.params.id)
        
        if(!usuario) {
            return res.status(404)
                .json({error: "Usuario não encontrado"})
        }

        await usuario.destroy()
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json("Erro interno no suariovidor " + error)
    }
}