import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { currentUser, getAnonymousUser } from '../services/userService'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const user = await currentUser()
            setUser(user)
        }
        if (authContext.isAuth) {
            fetchData().catch(console.error)
        } else {
            setUser(getAnonymousUser())
        }
    }, [authContext])

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }