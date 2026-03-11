import React, { createContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import type {ClientToServerEvents, ServerToClientEvents} from "../entities/chat/model/socket";
import {createSocket} from "../shared/lib/socket/socket";


interface SocketContextType {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
})

interface Props {
    children: React.ReactNode
    token: string | null
}

export const SocketProvider: React.FC<Props> = ({ children, token }) => {
    const [socket, setSocket] = useState<
        Socket<ServerToClientEvents, ClientToServerEvents> | null
    >(null)

    useEffect(() => {
        if (!token) return

        const newSocket = createSocket(token)
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [token])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}