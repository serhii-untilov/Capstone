import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { currentUser, getAnonymousUser } from '../services/userService'

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [user, setUser] = useState()

    useEffect(() => {
        const fetchData = async () => {
            currentUser()
                .then(user => setUser(user))
                .catch(e => console.log(e))
        }
        if (authContext.isAuth) {
            fetchData()
        } else {
            setUser(getAnonymousUser())
        }
        console.log(authContext.isAuth, user)
    }, [authContext])

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export { UserContext, UserProvider }