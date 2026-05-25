
import { Link } from "react-router-dom";
import { useUserAuthManager } from "../api/authentication-handler";

const GetHeader: React.FC = () => {
  const { isEntityLoggedIn, entityType, login,logoutHandler } = useUserAuthManager();

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid px-0 align-items-center">

        <Link className="navbar-brand me-4 d-flex align-items-center" to="/">
          Shop<span>Lane</span>
        </Link>

        <button className="navbar-toggler ms-auto me-3" type="button"
          data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto align-items-lg-center">
            <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
            <li className="nav-item"><a className="nav-link" href="#">About</a></li>

            {/* Logged out — show login/register dropdowns */}
            {!isEntityLoggedIn  && (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button"
                    data-bs-toggle="dropdown">
                    <i className="bi bi-person me-1"></i>Login
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/user-login"><i className="bi bi-person-fill"></i> User</Link></li>
                    <li><Link className="dropdown-item" to="/staff-login"><i className="bi bi-briefcase-fill"></i> Staff</Link></li>
                    <li><Link className="dropdown-item" to="/employer-login"><i className="bi bi-shield-lock-fill"></i> Employer</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button"
                    data-bs-toggle="dropdown">
                    <i className="bi bi-person me-1"></i>Register
                  </a>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/user-register"><i className="bi bi-person-fill"></i> Register as a User</Link></li>
                    <li><Link className="dropdown-item" to="/employer-register"><i className="bi bi-shield-lock-fill"></i> Register as a Business Owner</Link></li>
                  </ul>
                </li>
              </>
            )}

            {/* Logged in — show profile/dashboard + logout */}
              {isEntityLoggedIn && (
                <li className="nav-item nav-item-auth">
                  <Link
                      className="nav-link"
                      to={
                        entityType === "user"      ? "/user-account"        :
                        entityType === "employer" ? "/employer-dashboard" :
                        entityType === "staff"  ? "/staff-dashboard"  :
                        entityType === "admin"     ? "/admin-dashboard"     : "/"
                      }
                    >
                      {entityType === "user" 
                        ? "My Profile" 
                        : entityType === "staff" 
                          ? "Staff Dashboard" 
                          : "Dashboard"}
                    </Link>

                  <button className="btn-logout-nav" onClick={logoutHandler}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
              )}
          </ul>

          <form className="d-flex search-wrapper me-lg-3" role="search">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input className="form-control bg-transparent border-start-0 border-secondary text-cream shadow-none"
                type="search" placeholder="Search items..." aria-label="Search" />
            </div>
          </form>

          <Link to="/user-cart" className="cart-btn text-decoration-none mt-2 mt-lg-0">
            <i className="bi bi-bag"></i> Cart
            <span className="cart-badge">3</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GetHeader;