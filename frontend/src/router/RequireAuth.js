import { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export function RequireAuth({ children }) {
    const authContext = useContext(AuthContext)
    const location = useLocation()

    if (!authContext.isAuth) {
        return <Navigate to='/login' state={{ from: location }} />
    }

    return children
}