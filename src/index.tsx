import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 



const appEntryPoint = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

appEntryPoint.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>

)