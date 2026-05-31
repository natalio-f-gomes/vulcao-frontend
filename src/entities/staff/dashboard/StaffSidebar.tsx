import { useNavigate } from "react-router-dom";
import { CompanyModel, StaffModel } from "../../../api/interfaces";
import { logoutEntity } from "../../../api/requests";
import { StaffDashView } from "./StaffDashboard";
import { CompanyView, styles } from "../../company/companySideBar";
import { useUserAuthManager } from "../../../api/authentication-handler";
import { companyName } from "../../../api/global";



interface Parameters {
    activeView: StaffDashView;
    onNavigate: (view: StaffDashView) => void;
    onBack: ()=> void;
    onLogout: (entityType: string) => void;
    staff: StaffModel,
    company: CompanyModel,
}


function StaffSidebar({activeView, onBack, onNavigate, onLogout, staff, company}:Parameters) {

  const navigate = useNavigate();
    const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
  
  async function handleLogout() {
    await logoutHandler();
    navigate("/");
  }
  
  const itemStyle = (view: StaffDashView): React.CSSProperties =>
    activeView === view ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem;

  const navClass = (view: StaffDashView) =>
    `nav-item-dash${activeView === view ? " active" : ""}`;

  return (
<aside style={styles.sidebar}>
        <div style={styles.brand}>
          <a style={styles.brandLogo} href="/">
            <span style={styles.brandAccent}>{companyName}</span>
          </a>
        </div>
        <span style={styles.brandSub}>{company?.name ?? ""} -  Dashboard</span>

        <nav style={styles.nav}>
          <div style={styles.sectionLabel}>Overview</div>
          <a style={itemStyle("overview")} onClick={() => onNavigate("overview")}>
            <i className="bi bi-grid-1x2" /> Dashboard
          </a>

           <a style={itemStyle("staffview")} onClick={() => onNavigate("staffview")}>
            <i className="bi bi-people" /> Staff Members
          </a>

          <div style={styles.sectionLabel} >Offerings</div>

          <a style={itemStyle("productView")} onClick={() => onNavigate("productView")}>
            <i className="bi bi-box-seam" /> Products
          </a>
          <a style={itemStyle("electronicView")} onClick={() => onNavigate("electronicView")}>
            <i className="bi bi-box-seam" /> Electronics
          </a>
          <a style={itemStyle("tvShowView")} onClick={() => onNavigate("tvShowView")}>
            <i className="bi bi-box-seam" /> TV Shows
          </a>
          <a style={itemStyle("filmView")} onClick={() => onNavigate("filmView")}>
            <i className="bi bi-box-seam" /> Films
          </a>
          <a style={itemStyle("bookView")} onClick={() => onNavigate("bookView")}>
            <i className="bi bi-box-seam" /> Books
          </a>

          <div style={styles.sectionLabel}>Store</div>
          <a style={itemStyle("orderView")}>
            <i className="bi bi-bag-check" /> Orders
          </a>
          <a  style={itemStyle("customerView")}>
            <i className="bi bi-people" /> Customers
          </a>
            <a  style={itemStyle("reviewsView")}>
            <i className="bi bi-people" /> Reviews
          </a>

          <div style={styles.sectionLabel}>System</div>
          <a style={itemStyle("productView")}>
            <i className="bi bi-gear" /> Settings
          </a>
          <div style={styles.sectionLabel}>Account</div>
          <a style={itemStyle("profileView")} onClick={()=> onNavigate("profileView")}>
            <i className="bi bi-person" /> Profile
          </a>
        </nav>

        <div style={styles.footer}>
          <div style={styles.ownerInfo}>
            <div className="owner-avatar"><i className="bi bi-person" /></div>
            <div>
              <div style={styles.ownerName}>{`@${staff?.username ?? ""} `}</div>
              <div style={styles.ownerRole}>Staff Member</div>
            </div>
            <button style={styles.signoutBtn} onClick={handleLogout} title="Logout">
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        </div>
      </aside>
  );
}

export default StaffSidebar;
