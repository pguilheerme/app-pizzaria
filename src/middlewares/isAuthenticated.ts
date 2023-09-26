import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface Payload {
    sub:string;

}

export function isAuthenticated(req: Request, res: Response, next: NextFunction){
    
    //Receber token JWT
    const authToken = req.headers.authorization

    if(!authToken) {
        return res.status(401).end()
    }

    const [, token] = authToken.split(" ")

    try{
        //Validar o token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
            ) as Payload

            //Recuperar o id do token e inserir em uma variável request
            req.user_id = sub

            return next()

    }catch(error){
        return res.status(401).end()
    }

}