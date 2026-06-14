
import { Link } from "react-router-dom";
import { useUserAuthManager } from "../api/authentication-handler";
import { companyName } from "../api/global";

const GetHeader: React.FC = () => {
  const { isEntityLoggedIn, entityType, login,logoutHandler } = useUserAuthManager();

  return (
   <nav className="navbar navbar-expand-lg">
  <div className="container-fluid px-0 align-items-center">

    <Link className="navbar-brand me-4 d-flex align-items-center" to="/">
      <span>{companyName}</span>
    </Link>

    <button className="navbar-toggler ms-auto me-3" type="button"
      data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="mainNav">
      <ul className="navbar-nav me-auto align-items-lg-center">
        <li className="nav-item"><Link className="nav-link active" to="/">Início</Link></li>
        {/* 
        <li className="nav-item"><a className="nav-link" href="#">Sobre</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Contacte-nos</a></li>
        <li className="nav-item"><a className="nav-link" href="#">Sugerir Funcionalidade</a></li>
        */}
      </ul>

      <form className="d-flex search-wrapper me-lg-3" role="search">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0 border-secondary">
            <i className="bi bi-search text-secondary"></i>
          </span>
          <input className="form-control bg-transparent border-start-0 border-secondary text-cream shadow-none"
            type="search" placeholder="Pesquisar itens..." aria-label="Pesquisar" />
        </div>
      </form>

      {/* Desconectado — mostrar menus suspensos de login/registo */}
      {!isEntityLoggedIn && (
        <>
          <li className="nav-item dropdown" >
            <a className="nav-link dropdown-toggle" href="#" role="button"
              data-bs-toggle="dropdown">
              <i className="bi bi-person me-1"></i>Iniciar Sessão
            </a>
            <ul className="dropdown-menu">
              <li><Link className="dropdown-item" to="/user-login"><i className="bi bi-person-fill"></i> Cliente</Link></li>
              <li><Link className="dropdown-item" to="/staff-login"><i className="bi bi-briefcase-fill"></i>Funcionário(a)</Link></li>
              <li><Link className="dropdown-item" to="/employer-login"><i className="bi bi-shield-lock-fill"></i>Empresária(o)</Link></li>
            </ul>
          </li>
          <li className="nav-item dropdown" style={{marginRight:100}}>
            <a className="nav-link dropdown-toggle" href="#" role="button"
              data-bs-toggle="dropdown">
              <i className="bi bi-person me-1"></i>Registar
            </a>
            <ul className="dropdown-menu" >
              <li><Link className="dropdown-item" to="/user-register"><i className="bi bi-person-fill"></i> Registar Cliente</Link></li>
              <li><Link className="dropdown-item" to="/employer-register"><i className="bi bi-shield-lock-fill"></i> Registar Empresário</Link></li>
            </ul>
          </li>
        </>
      )}

      {/* Conectado — mostrar perfil/painel de controlo + terminar sessão */}
      {isEntityLoggedIn && (
        <li className="nav-item nav-item-auth">
          <Link
            className="nav-link"
            to={
              entityType === "user"      ? "/user-account"        :
              entityType === "employer" ? "/employer-dashboard" :
              entityType === "staff"    ? "/staff-dashboard"    :
              entityType === "admin"    ? "/admin-dashboard"    : "/"
            }
          >
            {entityType === "user" 
              ? "O Meu Perfil" 
              : entityType === "staff" 
                ? "Painel do Funcionário" 
                : "Painel de Controlo"}
          </Link>

          <button className="btn-logout-nav" onClick={logoutHandler}>
            <i className="bi bi-box-arrow-right"></i> Terminar Sessão
          </button>
        </li>
      )}
    </div>
  </div>
</nav>
  );
};

export default GetHeader;