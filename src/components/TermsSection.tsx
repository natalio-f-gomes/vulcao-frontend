import { useNavigate } from "react-router-dom";
import { companyName } from "../api/global";

function GetTermsSection(){
    const onNavigate = useNavigate();
    return (
        <>
            <span>
                Ao continuar, concordas com os {companyName}{" "}
                <a 
                    href="#" 
                    onClick={(e) => {
                    e.preventDefault();
                    onNavigate("/terms");
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    termos de uso
                </a>
        </span>
        </>
    )
}

export default GetTermsSection;