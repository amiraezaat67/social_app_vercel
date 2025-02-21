import Joi from "joi"
import { isValidObjectId } from "mongoose"



const validObjectId = (value,helper)=>{
    const valid = isValidObjectId(value)
    if(!valid){
        return helper.message('Invalid ObjectId')
    }
    return value
}


export const GeneralRules =  {
    _id: Joi.string().custom(validObjectId),
    email: Joi.string().email()
}