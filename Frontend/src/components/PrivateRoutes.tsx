import { Navigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import { JSX } from "react"

interface Props {
    children: JSX.Element
}

const PrivateRoute = ({ children }: Props) => {
    const { estaAutenticado } = useAuth()

    return estaAutenticado ? children : <Navigate to="/login" />
}

export default PrivateRoute