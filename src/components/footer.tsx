import { companyName } from "../api/global";

function GetFooterSection() {
    const currentYear: number = new Date().getFullYear();
    return (
    <footer> 
        <div> © {currentYear} <span>{companyName}</span>. Todos os direitos reservados. </div> 
        <div> Encomendas para clientes · Gestão para empresários. </div> 
        </footer>
    )
}

export default GetFooterSection