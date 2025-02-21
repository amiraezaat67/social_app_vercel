import { Server } from "socket.io"
import { authenticationMiddleware } from "../Middleware/index.js"
import { SendMessage } from "../Modules/User/Services/chat.service.js"



export const socketConnections = new Map()

const registerSocket = async(socketId,handshake)=>{ 
     // verify token
     const {accesstoken} = handshake.auth
     const user = await authenticationMiddleware(accesstoken)
     socketConnections.set(user?._id?.toString() , socketId)
     console.log('socket id registered');
     
     return 'socket id registered'
}

export const removeSocket=  (socket)=>{
    return socket.on('disconnect',async()=>{
        const {accesstoken} = socket.handshake.auth
        const user = await authenticationMiddleware(accesstoken)
        socketConnections.delete(user._id.toString())
        console.log('socket id disconnected');
        return 'socket id disconnected'
    })
}

export const establishSocketConnection = (server)=>{
    const io =  new Server(server, {
        cors: {
          origin: '*'
        }
    })

    return io.on('connection',async(socket)=>{

        await registerSocket(socket.id,socket.handshake)


        await SendMessage(socket)

        await removeSocket(socket)
      })
}
