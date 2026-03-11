import { io, Socket } from "socket.io-client"
import type {ClientToServerEvents, ServerToClientEvents} from "../../../entities/chat/model/socket";


export const createSocket = (token: string): Socket<
    ServerToClientEvents,
    ClientToServerEvents
> => {
    console.log("SOCKET URL:", process.env.REACT_APP_API_URL)
    return io(process.env.REACT_APP_API_URL, {
        auth: {
            token,
        },
        transports: ["websocket"],
    })
}