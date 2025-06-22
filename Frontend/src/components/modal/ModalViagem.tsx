import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import ConfirmaExclusao from "./ConfirmaExclusao"
import InputLocal from "../input/InputLocal"
import InputDestino from "../input/InputDestino"

interface ViagemProps {
    idViagem: number
    localOrigem: string
    localDestino: string
    codigoPais: string
    dataInicial: string
    dataFinal: string
    usuarioId: number
  }

interface ModalViagemProps {
    viagem: ViagemProps
    onDelete: (idViagem: number) => void
    onClose: () => void
    onUpdate: () => void
}

function ModalViagem({ viagem, onDelete, onClose, onUpdate }: ModalViagemProps) {
    const [localOrigem, setLocalOrigem] = useState(viagem.localOrigem)
    const [localDestino, setLocalDestino] = useState(viagem.localDestino)
    const [codigoPais, setCodigoPais] = useState(viagem.codigoPais)
    const [dataInicio, setDataInicio] = useState<Date | null>(new Date(viagem.dataInicial))
    const [dataFim, setDataFim] = useState<Date | null>(new Date(viagem.dataFinal))
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

    const manipularDatas = (range: [Date | null, Date | null]) => {
        const [startDate, endDate] = range
        setDataInicio(startDate)
        setDataFim(endDate)
    }

    const atualizarViagem = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!localOrigem || !localDestino || !codigoPais || !dataInicio || !dataFim) {
            setMensagemFalha("Todos os campos são obrigatórios")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        try {
            const dados = {
                localOrigem: localOrigem,
                localDestino: localDestino,
                codigoPais: codigoPais,
                dataInicial: dataInicio.toISOString().split("T")[0],
                dataFinal: dataFim.toISOString().split("T")[0],
            }

            await axios.put(`https://tripplanner.local/viagem/${viagem.idViagem}`, dados, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            setMensagemSucesso("Viagem atualizada com sucesso!")

            onUpdate()
            setTimeout(() => {
                onClose()
            }, 1500)

        } catch (error) {
            console.error("Erro ao atualizar a Viagem", error)
        }
    }

    return (
        <div className="card">
            <form className="form" onSubmit={atualizarViagem}>
                <div className="campos">
                    <label htmlFor="localOrigem" className="label">Local de Origem</label>
                    <InputLocal
                        local={localOrigem}
                        setLocal={setLocalOrigem}
                        className="input"
                    />
                </div>

                <div className="campos">
                    <label htmlFor="localDestino" className="label">Destino</label>
                    <InputDestino
                        localDestino={localDestino}
                        setLocalDestino={setLocalDestino}
                        setCodigoPais={setCodigoPais}
                        className="input"
                    />
                </div>

                <div className="campos">
                    <label htmlFor="data" className="label">Data de início e fim da viagem</label>
                    <DatePicker 
                        selected={dataInicio} 
                        onChange={manipularDatas} 
                        id="data" 
                        name="data"
                        startDate={dataInicio} endDate={dataFim} 
                        selectsRange 
                        className="input" 
                        placeholderText="dd/mm/yyyy - dd/mm/yyyy"
                    />
                </div>

                <div className="submit">
                    <button type="button" className="excluir" onClick={() => setMostrarConfirmacao(true)}>
                        <FontAwesomeIcon icon={faTrashCan} className="icone"/>
                    </button>

                    <button type="submit" className="salvar">Salvar</button>
                </div>
            </form>

            { mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : "" }
            { mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : "" }

            {mostrarConfirmacao && (
                <ConfirmaExclusao 
                    onClose={() => setMostrarConfirmacao(false)}
                    onConfirm={() => {
                        onDelete(viagem.idViagem)
                        onClose()
                    }}
                />
            )}
      </div>
    )
}

export default ModalViagem