import express from "express"
import axios from "axios"
import UsuarioRoutes from "./routes/UsuarioRoutes"
import ViagemRoutes from "./routes/ViagemRoutes"
import DespesaRoutes from "./routes/DespesaRoutes"
import HospedagemRoutes from "./routes/HospedagemRoutes"
import TransporteRoutes from "./routes/TransporteRoutes"
import PasseioRoutes from "./routes/PasseioRoutes"
import loginRoutes from "./routes/loginRoutes"
import "./models/Associations"

const app = express()

app.use(express.json())

const cors = require('cors')
app.use(cors({
  origin: ["https://tripplanner.local", "http://localhost:5173"],
  credentials: true
}))

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get('/api/cidades', async (req, res) => {
  try {
    const { cidade } = req.query
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${cidade}&format=json`, {
      headers: { "User-Agent": "SeuApp/1.0 (milenasantosdeoliveira40@gmail.com)" }
    })

    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cidades" })
  }
})

app.use(loginRoutes)
app.use(UsuarioRoutes)
app.use(ViagemRoutes)
app.use(DespesaRoutes)
app.use(HospedagemRoutes)
app.use(TransporteRoutes)
app.use(PasseioRoutes)

export default app