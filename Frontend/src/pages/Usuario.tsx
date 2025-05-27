import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faCheck, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { cpf } from "cpf-cnpj-validator"
import { useAuth } from "../contexts/AuthContext"
import { useUsuario } from "../contexts/UsuarioContext"

function Usuario() {
    const [editando, setEditando] = useState(false)
    const { logout } = useAuth()
    const { usuario, updateUsuario } = useUsuario()

    const [nome, setNome] = useState("")
    const [cpfUsuario, setCpfUsuario] = useState("")
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmaSenha, setConfirmaSenha] = useState("")
    const [mensagemFalha, setMensagemFalha] = useState("")
    const [mensagemSucesso, setMensagemSucesso] = useState("")

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome)
            setCpfUsuario(usuario.cpfUsuario || "")
        }
    }, [usuario])

    const editar = () => setEditando(true)

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

    const salvar = async (e: React.FormEvent) => {
        e.preventDefault()
    
        if (!nome || !cpfUsuario) {
            setMensagemFalha("Nome e CPF são obrigatórios.")
            setTimeout(() => {
                setMensagemFalha("")
            }, 2000)

            return
        }

        if (!cpf.isValid(cpfUsuario)) {
            setMensagemFalha("CPF inválido ou não existe")

            setTimeout(() => {
                setMensagemFalha("")
            }, 1500)

            return
        }

        if (novaSenha) {
            const validacaoNivelSenha = await validarNivelSenha(novaSenha)
            if (!validacaoNivelSenha.valida) {
                setMensagemFalha("Senha muito fraca")
                setTimeout(() => setMensagemFalha(""), 1500)
                return
            }
        }
    
        if ((novaSenha || confirmaSenha || senhaAtual) && (!senhaAtual || novaSenha !== confirmaSenha)) {
            setMensagemFalha("Senhas não conferem ou senha atual não informada.")
            setTimeout(() => {
                setMensagemFalha("")
            }, 3000)

            return
        }
    
        try {
            await updateUsuario({
                nome,
                cpfUsuario,
                senhaAtual: senhaAtual || undefined,
                novaSenha: novaSenha || undefined,
            })
    
            setMensagemSucesso("Informações atualizadas com sucesso!")
            setTimeout(() => {
                setMensagemSucesso("")
            }, 2000)

            setEditando(false)
            setSenhaAtual("")
            setNovaSenha("")
            setConfirmaSenha("")

        } catch (error) {
            setMensagemFalha("Erro ao atualizar informações.")
            console.error(error)
        }
    }

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }

    return (
        <div className="usuario">
            <div className="infoUsuario">
                <h1 className="titulo">
                    {editando ? (
                        <input 
                            type="text" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} 
                            className="input"
                        />
                    ) : (
                        <>Olá, { usuario?.nome }</>
                    )}
                    <FontAwesomeIcon 
                        icon={editando ? faCheck : faPenToSquare} 
                        className="icone" onClick={editando ? salvar : editar}
                    />
                </h1>
                <p className="email">{ usuario?.email }</p>
            </div>

            <div className="cardUser">
                <form className="form">
                    <div className="campos">
                        <label htmlFor="cpf" className="label">CPF</label>
                        <input 
                            type="text" 
                            id="cpf" 
                            name="cpf"
                            value={cpfUsuario}
                            onChange={(e) => setCpfUsuario(formatCPF(e.target.value))}
                            className="input" 
                            placeholder="Insira o seu CPF"
                            autoComplete="off"
                        />
                    </div>

                    <div className="campos">
                        <label htmlFor="senhaAtual" className="label">Senha Atual</label>
                        <input 
                            type="password" 
                            id="senhaAtual" 
                            name="senhaAtual"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            className="input" 
                            placeholder="Insira a sua senha atual"
                        />
                    </div>

                    <div className="campos">
                        <label htmlFor="novaSenha" className="label">Nova Senha</label>
                        <input 
                            type="password" 
                            id="novaSenha" 
                            name="novaSenha"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="input" 
                            placeholder="Insira a sua nova senha"
                        />
                    </div>

                    <div className="campos">
                        <label htmlFor="confimaSenha" className="label">Confirme a sua senha</label>
                        <input 
                            type="password" 
                            id="confimaSenha" 
                            name="confimaSenha" 
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            className="input" 
                            placeholder="Confime a sua senha"
                        />
                    </div>

                    <div className="submitAuth">
                        <button className="sair" type="button" onClick={logout}>
                            Logout <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </button>

                        <button type="button" className="salvar" onClick={salvar}>Salvar</button>
                    </div>
                </form>

                {mensagemFalha ? <p className="mensagemFalha">{ mensagemFalha }</p> : ""}
                {mensagemSucesso ? <p className="mensagemSucesso">{ mensagemSucesso }</p> : ""}
            </div>
        </div>
    )
}

export default Usuario