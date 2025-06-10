import { createContext, ReactNode, useContext, useState } from "react"

interface AuthContextType {
    token: string | null
    login: (token: string) => void
    logout: () => void
    estaAutenticado: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("authToken")
    )

    const login = (newToken: string) => {
        localStorage.setItem("authToken", newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem("authToken")
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, estaAutenticado: token ? true : false }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if(!context) throw new Error("useAuth precisa estar dentro do AuthProvider")
    return context
}