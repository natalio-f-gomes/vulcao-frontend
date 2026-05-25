import { useNavigate } from "react-router-dom";
import { StaffModel } from "../../../api/interfaces";
import { logoutEntity } from "../../../api/requests";
import { StaffDashView } from "./StaffDashboard";

interface StaffSidebarProps {
  activeView: StaffDashView;
  onNavigate: (view: StaffDashView) => void;
  staff: StaffModel | null;
  productCount: number;
}

function StaffSidebar({ activeView, onNavigate, staff , productCount}: StaffSidebarProps) {
  const navigate = useNavigate();

  const onLogout = (entity: string) => {
    logoutEntity(entity);
    window.localStorage.removeItem("active_role");
    navigate("/");
  };

  const navClass = (view: StaffDashView) =>
    `nav-item-dash${activeView === view ? " active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <a className="brand-logo" href="/">
          Shop<span>Lane</span>
        </a>
        <div className="brand-sub">Staff Dashboard</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        <a
          className={navClass("overview")}
          onClick={() => onNavigate("overview")}
        >
          <i className="bi bi-grid-1x2"></i> Dashboard
        </a>

        {/* SINGLE company — no list, no register option */}
        <div className="sidebar-section-label">Workplace</div>
        <a
          className={navClass("company")}
          onClick={() => onNavigate("company")}
        >
          <i className="bi bi-building"></i> My Company
        </a>

        <div className="sidebar-section-label">Operations</div>
        <a
          className={navClass("orders")}
          onClick={() => onNavigate("orders")}
        >
          <i className="bi bi-bag-check"></i> Orders{" "}
          <span className="nav-badge">12</span>
        </a>
        <a
          className={navClass("products")}
          onClick={() => onNavigate("products")}
        >
          <i className="bi bi-box-seam"></i> Products
           <span className="nav-badge">{productCount}</span>
        </a>
        <a
          className={navClass("customers")}
          onClick={() => onNavigate("customers")}
        >
          <i className="bi bi-people"></i> Customers
        </a>

        <div className="sidebar-section-label">Personal</div>
        <a
          className={navClass("profile")}
          onClick={() => onNavigate("profile")}
        >
          <i className="bi bi-person-badge"></i> My Profile
        </a>
        <a
          className={navClass("settings")}
          onClick={() => onNavigate("settings")}
        >
          <i className="bi bi-gear"></i> Settings
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="owner-info">
          <div className="owner-avatar">
            <i className="bi bi-person"></i>
          </div>
          <div>
            <div className="owner-name">
              {staff ? `${staff.firstName} ${staff.lastName}` : "Staff Member"}
            </div>
            <div className="owner-role">{staff?.jobTitle || "Employee"}</div>
          </div>
          <button
            className="btn-signout"
            onClick={() =>
              onLogout(localStorage.getItem("active_role") ?? "")
            }
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default StaffSidebar;
