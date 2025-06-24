import { useState } from "react"
import { useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import ConfirmaExclusao from "./ConfirmaExclusao"

interface DespesaProps {
  idDespesa: number
  tipoDespesa: string
  gasto: number
  dataDespesa: string
  viagemId: number
}

interface ModalDespesaProps {
  despesa: DespesaProps
  onDelete: (idDespesa: number) => void
  onClose: () => void
  onUpdate: () => void
}

function ModalDespesa({ despesa, onDelete, onClose, onUpdate }: ModalDespesaProps) {
  const [tipoDespesa, setTipoDespesa] = useState(despesa.tipoDespesa)
  const [gasto, setGasto] = useState(despesa.gasto.toString())
  const [dataDespesa, setDataDespesa] = useState(despesa.dataDespesa)
  const [mensagemFalha, setMensagemFalha] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  const { id } = useParams()

  const atualizarDespesa = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tipoDespesa || !gasto || !dataDespesa) {
      setMensagemFalha("Todos os campos são obrigatórios")

      setTimeout(() => {
        setMensagemFalha("")
      }, 1500)

      return
    }

    try {
      const dados = {
        tipoDespesa: tipoDespesa,
        gasto: Number(gasto),
        dataDespesa: dataDespesa,
        viagemId: Number(id),
      }

      await axios.put(`/api/despesa/${despesa.idDespesa}`, dados, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      )

      setMensagemSucesso("Despesa atualizada com sucesso!")

      onUpdate()
      setTimeout(() => {
        onClose()
      }, 1500)

    } catch (error) {
      console.error("Erro ao atualizar a Despesa", error)
    }
  }

  const formatarData = (data: string) => {
    return data.slice(0, 10)
  }

  return (
    <div className="card">
      <form className="form" onSubmit={atualizarDespesa}>
        <div className="campos">
          <label htmlFor="tipoDespesa" className="label">Tipo de Despesa</label>
          <input
            type="text"
            id="tipoDespesa"
            name="tipoDespesa"
            className="input"
            value={tipoDespesa}
            onChange={(e) => setTipoDespesa(e.target.value)}
            placeholder="Insira a categoria da despesa. Ex: Alimentação"
          />
        </div>

        <div className="campos">
          <label htmlFor="gasto" className="label">Gasto</label>
          <input
            type="number"
            id="gasto"
            name="gasto"
            className="input"
            value={gasto}
            onChange={(e) => setGasto(e.target.value)}
            placeholder="Insira o gasto do passeio"
          />
        </div>

        <div className="campos">
          <label htmlFor="data" className="label">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            className="input"
            value={formatarData(dataDespesa)}
            onChange={(e) => setDataDespesa(e.target.value)}
            placeholder="Insira a data da despesa"
          />
        </div>

        <div className="submit">
          <button type="button" className="excluir" onClick={() => setMostrarConfirmacao(true)}>
            <FontAwesomeIcon icon={faTrashCan} className="icone" />
          </button>

          <button type="submit" className="salvar">Salvar</button>
        </div>
      </form>

      { mensagemFalha ? <p className="mensagemFalha">{mensagemFalha}</p> : "" }
      { mensagemSucesso ? <p className="mensagemSucesso">{mensagemSucesso}</p> : "" }

      {mostrarConfirmacao && (
        <ConfirmaExclusao
          onClose={() => setMostrarConfirmacao(false)}
          onConfirm={() => {
            onDelete(despesa.idDespesa)
            onClose()
          }}
        />
      )}
    </div>
  )
}

export default ModalDespesa