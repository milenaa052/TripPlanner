import { useState } from "react"

interface GeoNamesResposta {
  name: string
  countryCode: string
}

const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME as string

interface InputDestinoProps {
  localDestino: string
  setLocalDestino: (cidade: string) => void
  setCodigoPais: (codigo: string) => void
  className: string
}

const InputDestino: React.FC<InputDestinoProps> = ({  localDestino, setLocalDestino, setCodigoPais, className }) => {
  const [sugestoes, setSugestoes] = useState<{ nome: string; codigoPais: string }[]>([])

  const buscarSugestoes = async (input: string) => {
    if (input.length < 3) {
      setSugestoes([])
      return
    }

    try {
      const response = await fetch(`http://api.geonames.org/searchJSON?q=${input}&maxRows=5&username=${GEONAMES_USERNAME}`)
      
      const data = await response.json()

      if (data.geonames.length > 0) {
        const opcoes = data.geonames.map((item: GeoNamesResposta) => ({
          nome: item.name,
          codigoPais: item.countryCode,
        }))

        setSugestoes(opcoes)

      } else {
        setSugestoes([])
      }

    } catch (error) {
      console.error("Erro ao buscar sugestões:", error)
      setSugestoes([])
    }
  }

  const selecionarCidade = (cidadeNome: string) => {
    setLocalDestino(cidadeNome)

    const cidadeEncontrada = sugestoes.find((sugestao) => sugestao.nome === cidadeNome)

    if (cidadeEncontrada) {
      setCodigoPais(cidadeEncontrada.codigoPais)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={localDestino}
        onChange={(e) => {
          setLocalDestino(e.target.value)
          buscarSugestoes(e.target.value)
        }}
        onBlur={() => selecionarCidade(localDestino)}
        list="sugestoes-cidades"
        placeholder="Insira a cidade de destino"
        className={className}
      />
      
      <datalist id="sugestoes-cidades">
        {sugestoes.map((sugestao, index) => (
          <option key={index} value={sugestao.nome} />
        ))}
      </datalist>
    </div>
  )
}

export default InputDestino