import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import Leaflet from "leaflet"
import "leaflet/dist/leaflet.css"

const GEONAMES_USERNAME = "milenaa052"

const marcadorIcone = new Leaflet.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const AlterarVisualizacao: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const mapa = useMap()
  mapa.setView(center, zoom)
  return null
}

const MapaComponente: React.FC<{ local: string }> = ({ local }) => {
  const [posicao, setPosicao] = useState<[number, number]>([0, 0])

  useEffect(() => {
    if (!local) return

    const buscarLocalizacao = async () => {
      try {
        const response = await fetch(`http://api.geonames.org/searchJSON?q=${local}&maxRows=1&username=${GEONAMES_USERNAME}`)

        const data = await response.json()

        if (data.geonames.length > 0) {
          const cidadeEncontrada = data.geonames[0]
          setPosicao([parseFloat(cidadeEncontrada.lat), parseFloat(cidadeEncontrada.lng)])
        }

      } catch (error) {
        console.log("Erro ao buscar localização:", error)
      }
    }

    buscarLocalizacao()
  }, [local])

  return (
    <div style={{ height: "100%", width: "100%" }}>
        {posicao ? (
          <MapContainer center={posicao} zoom={12} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <AlterarVisualizacao center={posicao} zoom={12} />
              <Marker position={posicao} icon={marcadorIcone}>
                  <Popup>{local}</Popup>
              </Marker>
          </MapContainer>
        ) : (
        <p>Carregando mapa...</p>
        )}
    </div>
  )
}

export default MapaComponente