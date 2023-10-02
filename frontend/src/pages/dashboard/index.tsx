import { canSSRAuth } from "@/src/utils/canSSRAuth"
import Head from "next/head"
import { Header } from "@/src/components/Header"
import styles from "./styles.module.scss"
import { FiRefreshCcw } from "react-icons/fi"
import { setupAPIClient } from "@/src/services/api"
import { useState } from "react"
import Modal from "react-modal"
import { ModalOrder } from "@/src/components/ModalOrder"



type OrderProps = {
    id: string,
    table: string | number,
    status: boolean,
    draft: boolean,
    name: string | null
}

interface HomeProps {
    orders: OrderProps[]
}

export type OrderItemProps = {
    id: string,
    amount: number,
    order_id: string,
    product_id: string
    product: {
        id: string,
        name: string
        description: string,
        price: string,
        banner: string
    }
    order: {
        id: string,
        table: number,
        status: boolean,
        name: string | null
    }
}



export default function Dashboard({ orders }: HomeProps) {
    const [orderList, setOrderList] = useState(orders || [])
    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)


    function handleCloseModal() {
        setModalVisible(false)
    }

    async function handleOpenModalView(id: string) {

        const apiClient = setupAPIClient()

        const response = await apiClient.get("/order/detail", {
            params: {
                order_id: id,
            }
        })

        setModalItem(response.data)
        setModalVisible(true)
    }

    Modal.setAppElement("#__next")

    return(
        <>
            <Head>
                <title></title>
            </Head>

            <div>
            <Header/>
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>
                        <button>
                            <FiRefreshCcw color="#3fffa3" size={25} />
                        </button>
                    </div>

                    <article className={styles.listOrders}>
                        {orderList.map((item)=> {
                            return (
                                <section key={item.id} className={styles.orderItem}>
                                    <button onClick={() => handleOpenModalView(item.id)}>
                                        <div className={styles.tag}></div>
                                        <span>Mesa {item.table}</span>
                                    </button>
                                </section>
                            )
                        })}
                    </article>
                </main>
                 {modalVisible &&(
                    <ModalOrder
                    isOpen={modalVisible}
                    onRequestClose={handleCloseModal}
                    order={modalItem}
                    />
                 )}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get("/orders")


    return {
        props: {
            orders: response.data
        }
    }
})