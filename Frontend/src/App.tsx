import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router"
import "./App.css"
import Header from "./components/Header"
import CadastroUsuario from "./pages/cadastro/CadastroUsuario"
import CadastroUsuarioAuth from "./pages/cadastro/CadastroUsuarioAuth"
import Login from "./pages/Login"
import Usuario from "./pages/Usuario"
import Home from "./pages/Home"
import CadastroViagem from "./pages/cadastro/CadastroViagem"
import TelasInfo from "./pages/TelasInfo"
import CadastroHospedagem from "./pages/cadastro/CadastroHospedagem"
import CadastroTransporte from "./pages/cadastro/CadastroTransporte"
import CadastroPasseio from "./pages/cadastro/CadastroPasseio"
import CadastroDespesas from "./pages/cadastro/CadastroDespesas"
import PrivateRoute from "./components/PrivateRoutes"

function App() {
  return (
    <div>
      <Header />

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
          <Route path="/cadastro-usuario-auth" element={<CadastroUsuarioAuth />} />
          <Route 
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/cadastro-viagem" element={<CadastroViagem />} />
            <Route path="/info-viagem/:id" element={<TelasInfo />} />
            <Route path="/cadastro-hospedagem/:id" element={<CadastroHospedagem />} />
            <Route path="/cadastro-transporte/:id" element={<CadastroTransporte />} />
            <Route path="/cadastro-passeio/:id" element={<CadastroPasseio />} />
            <Route path="/cadastro-despesas/:id" element={<CadastroDespesas />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App