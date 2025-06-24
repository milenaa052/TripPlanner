import React, { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"

function CadastroUsuarioAuth () {
    const [nome, setNome] = useState(localStorage.getItem("nome") || "")
    const [cpfUsuario, setCpfUsuario] = useState(localStorage.getItem("cpfUsuario") || "")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmaSenha, setConfirmaSenha] = useState("")
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const navigate = useNavigate()

    const validarNivelSenha = async (senha: string) => {
        const requisitos = {
            temMaiuscula: /[A-Z]/.test(senha),
            temMinuscula: /[a-z]/.test(senha),
            temNumero: /[0-9]/.test(senha),
            temEspecial: /[!@#$%&*°?]/.test(senha),
            tamanhoMinimo: senha.length >= 8
        }
          
        const valida = Object.values(requisitos).every(Boolean)
            
        return {
            valida,
            requisitos,
            mensagem: valida ? 'Senha válida' : 'Senha não atende aos requisitos mínimos'
        }
    }

    const cadastroUsuario = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !senha || !confirmaSenha) {
            setMensagemFalha("Todos os campos são obrigatórios.")
            
            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            setMensagemFalha("Formato de e-mail inválido")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)
            
            return
        }

        const validacaoNivelSenha =  await validarNivelSenha(senha)
        if (!validacaoNivelSenha.valida) {
            setMensagemFalha("Senha muito fraca")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)
            
            return
        }

        if (senha !== confirmaSenha) {
            setMensagemFalha("As senhas não coincidem.")
            
            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        try {
            await axios.post("/api/cadastro-usuario", {
                nome,
                cpfUsuario,
                email,
                senha
            })

            setMensagemSucesso("Usuário cadastrado com sucesso!")

            localStorage.removeItem("nome")
            localStorage.removeItem("cpfUsuario")

            setEmail("")
            setSenha("")
            setConfirmaSenha("")
            setNome("")
            setCpfUsuario("")

            setTimeout(() => {
                navigate("/login")
            }, 2000)

        } catch (error) {
            console.error("Erro ao cadastrar usuário", error)
        }
    }

    return (
        <div className="card">
            <h1 className="titulo">Cadastro de Usuário</h1>

            <form className="form" onSubmit={cadastroUsuario}>
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
                        placeholder="Insira um email válido"
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

                <div className="campos">
                    <label htmlFor="confirmaSenha" className="label">Confirme a sua senha</label>
                    <input 
                        type="password" 
                        id="confirmaSenha" 
                        name="confirmaSenha" 
                        className="input" 
                        autoComplete="off"
                        value={confirmaSenha} 
                        onChange={(e) => setConfirmaSenha(e.target.value)} 
                        placeholder="Confime a sua senha"
                    />
                </div>

                <div className="submitAuth">
                    <p>Já tem cadastro? <a href="/login" className="link">Faça login</a></p>

                    <div className="botoes">
                        <a href="/cadastro-usuario" className="voltar">Voltar</a>
                        
                        <button type="submit" className="salvar">Salvar</button>
                    </div>
                </div>
            </form>

            {mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : ""}
            {mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : ""}
      </div>
    )
}

export default CadastroUsuarioAuth