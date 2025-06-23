import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/',
});

function Home() {
    const [viagem, setViagem] = useState<Viagem[]>([])
    const [busca, setBusca] = useState("")

    interface Viagem {
        idViagem: number,
        localOrigem: string,
        localDestino: string,
        codigoPais: string,
        dataInicial: string,
        dataFinal: string,
        usuarioId: number
    }

    useEffect(() => {
        api.get("/viagens", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then((response) => {
            setViagem(response.data)
            console.log("Tipo de response.data:", typeof response.data);
            console.log("Conteúdo de response.data:", response.data);
            console.log("É um array?", Array.isArray(response.data));
        })
        .catch((error) => {
            console.error("Erro ao buscar viagens", error)
        })
    }, [])

    const viagensFiltradas = viagem.filter((cidade) => 
        cidade.localDestino.toLowerCase().includes(busca.toLowerCase())
    )

    return (
        <div className="home">
            <div className="fileira">
                <h1 className="titulo">Adicione o seu destino</h1>
                <input 
                    type="text" 
                    placeholder="Procure sua viagem" 
                    className="input" 
                    value={busca} 
                    onChange={(e) => setBusca(e.target.value)}
                />
            </div>

            <div className="viagens">
                <div className="infoViagem">
                    <div className="adicionarViagem" style={{border: '5px solid #F58E27'}}>
                        <a href="/cadastro-viagem" className="icone">
                            <FontAwesomeIcon icon={faPlus}/>
                        </a>
                    </div>

                    <p>Adicionar viagem</p>
                </div>

                {viagensFiltradas.length > 0 ? (
                    viagensFiltradas.map((cidade) => (
                        <div className="infoViagem" key={cidade.idViagem}>
                            <div className="viagemCadastrada">
                                <a href={`/info-viagem/${cidade.idViagem}`}>
                                    <img src={`https://flagcdn.com/144x108/${cidade.codigoPais.toLowerCase()}.png`} alt="" />
                                </a>   
                            </div>
                            <p>{ cidade.localDestino }</p>
                        </div>
                    ))
                ) : (
                    <p>Não existe viagem cadastrada!</p>
                )}
            </div>
        </div>
    )
}

export default Home