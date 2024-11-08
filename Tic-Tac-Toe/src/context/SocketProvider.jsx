import { createContext } from "react"
import {io} from "socket.io-client"

export const SocketContext=createContext()

function SocketProvider({children}){
    const socket=io(import.meta.env.VITE_SERVER_URL)
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider