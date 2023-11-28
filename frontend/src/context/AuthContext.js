import React, { createContext, useState } from 'react'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'))

    // useEffect(() => {
    //     const token = localStorage.getItem('access_token')
    //     setIsAuth(!!token)
    // }, [])

    return <AuthContext.Provider value={{ isAuth, setIsAuth }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }