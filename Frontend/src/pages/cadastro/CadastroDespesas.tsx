import { useState } from "react"
import { useParams } from "react-router"
import { useNavigate } from "react-router"
import axios from "axios"

function CadastroDespesas() {
    const [tipoDespesa, setTipoDespesa] = useState("")
    const [gasto, setGasto] = useState("")
    const [dataDespesa, setDataDespesa] = useState("")
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const navigate = useNavigate()

    const { id } = useParams()

    const enviarForm = async (e: React.FormEvent) => {
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
                viagemId: Number(id)
            }

            await axios.post("https://tripplanner.local/cadastro-despesa", dados, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            setMensagemSucesso("Despesa cadastrada com sucesso!")
            setTimeout(() => {
                navigate(`/info-viagem/${id}`)
            }, 2000)

            setTipoDespesa("")
            setGasto("")
            setDataDespesa("")

        } catch (error) {
            console.error("Erro ao realizar o cadastro de Despesa", error)
        }
    }
    return (
        <div className="card">
            <h1 className="titulo">Cadastro de Despesas</h1>

            <form className="form" onSubmit={enviarForm}>
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
                        value={dataDespesa} 
                        onChange={(e) => setDataDespesa(e.target.value)}
                        placeholder="Insira a data da despesa"
                    />
                </div>

                <div className="submit">
                    <button type="submit" className="salvar">Salvar</button>
                </div>
            </form>

            {mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : ""}
            {mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : ""}
      </div>
    )
}

export default CadastroDespesas