import { useState } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router"
import axios from "axios"
import InputLocal from "../../components/input/InputLocal"

function CadastroTransporte() {
  const [tipoTransporte, setTipoTransporte] = useState("")
  const [origemTransporte, setOrigemTransporte] = useState("")
  const [destinoTransporte, setDestinoTransporte] = useState("")
  const [gastoTransporte, setGastoTransporte] = useState("")
  const [dataTransporte, setDataTransporte] = useState("")
  const [mensagemFalha, setMensagemFalha] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const navigate = useNavigate()

  const { id } = useParams()

  const enviarForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tipoTransporte || !origemTransporte || !destinoTransporte || !gastoTransporte || !dataTransporte) {
      setMensagemFalha("Todos os campos são obrigatórios")

      setTimeout(() => {
        setMensagemFalha("")
      }, 1500)

      return
    }

    try {
      const dados = {
        tipoTransporte: tipoTransporte,
        origemTransporte: origemTransporte,
        destinoTransporte: destinoTransporte,
        gastoTransporte: Number(gastoTransporte),
        dataTransporte: dataTransporte,
        viagemId: Number(id),
      }

      await axios.post("http://localhost:3000/cadastro-transporte", dados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })

      setMensagemSucesso("Transporte cadastrado com sucesso!")
      setTimeout(() => {
        navigate(`/info-viagem/${id}`)
      }, 2000)

      setTipoTransporte("")
      setOrigemTransporte("")
      setDestinoTransporte("")
      setGastoTransporte("")
      setDataTransporte("")

    } catch (error) {
      console.error("Erro ao realizar o cadastro de transporte", error)
    }
  }

  return (
    <div className="card">
      <h1 className="titulo">Cadastrar Transporte</h1>

      <form className="form" onSubmit={enviarForm}>
        <div className="campos">
          <label htmlFor="tipoTransporte" className="label">Tipo de Transporte</label>
          <select name="tipoTransporte" id="tipoTransporte" className="select"
            value={tipoTransporte} onChange={(e) => setTipoTransporte(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Aviao">Avião</option>
            <option value="Barco">Barco</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Caminhada">Caminhada</option>
            <option value="Canoa">Canoa</option>
            <option value="Carro">Carro</option>
            <option value="Helicoptero">Helicóptero</option>
            <option value="Metro">Metrô</option>
            <option value="Moto">Moto</option>
            <option value="Navio">Navio</option>
            <option value="Onibus">Ônibus</option>
            <option value="Submarino">Submarino</option>
            <option value="Trem">Trem</option>
          </select>
        </div>

        <div className="campos">
          <label htmlFor="localOrigem" className="label">De:</label>
          <InputLocal
            local={origemTransporte}
            setLocal={setOrigemTransporte}
            className="input"
          />
        </div>

        <div className="campos">
          <label htmlFor="localDestino" className="label">Até:</label>
          <InputLocal
            local={destinoTransporte}
            setLocal={setDestinoTransporte}
            className="input"
          />
        </div>

        <div className="campos">
          <label htmlFor="gasto" className="label">Gasto</label>
          <input
            type="number"
            id="gasto"
            name="gasto"
            className="input"
            value={gastoTransporte}
            onChange={(e) => setGastoTransporte(e.target.value)}
            placeholder="Insira o gasto com o transporte"
          />
        </div>

        <div className="campos">
          <label htmlFor="data" className="label">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            className="input"
            value={dataTransporte}
            onChange={(e) => setDataTransporte(e.target.value)}
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

export default CadastroTransporte