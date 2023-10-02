import { createContext, ReactNode, useState } from "react"
import { destroyCookie, setCookie, parseCookies } from "nookies"
import Router from "next/router"
import { api } from "../services/apiClient"

type AuthContextData = {
    user?: UserProps,
    isAuthenticated: boolean,
    signIn: (credentials: SignInProps) => Promise<void>,
    signOut: () => void
}

type UserProps = {
    id: string,
    name: string,
    email: string,
}

type SignInProps = {
    email: string,
    password: string,
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push("/")
    }
    catch(err){
        console.log("Error ao deslogar")
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user

    async function signIn ({email, password}: SignInProps) {
        try{
            const res = await api.post('/session', {
                email,
                password
            })

            //console.log(res.data)

            const { id, name, token } = res.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes
                path: "/" // quais caminhos terao acesso a cookie
            })

            setUser({
                id,
                name,
                email,
            })

            //Passar token para as proximas requisicoes 

            api.defaults.headers["Authorization"] = `Bearer ${token}`

            //Redirecionar para /dashboard
            Router.push("/dashboard")


        }catch(err){
            console.log("Erro ao acessar", err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}