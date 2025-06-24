import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import ModalTransporte from "../modal/ModalTransporte"
import MapaRotas from "../mapas/MapaRotas"

interface Transporte {
  idTransporte: number
  tipoTransporte: string
  origemTransporte: string
  destinoTransporte: string
  gastoTransporte: number
  dataTransporte: string
  viagemId: number
}

function TelaTransporte() {
  const [transporte, setTransporte] = useState<Transporte[]>([])
  const [idTransporte, setIdTransporte] = useState<Transporte | null>(null)
  const [modal, setModal] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  const { id } = useParams()

  useEffect(() => {
    carregarTransportes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarTransportes = () => {
    axios.get(`/api/transportes/?viagemId=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then((response) => {
      setTransporte(response.data)
    })
    .catch((error) => {
      console.error("Erro ao buscar transportes", error)
    })
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const dia = String(date.getUTCDate()).padStart(2, "0")
    const mes = String(date.getUTCMonth() + 1).padStart(2, "0")
    const ano = date.getUTCFullYear()
    return `${dia}/${mes}/${ano}`
  }

  const deletarTransporte = (idTransporte: number) => {
    axios.delete(`/api/transporte/${idTransporte}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(() => {
      carregarTransportes()
      setMensagemSucesso("Transporte excluído com sucesso!")

      setTimeout(() => {
        setMensagemSucesso("")
      }, 2000)
    })
    .catch((error) => {
      console.error("Erro ao excluir transporte", error)
    })
  }

  const abrirModal = (transporte: Transporte) => {
    setIdTransporte(transporte)
    setModal(true)
  }

  return (
    <div>
      { mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : "" }

      {transporte.length > 0 ? (
        transporte.map((transportes) => (
          <div className="listagens" key={transportes.idTransporte}>
            <div className="textoInfo">
              <h3>{transportes.tipoTransporte}</h3>
              <p>De: {transportes.origemTransporte}</p>
              <p>Até: {transportes.destinoTransporte}</p>
              <p>Gasto: {transportes.gastoTransporte.toFixed(2)}</p>
              <p>Data: {formatarData(transportes.dataTransporte)}</p>
            </div>

            <div className="mapa">
              <MapaRotas
                origem={transportes.origemTransporte}
                destino={transportes.destinoTransporte}
              />
            </div>

            <div className="icone">
              <button onClick={() => abrirModal(transportes)}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Nenhum transporte cadastrado!</p>
      )}

      <div className="botao">
        <div className="adicionar">
          <a href={`/cadastro-transporte/${id}`} className="link">
            <FontAwesomeIcon icon={faPlus} className="icone" />
          </a>
        </div>
      </div>

      {modal && idTransporte && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ModalTransporte
              transporte={idTransporte}
              onDelete={deletarTransporte}
              onClose={() => setModal(false)}
              onUpdate={carregarTransportes}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TelaTransporte