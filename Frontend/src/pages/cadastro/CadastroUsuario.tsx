import React, { useState } from "react"
import { useNavigate } from "react-router"
import { cpf } from "cpf-cnpj-validator"

function CadastroUsuario () {
    const [nome, setNome] = useState("")
    const [cpfUsuario, setCpfUsuario] = useState("")
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const navigate = useNavigate()

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    const cadastroUsuario = (e: React.FormEvent) => {
        e.preventDefault()

        if(!nome || !cpfUsuario) {
            setMensagemFalha("Nome ou CPF não preenchido")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        } 
        
        if (!cpf.isValid(cpfUsuario)) {
            setMensagemFalha("CPF inválido ou não existe")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        localStorage.setItem("nome", nome)
        localStorage.setItem("cpfUsuario", cpfUsuario)

        setMensagemSucesso("Redirecionando para a próxima tela...")

        setTimeout(() => {
            navigate("/cadastro-usuario-auth")
        }, 2000)
    }

    return (
        <div className="card">
            <h1 className="titulo">Cadastro de Usuário</h1>

            <form className="form" onSubmit={cadastroUsuario}>
                <div className="campos">
                    <label htmlFor="nome" className="label">Nome Completo</label>
                    <input 
                        type="text" 
                        id="nome" 
                        name="nome" 
                        className="input" 
                        placeholder="Insira o seu nome completo"
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        autoComplete="off"
                    />
                </div>
                
                <div className="campos">
                    <label htmlFor="cpf" className="label">CPF</label>
                    <input 
                        type="text" 
                        id="cpf" 
                        name="cpf" 
                        className="input" 
                        placeholder="Insira o seu cpf"
                        value={cpfUsuario} 
                        onChange={(e) => setCpfUsuario(formatCPF(e.target.value))} 
                        maxLength={14}
                        autoComplete="off"
                    />
                </div>

                <div className="submitAuth">
                    <p>Já tem cadastro? <a href="/login" className="link">Faça login</a></p>
                    
                    <button type="submit" className="proximo">Próximo</button>
                </div>
            </form>

            {mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : ""}
            {mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : ""}
      </div>
    )
}

export default CadastroUsuario