import { AppProps } from "next/app";
import "../../styles/globals.scss"
import { AuthProvider } from "../contexts/AuthContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";


function MyApp({Component, pageProps}: AppProps) {
    return (
        <AuthProvider>
            <Component {...pageProps}/>
            <ToastContainer autoClose= {3000} pauseOnHover = {false}/>
        </AuthProvider>
    )
}

export default MyApp