import { io, Socket } from "socket.io-client"
import type {ClientToServerEvents, ServerToClientEvents} from "../../../entities/chat/model/socket";
import {SERVER_URL} from "../../config/api";


export const createSocket = (token: string): Socket<
    ServerToClientEvents,
    ClientToServerEvents
> => {
    console.log("SOCKET URL:", process.env.REACT_APP_API_URL)
    return io(SERVER_URL, {
        auth: {
            token,
        },
        transports: ["websocket"],
    })
}