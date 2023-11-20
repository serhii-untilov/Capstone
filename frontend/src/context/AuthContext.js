import React, { createContext, useEffect, useState } from 'react'
import { getUser } from '../services/userService'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        setIsAuth(!!token)
    }, [])

    return <AuthContext.Provider value={{ isAuth, setIsAuth }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }