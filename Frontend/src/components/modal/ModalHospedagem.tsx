import { useState } from "react"
import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import ConfirmaExclusao from "./ConfirmaExclusao"
import InputLocal from "../input/InputLocal"

interface HospedagemProps {
    idHospedagem: number
    localHospedagem: string
    dataCheckin: string
    dataCheckout: string
    gastoTotal: number
    viagemId: number
}

interface ModalHospedagemProps {
    hospedagem: HospedagemProps
    onDelete: (idHospedagem: number) => void
    onClose: () => void
    onUpdate: () => void
}

function ModalHospedagem({ hospedagem, onDelete, onClose, onUpdate }: ModalHospedagemProps) {
    const [localHospedagem, setLocalHospedagem] = useState(hospedagem.localHospedagem)
    const [dataInicio, setDataInicio] = useState<Date | null>(new Date(hospedagem.dataCheckin))
    const [dataFim, setDataFim] = useState<Date | null>(new Date(hospedagem.dataCheckout))
    const [gastoTotal, setGastoTotal] = useState(hospedagem.gastoTotal.toString())
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

    const { id } = useParams()

    const manipularDatas = (range: [Date | null, Date | null]) => {
        const [startDate, endDate] = range
        setDataInicio(startDate)
        setDataFim(endDate)
    }

    const atualizarHospedagem = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!dataInicio || !dataFim || !localHospedagem || !gastoTotal) {
            setMensagemFalha("Todos os campos são obrigatórios")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        try {
            const dados = {
                localHospedagem: localHospedagem,
                dataCheckin: dataInicio.toISOString().split("T")[0],
                dataCheckout: dataFim.toISOString().split("T")[0],
                gastoTotal: Number(gastoTotal),
                viagemId: Number(id)
            }

            await axios.put(`/api/hospedagem/${hospedagem.idHospedagem}`, dados, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            setMensagemSucesso("Hospedagem atualizada com sucesso!")

            onUpdate()
            setTimeout(() => {
                onClose()
            }, 1500)

        } catch (error) {
            console.error("Erro ao atualizar a Hospedagem", error)
        }
    }

    return (
        <div className="card">
            <form className="form" onSubmit={atualizarHospedagem}>
                <div className="campos">
                    <label htmlFor="hotel" className="label">Hotel / Airnb</label>
                    <InputLocal 
                        local={localHospedagem} 
                        setLocal={setLocalHospedagem} 
                        className="input" 
                    />
                </div>
                
                <div className="campos">
                    <label htmlFor="data" className="label">Data de chekin e chekout</label>
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

                <div className="campos">
                    <label htmlFor="gasto" className="label">Gasto Total</label>
                    <input 
                        type="number" 
                        id="gasto" 
                        name="gasto" 
                        className="input" 
                        value={gastoTotal} 
                        onChange={(e) => setGastoTotal(e.target.value)} 
                        placeholder="Insira o gasto total com hospedagem"
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
                        onDelete(hospedagem.idHospedagem)
                        onClose()
                    }}
                />
            )}
      </div>
    )
}

export default ModalHospedagem