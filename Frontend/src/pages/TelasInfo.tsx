import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router"
import axios from "axios"
import TelaHospedagem from "../components/telas/TelaHospedagem"
import TelaTransporte from "../components/telas/TelaTransporte"
import TelaPasseios from "../components/telas/TelaPasseios"
import TelaDespesas from "../components/telas/TelaDespesas"
import ModalViagem from "../components/modal/ModalViagem"

interface Viagem {
  idViagem: number
  localOrigem: string
  localDestino: string
  codigoPais: string
  dataInicial: string
  dataFinal: string
  usuarioId: number
}

function TelasInfo() {
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [idViagem, setIdViagem] = useState<Viagem | null>(null)
  const [modal, setModal] = useState(false)
  const [tela, setTela] = useState("Hospedagem")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const navigate = useNavigate()

  const { id } = useParams()

  useEffect(() => {
    carregarViagem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarViagem = () => {{
    axios.get(`http://localhost:3000/viagem/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then((response) => {
      setViagem(response.data)
    })
    .catch((error) => {
      console.error("Erro ao buscar viagem", error)
    })
  }}

  const formatarData = (data: string) => {
    const date = new Date(data)
    const dia = String(date.getUTCDate()).padStart(2, "0")
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0")
    const ano = date.getUTCFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const abrirModal = (viagem: Viagem) => {
    setIdViagem(viagem)
    setModal(true)
  }

  const deletarViagem = (idViagem: number) => {
    axios.delete(`http://localhost:3000/viagem/${idViagem}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(() => {
      carregarViagem()
      setMensagemSucesso("Viagem excluída com sucesso!")

      setTimeout(() => {
        setMensagemSucesso("")
        navigate("/")
      }, 2000)
    })
    .catch((error) => {
      console.error("Erro ao excluir Viagem", error)
    })
  }

  return (
    <div className="planoViagem">
      <h1 className="titulo">
        {viagem ? `${viagem.localDestino}, ${viagem.codigoPais.toUpperCase()}` : ""}
        <button onClick={() => viagem && abrirModal(viagem)}>
          <FontAwesomeIcon icon={faPenToSquare} className="icone" />
        </button>
      </h1>

      <p>
        <FontAwesomeIcon icon={faCalendarDays} className="icone" />
        {viagem ? `${formatarData(viagem.dataInicial)} - ${formatarData(viagem.dataFinal)}` : ""}
      </p>

      { mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : "" }

      <div className="telasInfo">
        <button 
          className={`opcao ${tela === "Hospedagem" ? "ativo" : ""}`} 
          onClick={() => setTela("Hospedagem")}
        >
          Hospedagem
        </button>

        <button 
          className={`opcao ${tela === "Transporte" ? "ativo" : ""}`} 
          onClick={() => setTela("Transporte")}
        >
          Transporte
        </button>

        <button 
          className={`opcao ${tela === "Passeios" ? "ativo" : ""}`} 
          onClick={() => setTela("Passeios")}
        >
          Passeios
        </button>

        <button 
          className={`opcao ${tela === "Despesas" ? "ativo" : ""}`} 
          onClick={() => setTela("Despesas")}
        >
          Despesas
        </button>
      </div>

      {tela === "Hospedagem" && <TelaHospedagem />}
      {tela === "Transporte" && <TelaTransporte />}
      {tela === "Passeios" && <TelaPasseios />}
      {tela === "Despesas" && <TelaDespesas />}

      {modal && idViagem && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ModalViagem
              viagem={idViagem}
              onDelete={deletarViagem}
              onClose={() => setModal(false)}
              onUpdate={carregarViagem}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TelasInfo