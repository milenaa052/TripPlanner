import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import ModalHospedagem from "../modal/ModalHospedagem"
import MapaLocal from "../mapas/MapaLocal"

interface Hospedagens {
  idHospedagem: number
  localHospedagem: string
  dataCheckin: string
  dataCheckout: string
  gastoTotal: number
  viagemId: number
}

function TelaHospedagem() {
  const [hospedagens, setHospedagens] = useState<Hospedagens[]>([])
  const [idHospedagem, setIdHospedagem] = useState<Hospedagens | null>(null)
  const [modal, setModal] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  const { id } = useParams()

  useEffect(() => {
    carregarHospedagens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarHospedagens = () => {
    axios.get(`https://tripplanner.local/hospedagens/?viagemId=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then((response) => {
      setHospedagens(response.data)
    })
    .catch((error) => {
      console.error("Erro ao buscar hospedagens", error)
    })
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const dia = String(date.getUTCDate()).padStart(2, "0")
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0")
    const ano = date.getUTCFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const deletarHospedagem = (idHospedagem: number) => {
    axios.delete(`https://tripplanner.local/hospedagem/${idHospedagem}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(() => {
      carregarHospedagens()
      setMensagemSucesso("Hospedagem excluída com sucesso!")

      setTimeout(() => {
        setMensagemSucesso("")
      }, 2000)
    })
    .catch((error) => {
      console.error("Erro ao excluir hospedagem", error)
    })
  }

  const abrirModal = (hospedagem: Hospedagens) => {
    setIdHospedagem(hospedagem)
    setModal(true)
  }

  return (
    <div>
      { mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : "" }

      {hospedagens.length > 0 ? (
        hospedagens.map((hospedagens) => (
          <div className="listagens" key={hospedagens.idHospedagem}>
            <div className="textoInfo">
              <h3>{hospedagens.localHospedagem} </h3>
              <p>Checkin: {formatarData(hospedagens.dataCheckin)}</p>
              <p>Checkout: {formatarData(hospedagens.dataCheckout)}</p>
              <p>Gasto Total: {hospedagens.gastoTotal.toFixed(2)}</p>
            </div>

            <div className="mapa">
              <MapaLocal local={hospedagens.localHospedagem} />
            </div>

            <div className="icone">
              <button onClick={() => abrirModal(hospedagens)}>
                <FontAwesomeIcon icon={faChevronRight} className="icone" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhuma hospedagem cadastrada!</p>
      )}

      <div className="botao">
        <div className="adicionar">
          <a href={`/cadastro-hospedagem/${id}`} className="link">
            <FontAwesomeIcon icon={faPlus} className="icone" />
          </a>
        </div>
      </div>

      {modal && idHospedagem && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ModalHospedagem
              hospedagem={idHospedagem}
              onDelete={deletarHospedagem}
              onClose={() => setModal(false)}
              onUpdate={carregarHospedagens}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TelaHospedagem