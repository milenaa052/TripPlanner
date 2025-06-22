import { useState } from "react"
import { useNavigate } from "react-router"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import InputLocal from "../../components/input/InputLocal"
import InputDestino from "../../components/input/InputDestino"

function CadastroViagem() {
  const [localOrigem, setLocalOrigem] = useState("")
  const [localDestino, setLocalDestino] = useState("")
  const [codigoPais, setCodigoPais] = useState("")
  const [dataInicio, setDataInicio] = useState<Date | null>(null)
  const [dataFim, setDataFim] = useState<Date | null>(null)
  const [mensagemFalha, setMensagemFalha] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const navigate = useNavigate()

  const enviarForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!localOrigem || !localDestino || !dataInicio || !dataFim) {
      setMensagemFalha("Todos os campos são obrigatórios!")

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

      await axios.post("https://tripplanner.local/cadastro-viagem", dados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })

      setMensagemSucesso("Cadastro realizado com sucesso.")
      setTimeout(() => {
        navigate("/")
      }, 2000)

      setLocalOrigem("")
      setLocalDestino("")
      setCodigoPais("")
      setDataInicio(null)
      setDataFim(null)

    } catch (error) {
      console.error("Erro ao cadastrar viagem", error)
    }
  }

  const manipularDatas = (range: [Date | null, Date | null]) => {
    const [startDate, endDate] = range
    setDataInicio(startDate)
    setDataFim(endDate)
  }

  return (
    <div className="card">
      <h1 className="titulo">Criar Viagem</h1>

      <form className="form" onSubmit={enviarForm}>
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
            startDate={dataInicio}
            endDate={dataFim}
            selectsRange
            className="input"
            autoComplete="off"
            placeholderText="dd/mm/yyyy - dd/mm/yyyy"
            dateFormat="dd/MM/yyyy"
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

export default CadastroViagem