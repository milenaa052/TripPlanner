import { Request, Response } from "express"
import ViagemModel from "../models/ViagemModel"

export const getViagens = async (req: Request, res: Response) => {
    const idUsuario = req.body.usuario.idUsuario

    const viagens = await ViagemModel.findAll({
        where: {
            usuarioId: idUsuario
        }
    })
    return res.status(200).send(viagens)
}

export const getViagemById = async (req: Request<{id: string}>, res: Response) => {
    const viagens = await ViagemModel.findByPk(req.params.id)
    return res.status(200).json(viagens)
}

export const createViagem = async (req: Request, res: Response) => {
    try {
        const { localOrigem, localDestino, codigoPais, dataInicial, dataFinal } = req.body

        if(!localOrigem || !localDestino || !codigoPais || !dataInicial || !dataFinal) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const idUsuario = req.body.usuario.idUsuario
        if (!idUsuario) {
            return res.status(401).json({ error: "Usuário não autenticado" })
        }

        const viagem = await ViagemModel.create({ 
            localOrigem, 
            localDestino,
            codigoPais,
            dataInicial, 
            dataFinal,
            usuarioId: idUsuario
        })
        
        return res.status(201).json(viagem)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const updateViagem = async (req: Request<{id: string}>, res: Response) => {
    try {
        const { localOrigem, localDestino, codigoPais, dataInicial, dataFinal } = req.body

        if(!localOrigem || !localDestino || !codigoPais || !dataInicial || !dataFinal) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const idUsuario = req.body.usuario.idUsuario
        if (!idUsuario) {
            return res.status(401).json({ error: "Usuário não autenticado" })
        }

        const viagem = await ViagemModel.findByPk(req.params.id)

        if(!viagem) {
            return res.status(404)
                .json({error: "Viagem não encontrada"})
        }

        viagem.localOrigem = localOrigem
        viagem.localDestino = localDestino
        viagem.codigoPais = codigoPais
        viagem.dataInicial = dataInicial
        viagem.dataFinal = dataFinal
        viagem.usuarioId = idUsuario
        
        await viagem.save()
        return res.status(200).json(viagem)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const deleteViagemById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const viagem = await ViagemModel.findByPk(req.params.id)
        
        if(!viagem) {
            return res.status(404)
                .json({error: "Viagem não encontrada"})
        }

        await viagem.destroy()
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}