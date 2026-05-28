import React from "react";
import { EmployerDashView } from "./employer-dashboard";
import { EmployerModel } from "../../../api/interfaces";
import { useNavigate } from "react-router-dom";
import { useUserAuthManager } from "../../../api/authentication-handler";
import { companyName } from "../../../api/global";
interface SidebarParameters {
    activeView: EmployerDashView;
    onNavigate: (view: EmployerDashView) => void;
    employer: EmployerModel | null
}

const styles: Record<string, React.CSSProperties> = {
 sidebar: {
    background: "#0f0e0e",
    color: "#bbb",
    minHeight: "100vh",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "1.25rem 0",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    flex: 1,         
  },
  brand: {
    padding: "0 1.25rem 1rem",
    borderBottom: "1px solid #1e1e1e",
  },
  brandLogo: {
    color: "#f7f4ef",
    textDecoration: "none",
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.4rem",
    fontWeight: 900,
    letterSpacing: "-0.5px",
    display: "block",
  },
  brandAccent: {
    color: "#c8452a",
  },
  brandSub: {
    display: "block",
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#666",
    marginTop: "4px",
    padding: "0 1.25rem",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "0.5rem 0",
  },
  sectionLabel: {
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#555",
    padding: "1rem 1.25rem 0.35rem",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "0.6rem 1.25rem",
    fontSize: "0.85rem",
    color: "#999",
    cursor: "pointer",
    textDecoration: "none",
    borderLeft: "3px solid transparent",
  },
  navItemActive: {
    color: "#f7f4ef",
    borderLeftColor: "#c8452a",
    background: "rgba(200, 69, 42, 0.08)",
  },
  footer: {
    marginTop: "auto",
    padding: "0.85rem 1rem 0",
    borderTop: "1px solid #1e1e1e",
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  ownerName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#f7f4ef",
  },
  ownerRole: {
    fontSize: "0.66rem",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  signoutBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#888",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

function EmployerDashSideBar({activeView, onNavigate, employer}: SidebarParameters){
    const navigate = useNavigate();
     const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
    
      async function handleLogout() {
        await logoutHandler();
        navigate("/");
      }


      const itemStyle = (view: EmployerDashView): React.CSSProperties =>
  activeView === view ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem;


return (
  <>
    {employer && (
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <a style={styles.brandLogo} href="/">
            <span style={styles.brandAccent}>{companyName}</span>
          </a>
        </div>
        <span style={styles.brandSub}>Business Dashboard</span>

        <nav style={styles.nav}>
          <div style={styles.sectionLabel}>Overview</div>
          <a style={itemStyle("overview")} onClick={() => onNavigate("overview")}>
            <i className="bi bi-grid-1x2" /> Dashboard
          </a>
          <a style={itemStyle("businesses")} onClick={() => onNavigate("businesses")}>
            <i className="bi bi-building" /> My Businesses
          </a>
          <a style={styles.navItem} onClick={() => onNavigate("businesses")}>
            <i className="bi bi-plus-circle" /> Register Business
          </a>

          <div style={styles.sectionLabel}>Store</div>
          <a style={itemStyle("orders")} onClick={() => onNavigate("orders")}>
            <i className="bi bi-bag-check" /> Orders
          </a>
          <a style={itemStyle("products")} onClick={() => onNavigate("products")}>
            <i className="bi bi-box-seam" /> Products
          </a>
          <a style={itemStyle("customers")} onClick={() => onNavigate("customers")}>
            <i className="bi bi-people" /> Customers
          </a>

          <div style={styles.sectionLabel}>System</div>
          <a style={itemStyle("settings")} onClick={() => onNavigate("settings")}>
            <i className="bi bi-gear" /> Settings
          </a>
        </nav>

        <div style={styles.footer}>
          <div style={styles.ownerInfo}>
            <div className="owner-avatar"><i className="bi bi-person" /></div>
            <div>
              <div style={styles.ownerName}>{`${employer?.firstName} ${employer?.lastName}`}</div>
              <div style={styles.ownerRole}>Business Owner</div>
            </div>
            <button style={styles.signoutBtn} onClick={handleLogout} title="Logout">
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        </div>
      </aside>
    )}
  </>
);
}

export default EmployerDashSideBar;
