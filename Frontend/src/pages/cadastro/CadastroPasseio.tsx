import { useState } from "react"
import { useParams, useLocation } from "react-router"
import { useNavigate } from "react-router"
import axios from "axios"
import InputLocal from "../../components/input/InputLocal"

function CadastroPasseio() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const dataPasseio = queryParams.get("data")
  const [localPasseio, setLocalPasseio] = useState("")
  const [horaInicial, setHoraInicial] = useState("")
  const [horaFinal, setHoraFinal] = useState("")
  const [gastoPasseio, setGastoPasseio] = useState("")
  const [mensagemFalha, setMensagemFalha] = useState("")
  const [mensagemSucesso, setMensagemSucesso] = useState("")
  const navigate = useNavigate()

  const { id } = useParams()

  const enviarForm = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!localPasseio || !horaInicial || !horaFinal || !gastoPasseio) {
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
        horaInicial: horaInicial,
        horaFinal: horaFinal,
        gastoPasseio: Number(gastoPasseio),
        viagemId: Number(id),
      }

      await axios.post("https://tripplanner.local/cadastro-passeio", dados, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })

      setMensagemSucesso("Passeio cadastrado com sucesso!")
      setTimeout(() => {
        navigate(`/info-viagem/${id}`)
      }, 2000)

      setLocalPasseio("")
      setHoraInicial("")
      setHoraFinal("")
      setGastoPasseio("")

    } catch (error) {
      console.error("Erro ao realizar o cadastro de Passeio", error)
    }
  }

  return (
    <div className="card">
      <h1 className="titulo">Cadastrar Passeio</h1>

      <form className="form" onSubmit={enviarForm}>
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
          <button type="submit" className="salvar">Salvar</button>
        </div>
      </form>

      {mensagemFalha ? <p className="mensagemFalha">{mensagemFalha}</p> : ""}
      {mensagemSucesso ? <p className="mensagemSucesso">{mensagemSucesso}</p> : ""}
    </div>
  )
}

export default CadastroPasseio