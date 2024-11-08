import { Outlet } from "react-router-dom"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

function RootLayout(){
    return(
        <div>
            <Outlet></Outlet>
            <ToastContainer style={{fontSize:"1.4rem"}}></ToastContainer>
        </div>
    )
}

export default RootLayout