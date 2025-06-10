import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME as string
const API_KEY = import.meta.env.VITE_API_KEY as string

const RotasMapa: React.FC<{ origem: string; destino: string }> = ({ origem, destino }) => {
  const [coordenadasRota, setCoordenadasRota] = useState<[number, number][]>([])
  const [rotaAtual, setRotaAtual] = useState<{ origem: [number, number], destino: [number, number] } | null>(null)
  const [erro, setErro] = useState<string>("")

  useEffect(() => {
    if (!origem || !destino) return

    const buscarCoordenadas = async () => {
      if (!origem.trim() || !destino.trim()) {
        setErro("Por favor, preencha ambos os campos.")
        return
      }

      setErro("")

      try {
        const responseOrigem = await fetch(`http://api.geonames.org/searchJSON?q=${origem}&maxRows=1&username=${GEONAMES_USERNAME}`)
        const dataOrigem = await responseOrigem.json()

        const responseDestino = await fetch(`http://api.geonames.org/searchJSON?q=${destino}&maxRows=1&username=${GEONAMES_USERNAME}`)
        const dataDestino = await responseDestino.json()

        if (dataOrigem.geonames.length > 0 && dataDestino.geonames.length > 0) {
          const latOrigem = parseFloat(dataOrigem.geonames[0].lat)
          const lonOrigem = parseFloat(dataOrigem.geonames[0].lng)
          const latDestino = parseFloat(dataDestino.geonames[0].lat)
          const lonDestino = parseFloat(dataDestino.geonames[0].lng)

          setRotaAtual({ origem: [latOrigem, lonOrigem], destino: [latDestino, lonDestino] })

          await buscarRotaGraphHopper(latOrigem, lonOrigem, latDestino, lonDestino)

        } else {
          setErro("Uma das cidades não foi encontrada!")
        }
        
      } catch (error) {
        console.error("Erro na busca:", error)
        setErro("Erro ao buscar as cidades.")
      }
    }

    buscarCoordenadas()
  }, [origem, destino])

  const buscarRotaGraphHopper = async (
    latOrigem: number,
    lonOrigem: number,
    latDestino: number,
    lonDestino: number
  ) => {
    try {
      const response = await fetch(`https://graphhopper.com/api/1/route?point=${latOrigem},${lonOrigem}&point=${latDestino},${lonDestino}&vehicle=car&locale=pt&points_encoded=false&key=${API_KEY}`)
      const data = await response.json()

      if (data.paths.length > 0) {
        const coordenadas = data.paths[0].points.coordinates.map(
          ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
        )

        setCoordenadasRota(coordenadas)
      } else {
        setErro("Não foi possível calcular a rota.")
      }

    } catch (error) {
      console.error("Erro ao buscar rota do GraphHopper:", error)
      setErro("Erro ao calcular a rota.")
    }
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {rotaAtual && (
        <MapContainer center={rotaAtual.origem} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy OpenStreetMap contributors'
          />

          {coordenadasRota.length > 0 && (
            <Polyline 
              positions={coordenadasRota} 
              color="blue" 
              weight={3}
            />
          )}
        </MapContainer>
      )}

      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  )
}

export default RotasMapa