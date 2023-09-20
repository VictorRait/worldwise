import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./FakeAuthContext"

function ProtectedRoute({children}) {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    useEffect(function(){
        if (!isAuthenticated) navigate('/')
    },[isAuthenticated, navigate])
    return children
}

export default ProtectedRoute
