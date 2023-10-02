import Head from "next/head"
import styles from "./styles.module.scss"
import { Header } from "@/src/components/Header"
import { useState, FormEvent} from "react"
import { toast } from "react-toastify"
import { setupAPIClient } from "@/src/services/api"
import { canSSRAuth } from "@/src/utils/canSSRAuth"


export default function Category() {
    const [name, setName] = useState("")

    async function handleRegister(event: FormEvent) {
        event.preventDefault()

        if(name === ""){
            toast.warning("Preencha o campo")
            return
        }
        
        const apiClient = setupAPIClient()
        await apiClient.post("/category", {
            name: name
        })

        toast.success("Categoria adicionada com sucesso!")

        setName("")
    }

    return (
        <>
            <Head>
                <title>Nova categoria - App Pizzaria</title>
            </Head>
            <div>
            <Header/>
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form 
                    className={styles.form}
                    onSubmit={handleRegister}
                    >
                        <input 
                        type="text" 
                        placeholder="Digite o nome da categorias" 
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />

                        <button 
                        type="submit"
                        className={styles.buttonAdd}
                        >
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})