import { useState } from "react"
import { useParams, useLocation } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import ConfirmaExclusao from "./ConfirmaExclusao"
import InputLocal from "../input/InputLocal"

interface PasseioProps {
    idPasseio: number
    dataPasseio: string
    localPasseio: string
    horaInicial: string
    horaFinal: string
    gastoPasseio: number
    viagemId: number
}

interface ModalPasseioProps {
    passeio: PasseioProps
    onDelete: (idPasseio: number) => void
    onClose: () => void
    onUpdate: () => void
}

function ModalPasseio({ passeio, onDelete, onClose, onUpdate }: ModalPasseioProps) {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const [dataPasseio, setDataPasseio] = useState(queryParams.get("data") || passeio.dataPasseio)
    const [localPasseio, setLocalPasseio] = useState(passeio.localPasseio)
    const [horaInicial, setHoraInicial] = useState(passeio.horaInicial)
    const [horaFinal, setHoraFinal] = useState(passeio.horaFinal)
    const [gastoPasseio, setGastoPasseio] = useState(passeio.gastoPasseio.toString())
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

    const { id } = useParams()

    const formatarHora = (hora: string) => {
        if (hora.length <= 5) {
            return `${hora}:00`;
        }
        return hora;
    };

    const atualizarPasseio = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!localPasseio || !horaInicial || !horaFinal|| !gastoPasseio) {
            setMensagemFalha("Todos os campos são obrigatórios")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        try {
            const dados = {
                dataPasseio: dataPasseio,
                localPasseio: localPasseio,
                horaInicial: formatarHora(horaInicial),
                horaFinal: formatarHora(horaFinal),
                gastoPasseio: Number(gastoPasseio),
                viagemId: Number(id)
            }

            await axios.put(`/api/passeio/${passeio.idPasseio}`, dados, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            setMensagemSucesso("Passeio atualizado com sucesso!")

            onUpdate()
            setTimeout(() => {
                onClose()
            }, 1500)

            setDataPasseio("")

        } catch (error) {
            console.error("Erro ao atualizar o passeio", error)
        }
    }

    return (
        <div className="card">
            <form className="form" onSubmit={atualizarPasseio}>
                <div className="campos">
                    <label htmlFor="localPasseio" className="label">Local</label>
                    <InputLocal 
                        local={localPasseio} 
                        setLocal={setLocalPasseio} 
                        className="input" 
                    />
                </div>
                
                <div className="camposHora">
                    <div className="camp">
                        <label htmlFor="horaInicial" className="label">Horário Inicial</label>
                        <input 
                            type="time" 
                            id="horaInicial" 
                            name="horaInicial" 
                            className="input" 
                            value={horaInicial} 
                            onChange={(e) => setHoraInicial(e.target.value)} 
                            placeholder="Insira o horário de início"
                        />
                    </div>

                    <div className="camp">
                        <label htmlFor="horaFinal" className="label">Horário Final</label>
                        <input 
                            type="time" 
                            id="horaFinal" 
                            name="horaFinal" 
                            className="input" 
                            value={horaFinal} 
                            onChange={(e) => setHoraFinal(e.target.value)} 
                            placeholder="Insira o horário final"
                        />
                    </div>
                </div>

                <div className="campos">
                    <label htmlFor="gasto" className="label">Gasto</label>
                    <input 
                        type="number" 
                        id="gasto" 
                        name="gasto" 
                        className="input" 
                        value={gastoPasseio} 
                        onChange={(e) => setGastoPasseio(e.target.value)} 
                        placeholder="Insira o gasto do passeio"
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
                        onDelete(passeio.idPasseio)
                        onClose()
                    }}
                />
            )}
      </div>
    )
}

export default ModalPasseio