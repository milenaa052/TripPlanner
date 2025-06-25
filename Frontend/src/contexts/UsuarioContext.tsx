import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "./AuthContext"
import axios from "axios"

interface UpdateUsuarioPayload {
  nome: string;
  email?: string;
  cpfUsuario?: string;
  senhaAtual?: string;
  novaSenha?: string;
}

interface UsuarioContextProps {
  usuario: { idUsuario: string; nome: string; email: string; cpfUsuario?: string } | null;
  setUsuario: (usuario: {
    idUsuario: string;
    nome: string;
    email: string;
    cpfUsuario?: string;
  }) => void;
  updateUsuario: (updatedUsuario: UpdateUsuarioPayload) => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextProps | undefined>(undefined)

export const UsuarioProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth()

  const [usuario, setUsuario] = useState<{
    idUsuario: string;
    nome: string;
    email: string;
    cpfUsuario?: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await axios.get("/api/usuario/perfil", {
            headers: {
              Authorization: `Bearer ${token}`
            }
        })

        setUsuario(response.data.usuario)

      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        toast.error("Erro ao carregar informações do usuário.");
      }
    };

    fetchUser();
  }, [token, setUsuario]);

  const updateUsuario = async (updateUsuario: UpdateUsuarioPayload) => {
    try {
      const response = await axios.put(`/api/usuario/${usuario?.idUsuario}`, updateUsuario,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setUsuario(response.data)

      toast.success("Usuário atualizado com sucesso!")

    } catch (error) {
      console.error("Erro ao atualizar usuário:", error)
      toast.error("Erro ao atualizar usuário. Tente novamente.")
    }
  };

  return (
    <UsuarioContext.Provider
      value={{ usuario, setUsuario, updateUsuario }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext)

  if (!context) {
    throw new Error("useUsuario precisa estar dentro do UsuarioProvider");
  }

  return context
}