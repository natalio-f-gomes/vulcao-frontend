import { Link, useNavigate } from "react-router-dom";
import { useUserAuthManager } from "../Auth/Auth-Handler";
import { COMPANY_NAME } from "../Interfaces/global";
import { useEffect } from "react";

const GetHeader: React.FC = () => {
  useEffect(() => {
    console.log("Header MOUNTED");
    return () => console.log("Header UNMOUNTED");
  }, []);
  const { isEntityLoggedIn, entityType, logoutHandler } = useUserAuthManager();
  const onNavigate = useNavigate();

  // Define these based on entity type
  const dashboardRoute =
    entityType === "CLIENT" ? "/client-dashboard" : "/employer-dashboard";
  const dashboardLabel =
    entityType === "CLIENT" ? "Perfil" : "Painel Empresário";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-0 align-items-center">
        <Link
          className="navbar-brand me-4 d-flex align-items-center ms-3"
          to="/"
        >
          <span>{COMPANY_NAME}</span>
        </Link>

        <button
          className="navbar-toggler navbar-toggler-white ms-auto me-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Alternar navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Início
              </Link>
            </li>

            <li className="nav-item">
              <a className="nav-link" onClick={() => onNavigate("/about")}>
                Sobre
              </a>
            </li>
          </ul>

          {/* Authentication section - moved outside the ul but inside the collapse div */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Cart Icon - Always visible */}
            <li className="nav-item me-2">
              <Link className="nav-link position-relative" to="/shopping/">
                <i
                  className="bi bi-cart-fill"
                  style={{ fontSize: "1.2rem" }}
                ></i>
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  Shop
                </span>
              </Link>
            </li>

            {/* Desconectado — mostrar menus suspensos de login/registo */}
            {!isEntityLoggedIn && (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person me-1"></i>Iniciar Sessão
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/client-login">
                        <i className="bi bi-person-fill"></i> Cliente
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/employer-login">
                        <i className="bi bi-shield-lock-fill"></i>Empresário(a)
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown" style={{ marginRight: 100 }}>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person me-1"></i>Registar
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/client-register">
                        <i className="bi bi-person-fill"></i>Cliente
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/employer-register">
                        <i className="bi bi-shield-lock-fill"></i>Empresário(a)
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* Conectado — mostrar perfil/painel de controlo + terminar sessão */}
            {isEntityLoggedIn && (
              <li className="nav-item dropdown me-3">
                <button
                  type="button"
                  className="nav-link dropdown-toggle user-menu-toggle"
                  id="header-account-menu"
                  data-bs-toggle="dropdown"
                >
                  <span className="user-menu-avatar">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  A Minha Conta
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link
                      className="dropdown-item"
                      id="user-dashboard"
                      to={dashboardRoute}
                    >
                      <i className="bi bi-speedometer2"></i>
                      {dashboardLabel}
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item dropdown-item-danger"
                      onClick={logoutHandler}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default GetHeader;
