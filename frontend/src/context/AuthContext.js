import React, { createContext, useEffect, useState } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        setIsAuthenticated(!!token)
    }, [])

    return <AuthContext.Provider value={isAuthenticated}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }