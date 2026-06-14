import React from "react";
import { UserDashView } from "../user-account";
import { UserProfileModel } from "../../../../api/interfaces";
import { useNavigate } from "react-router-dom";
import { useUserAuthManager } from "../../../../api/authentication-handler";

interface SideBarParamaters {
  currentView: UserDashView;
  onNavigate: (view: UserDashView) => void;
  currentUser: UserProfileModel | null;
}

function UserDashSideBar({ currentUser, currentView, onNavigate }: SideBarParamaters) {
  const navigate = useNavigate();
  const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();

  async function handleLogout() {
    await logoutHandler();
    navigate("/");
  }

  const goToSection = (sectionId: string) => {
    // Always switch to overview first
    onNavigate("overview");

    // Smooth scroll to section after render
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100); // Small delay to allow React to render the overview
  };

  const goToView = (view: UserDashView) => {
    onNavigate(view);
  };

  // Helper to determine if a nav item is active
  const isActive = (view: UserDashView, section?: string) => {
    if (view === "overview" && currentView === "overview") {
      return true; // All overview sections are active when in overview
    }
    return currentView === view;
  };

  return (
    <>
      {currentUser && (
       <aside className="profile-sidebar" style={{ color: "white" }}>
  <div className="avatar-ring">
    <i className="bi bi-person"></i>
  </div>
  <p className="sidebar-name">{currentUser.username || "Convidado"}</p>
  <p className="sidebar-id">ID: {currentUser.id || "N/A"}</p>
  <div className="sidebar-divider"></div>

  <nav className="sidebar-nav">
    {/* Secções de Visão Geral - Scroll dentro de Visão Geral */}
    <a
      href="#section-personal"
      className={`sidebar-nav-item ${currentView === "personalInfo" ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection("section-personal");
      }}
    >
      <i className="bi bi-person"></i> Informação Pessoal
    </a>

    <a
      href="#section-contact"
      className={`sidebar-nav-item ${currentView === "overview" ? "contact" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection("section-contact");
      }}
    >
      <i className="bi bi-envelope"></i> Contacto
    </a>

    <a
      href="#section-address"
      className={`sidebar-nav-item ${currentView === "overview" ? "address" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection("section-address");
      }}
    >
      <i className="bi bi-geo-alt"></i> Morada
    </a>

    {/* Carrinho - Altera a Visualização
    <a
      className={`sidebar-nav-item ${currentView === "cart" ? "active" : ""}`}
      onClick={() => goToView("cart")}
    >
      <i className="bi bi-cart-fill"></i> Carrinho
    </a>
    */}

    {/* Encomendas - Altera a Visualização */}
    <a
      className={`sidebar-nav-item ${currentView === "orders" ? "active" : ""}`}
      onClick={() => goToView("orders")}
    >
      <i className="bi bi-bag-fill"></i> Encomendas
    </a>

    {/* Segurança - Scroll dentro de Visão Geral */}
    <a
      href="#section-security"
      className={`sidebar-nav-item ${currentView === "security" ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        goToSection("section-security");
      }}
    >
      <i className="bi bi-shield-lock"></i> Segurança
    </a>
  </nav>

  <div className="sidebar-logout">
    <button className="btn-logout" onClick={handleLogout}>
      <i className="bi bi-box-arrow-right"></i> Terminar Sessão
    </button>
  </div>
</aside>
      )}
    </>
  );
}

export default UserDashSideBar;