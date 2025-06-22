import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

function Login () {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const { login } = useAuth()
    const navigate = useNavigate()

    const enviarLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(email)) {
                setMensagemFalha("Formato de e-mail inválido")

                setTimeout(() => {
                    setMensagemFalha("")
                }, 1500)
                
                return
            }

            const response = await axios.post("https://tripplanner.local/login", {
                email,
                senha
            })

            const token = response.data.token
            login(token)

            setMensagemSucesso("Login realizado com sucesso!")

            setTimeout(() => {
                navigate("/")
            }, 1500)

            setEmail("")
            setSenha("")

        } catch (error) {
            setMensagemFalha("Email ou senha inválidos")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            console.error(error)
        }
    }

    return (
        <div className="card">
            <h1 className="titulo">Login</h1>

            <form className="form" onSubmit={enviarLogin}>
                <div className="campos">
                    <label htmlFor="email" className="label">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="input" 
                        autoComplete="off"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Insira o seu email"
                    />
                </div>

                <div className="campos">
                    <label htmlFor="senha" className="label">Senha</label>
                    <input 
                        type="password" 
                        id="senha" 
                        name="senha" 
                        className="input" 
                        autoComplete="off"
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        placeholder="Insira a sua senha"
                    />
                </div>

                <div className="submitAuth">
                    <p>Não tem conta? <a href="/cadastro-usuario" className="link">Faça cadastro</a></p>

                    <button type="submit" className="entrar">Entrar</button>
                </div>
            </form>

            { mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : "" }
            { mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : "" }
      </div>
    )
}

export default Login