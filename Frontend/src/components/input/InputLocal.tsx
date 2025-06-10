import { useState } from "react"

interface GeoNamesResposta {
  name: string
}

const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME as string

interface InputLocalProps {
  local: string
  setLocal: (cidade: string) => void
  className: string
}

const InputLocal: React.FC<InputLocalProps> = ({  local, setLocal, className }) => {
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

  return (
    <div>
      <input
        type="text"
        value={local}
        onChange={(e) => {
          setLocal(e.target.value)
          buscarSugestoes(e.target.value)
        }}
        list="sugestoes-cidades"
        placeholder="Insira o local"
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

export default InputLocal