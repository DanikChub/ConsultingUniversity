import React, { createContext, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import UserStore from "./app/stores/UserStore"
import App from "./App"
import { observer } from "mobx-react-lite"
import {SocketProvider} from "./providers/SocketProvider";


export const Context = createContext(null)

const Root = observer(() => {
    const [userStore] = useState(() => new UserStore())

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            userStore.setUser(JSON.parse(savedUser))
            userStore.setIsAuth(true)
        }
    }, [userStore])

    useEffect(() => {
        if (userStore.isAuth && userStore.user) {
            localStorage.setItem("user", JSON.stringify(userStore.user))
        }
    }, [userStore.user, userStore.isAuth])

    const token = localStorage.getItem("token")

    return (
        <Context.Provider value={{ user: userStore }}>
            <SocketProvider token={userStore.isAuth ? token : null}>
                <App />
            </SocketProvider>
        </Context.Provider>
    )
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Root />)