import React from "react";
import { EmployerDashView } from "./employer-dashboard";
import { EmployerModel } from "../../../api/interfaces";
import { useNavigate } from "react-router-dom";
import { logoutEntity } from "../../../api/requests";

interface SidebarParameters {
    activeView: EmployerDashView;
    onNavigate: (view: EmployerDashView) => void;
    employer: EmployerModel | null
}

function Sidebar({activeView, onNavigate, employer}: SidebarParameters){
    const navigate = useNavigate();

    function onLogout(entity: string){
        logoutEntity(entity)
        window.localStorage.removeItem("active_role")
        navigate("/")
    }


    const navClass = (view: EmployerDashView) => `nav-item-dash${activeView === view ? "active": ""}`

     return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <a className="brand-logo" href="/"><span>Vulcão</span></a>
        <div className="brand-sub">Business Dashboard</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        <a className={navClass("overview")} onClick={() => onNavigate("overview")}>
          <i className="bi bi-grid-1x2"></i> Dashboard
        </a>

        <div className="sidebar-section-label">My Businesses</div>
        <a className={navClass("businesses")} onClick={() => onNavigate("businesses")}>
          <i className="bi bi-building"></i> My Businesses
        </a>
        <a className="nav-item-dash" onClick={() => onNavigate("businesses")}>
          <i className="bi bi-plus-circle"></i> Register Business
        </a>

        <div className="sidebar-section-label">Store</div>
        <a className={navClass("orders")} onClick={() => onNavigate("orders")}>
          <i className="bi bi-bag-check"></i> Orders <span className="nav-badge">12</span>
        </a>
        <a className={navClass("products")} onClick={() => onNavigate("products")}>
          <i className="bi bi-box-seam"></i> Products
        </a>

    
        <div className="sidebar-section-label">People</div>
        <a className={navClass("customers")} onClick={() => onNavigate("customers")}>
          <i className="bi bi-people"></i> Customers
        </a>
      

        <div className="sidebar-section-label">System</div>
        <a className={navClass("settings")} onClick={() => onNavigate("settings")}>
          <i className="bi bi-gear"></i> Settings
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="owner-info">
          <div className="owner-avatar"><i className="bi bi-person"></i></div>
          <div>
            <div className="owner-name">{`${employer?.firstName} ${employer?.lastName}`}</div>
            <div className="owner-role">Business Owner</div>
          </div>
          <button className="btn-signout" onClick={() => onLogout(localStorage.getItem("active_role") ?? "") } title="Logout">
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
