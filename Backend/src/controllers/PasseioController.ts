import { Request, Response } from "express"
import PasseioModel from "../models/PasseioModel"

export const getPasseios = async (req: Request, res: Response) => {
    try {
        const { viagemId } = req.query

        if (!viagemId) {
            return res.status(400).json({ error: "viagemId é obrigatório" })
        }

        const passeios = await PasseioModel.findAll({
            where: { viagemId: Number(viagemId) }
        })

        return res.status(200).json(passeios)

    } catch (error) {
        console.error("Erro:", error)
        return res.status(500).json({ error: "Erro interno no servidor" })
    }
}

export const getPasseioById = async (req: Request<{id: string}>, res: Response) => {
    const passeio = await PasseioModel.findByPk(req.params.id)
    return res.status(200).json(passeio)
}

export const createPasseio = async (req: Request, res: Response) => {
    try {
        const {
            dataPasseio,
            localPasseio,
            horaInicial,
            horaFinal,
            gastoPasseio,
            viagemId
        } = req.body

        if(!dataPasseio || !localPasseio || !horaInicial || !horaFinal || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const passeio = await PasseioModel.create({
            dataPasseio,
            localPasseio,
            horaInicial,
            horaFinal,
            gastoPasseio,
            viagemId
        })

        return res.status(201).json(passeio)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const updatePasseio = async (req: Request<{id: string}>, res: Response) => {
    try {
        const { 
            dataPasseio,
            localPasseio,
            horaInicial,
            horaFinal,
            gastoPasseio,
            viagemId
        } = req.body

        if(!dataPasseio || !localPasseio || !horaInicial || !horaFinal || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const passeio = await PasseioModel.findByPk(req.params.id)

        if(!passeio) {
            return res.status(404)
                .json({error: "Passeio não encontrado"})
        }

        passeio.dataPasseio = dataPasseio
        passeio.localPasseio = localPasseio
        passeio.horaInicial = horaInicial
        passeio.horaFinal = horaFinal
        passeio.gastoPasseio = gastoPasseio
        passeio.viagemId = viagemId

        await passeio.save()
        return res.status(200).json(passeio)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const deletePasseioById = async (req: Request<{id: string}>, res: Response) => {
    try{
        const passeio = await PasseioModel.findByPk(req.params.id)

        if(!passeio) {
            return res.status(404)
                .json({error: "Passeio não encontrado"})
        }

        await passeio.destroy()
        return res.status(204).send()
        
    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}