import { Chat } from "../../../DB/models/index.js"
import { authenticationMiddleware } from "../../../Middleware/authentication.middleware.js"
import { socketConnections } from "../../../utils/socket.uils.js"



export const getChatHistory = async (req, res, next) => {
    const {_id} = req.loggedInUser
    const {receiverId} = req.params

    const chat = await Chat.findOne({
        $or:[
        {senderId:_id, receiverId},
        {senderId:receiverId, receiverId:_id}
    ]
    }).populate([
        {path:'senderId', select:'username phone gender'},
        {path:'receiverId', select:'username phone gender'},
        {path:'messages.senderId', select:'username phone gender'}
    ])
    if(!chat) return res.status(404).json({ message: 'Chat not found' })

    return res.status(200).json({ message: 'Chat fetched successfully'  , chat})
}




export const SendMessage =async (socket)=>{
    return socket.on('sendMessage',async(msg )=>{
        const { receiverId, body} = msg


         const {accesstoken} = socket.handshake.auth
        const user = await authenticationMiddleware(accesstoken)

        let  createdChat = await Chat.findOneAndUpdate(
           { $or:[
                {senderId:user._id, receiverId},
                {senderId:receiverId, receiverId:user._id}
            ]},
            {
                $push:{messages:{body, senderId:user._id}}
            },
            {new:true}
        )

        console.log(createdChat);
        

        if(!createdChat){
            createdChat =   await Chat.create({
                senderId:user._id,
                receiverId,
                messages:[{body, senderId:user._id}]
            })
        }

        socket.emit("successMessage" , {chat:createdChat, body})

        const socketId = socketConnections.get(receiverId?.toString())

        socket.to(socketId).emit("receiveMessage" , { body})
    })
}