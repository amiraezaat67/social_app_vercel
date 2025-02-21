
import express from 'express'
import { config } from 'dotenv'
import { Server } from 'socket.io'
import {database_connection} from './DB/connection.js'
import { controllerHandler } from './utils/index.js'
import { authenticationMiddleware } from './Middleware/authentication.middleware.js'
import { establishSocketConnection } from './utils/socket.uils.js'
config()


const socketConnections = new Map()

const bootstrap = async () => {
  const app = express()
  
  const port = process.env.PORT || 3000
  app.use(express.json())

  // Handel all project con==trollers
  controllerHandler(app,express)

  database_connection()
  
  const server =  app.listen(port, () => {
      console.log('Social App server is running on port ' , port)
    })   

  // establishSocketConnection(server)

}


export default bootstrap


