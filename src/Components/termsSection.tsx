import { useNavigate } from "react-router-dom";

function GetTermsSection() {
  const onNavigate = useNavigate();
  return (
    <>
      <span>
        Ao continuar, concordas com os Vulcao.net termos de usoe privacidade.
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("/terms");
          }}
          style={{ cursor: "pointer" }}
        >
          Termos de uso
        </a>
      </span>
    </>
  );
}

export default GetTermsSection;
