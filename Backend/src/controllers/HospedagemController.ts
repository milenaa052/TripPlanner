import { Request, Response } from "express"
import HospedagemModel from "../models/HospedagemModel"

export const getHospedagens = async (req: Request, res: Response) => {
    try {
        const { viagemId } = req.query

        if (!viagemId) {
            return res.status(400).json({ error: "viagemId é obrigatório" })
        }

        const hospedagens = await HospedagemModel.findAll({
            where: { viagemId: Number(viagemId) }
        })
        
        return res.status(200).json(hospedagens)

    } catch (error) {
        console.error("Erro:" + error)
        return res.status(500).json({ error: "Erro interno" })
    }
}

export const getHospedagemById = async (req: Request<{id: string}>, res: Response) => {
    const hospedagem = await HospedagemModel.findByPk(req.params.id)
    return res.status(200).json(hospedagem)
}

export const createHospedagem = async (req: Request, res: Response) => {
    try {
        const { 
            localHospedagem, 
            dataCheckin, 
            dataCheckout, 
            gastoTotal, 
            viagemId 
        } = req.body

        if(!localHospedagem || !dataCheckin || !dataCheckout || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const hospedagem = await HospedagemModel.create({
            localHospedagem,
            dataCheckin,
            dataCheckout,
            gastoTotal,
            viagemId
        })

        return res.status(201).json(hospedagem)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const updateHospedagem = async (req: Request<{id: string}>, res: Response) => {
    try {
        const { 
            localHospedagem,
            dataCheckin,
            dataCheckout,
            gastoTotal,
            viagemId
        } = req.body

        if(!localHospedagem || !dataCheckin || !dataCheckout || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const hospedagem = await HospedagemModel.findByPk(req.params.id)

        if(!hospedagem) {
            return res.status(404)
                .json({error: "Hospedagem não encontrada"})
        }

        hospedagem.localHospedagem = localHospedagem
        hospedagem.dataCheckin = dataCheckin
        hospedagem.dataCheckout = dataCheckout
        hospedagem.gastoTotal = gastoTotal
        hospedagem.viagemId = viagemId

        await hospedagem.save()
        return res.status(200).json(hospedagem)

    } catch (error) {
       return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const deleteHospedagemById = async (req: Request<{id: string}>, res: Response) => {
    try {
        const hospedagem = await HospedagemModel.findByPk(req.params.id)

        if(!hospedagem) {
            res.status(404)
                .json({error: "Hospedagem não encontrada"})
        }

        await hospedagem?.destroy()
        return res.status(204).send()

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}