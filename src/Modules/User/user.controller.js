

import  { Router} from 'express'
import * as UserServices from './Services/profile.service.js';
import * as ChatServices from './Services/chat.service.js'
import { Multer, MulterHost } from '../../Middleware/multer.middleware.js';
import { errorHandler } from '../../Middleware/error-handler.middleware.js';
import { ImageExtensions } from '../../constants/constants.js';
import { authenticationMiddleware } from '../../Middleware/authentication.middleware.js';

const userController = Router()
userController.patch(
    '/upload-profile',
    authenticationMiddleware(),
    Multer(ImageExtensions , 'profile').single('image'),
    errorHandler(UserServices.uploadProfilePicture)
)

userController.patch(
    '/upload-covers',
    authenticationMiddleware(),
    Multer(ImageExtensions , 'cover').array('images', 3),
    errorHandler(UserServices.uploadCoverPictures)
)

userController.patch(
    '/update-profile-cloud',
    authenticationMiddleware(),
    MulterHost(ImageExtensions).single('image'),
    errorHandler(UserServices.updateProfilePictureCloud)
)

userController.patch(
    '/upload-covers-cloud',
    authenticationMiddleware(),
    MulterHost(ImageExtensions).array('images' , 3),
    errorHandler(UserServices.uploadCoverCloudPictures)
)


userController.delete(
    '/delete-account',
    authenticationMiddleware(),
    errorHandler(UserServices.deleteAccount)
)


userController.patch(
    '/send-request/:requestToId',
    authenticationMiddleware(),
    errorHandler(UserServices.sendRequest)
)


userController.patch(
    '/accept-request/:requestFromId',
    authenticationMiddleware(),
    errorHandler(UserServices.acceptRequest)
)


userController.get(
    '/list-friends',
    authenticationMiddleware(),
    errorHandler(UserServices.ListFriends)
)



userController.get(
    '/get-chat-history/:receiverId',
    authenticationMiddleware(),
    errorHandler(ChatServices.getChatHistory)
)
export  {userController}

