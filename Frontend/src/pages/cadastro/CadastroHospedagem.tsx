import { useState } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import InputLocal from "../../components/input/InputLocal"

function CadastroHospedagem() {
  const [localHospedagem, setLocalHospedagem] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | null>(null)
  const [dataFim, setDataFim] = useState<Date | null>(null)
  const [gastoTotal, setGastoTotal] = useState("")
  const [mensagemFalha, setMensagemFalha] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const navigate = useNavigate()

  const { id } = useParams()

  const enviarForm = async (e: React.FormEvent) => {
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
        viagemId: Number(id),
      }

      await axios.post("https://tripplanner.local/cadastro-hospedagem", dados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })

      setMensagemSucesso("Hospedagem cadastrada com sucesso!")
      setTimeout(() => {
        navigate(`/info-viagem/${id}`)
      }, 2000)

      setLocalHospedagem("")
      setDataInicio(null)
      setDataFim(null)
      setGastoTotal("")

    } catch (error) {
      console.error("Erro ao realizar o cadastro de Hospedagem", error)
    }
  }

  const manipularDatas = (range: [Date | null, Date | null]) => {
    const [startDate, endDate] = range
    setDataInicio(startDate)
    setDataFim(endDate)
  }

  return (
    <div className="card">
      <h1 className="titulo">Cadastrar Hospedagem</h1>

      <form className="form" onSubmit={enviarForm}>
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
            startDate={dataInicio}
            endDate={dataFim}
            selectsRange
            className="input"
            autoComplete="off"
            placeholderText="dd/mm/yyyy - dd/mm/yyyy"
            dateFormat="dd/MM/yyyy"
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
          <button type="submit" className="salvar">Salvar</button>
        </div>
      </form>

      {mensagemFalha ? <p className="mensagemFalha">{mensagemFalha}</p> : ""}
      {mensagemSucesso ? <p className="mensagemSucesso">{mensagemSucesso}</p> : ""}
    </div>
  )
}

export default CadastroHospedagem