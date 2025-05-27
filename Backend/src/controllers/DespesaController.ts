import { Request, Response } from "express"
import DespesaModel from "../models/DespesaModel"

export const getDespesasByViagem = async (req: Request, res: Response) => {
    try {
        const { viagemId } = req.query

        if (!viagemId) {
            return res.status(400).json({ error: "viagemId é obrigatório" })
        }

        const despesas = await DespesaModel.findAll({
            where: { viagemId: Number(viagemId) }
        })

        return res.status(200).json(despesas)

    } catch (error) {
        console.error("Erro:" + error)
        return res.status(500).json({ error: "Erro interno" })
    }
}

export const getDespesasById = async (req: Request<{id: string}>, res: Response) => {
    const despesa = await DespesaModel.findByPk(req.params.id)
    return res.status(200).json(despesa)
}

export const createDespesa = async (req: Request, res: Response) => {
    try {
        const { tipoDespesa, gasto, dataDespesa, viagemId } = req.body

        if(!tipoDespesa || !gasto || !dataDespesa || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const despesa = await DespesaModel.create({
            tipoDespesa,
            gasto,
            dataDespesa,
            viagemId
        })

        return res.status(201).json(despesa)

    } catch (error) {
        return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const updateDespesa = async (req: Request<{id: string}>, res: Response) => {
    try {
        const { tipoDespesa, gasto, dataDespesa, viagemId } = req.body

        if(!tipoDespesa || !gasto || !dataDespesa || !viagemId) {
            return res.status(400)
                .json({error: "Todos os campos são obrigatórios"})
        }

        const despesa = await DespesaModel.findByPk(req.params.id)

        if(!despesa) {
            return res.status(404)
                .json({error: "Despesa não encontrada"})
        }

        despesa.tipoDespesa = tipoDespesa
        despesa.gasto = gasto
        despesa.dataDespesa = dataDespesa
        despesa.viagemId = viagemId

        await despesa.save()
        return res.status(200).json(despesa)

    } catch (error) {
       return res.status(500).json("Erro interno no servidor " + error)
    }
}

export const deleteDespesaById = async (req: Request<{id: string}>, res: Response) => {
    try {
        const despesa = await DespesaModel.findByPk(req.params.id)

        if(!despesa) {
            return res.status(404)
                .json({error: "Despesa não encontrada"})
        }

        await despesa.destroy() 
        return res.status(204).send()

    } catch (error) {
       return res.status(500).json("Erro interno no servidor " + error)
    }
}