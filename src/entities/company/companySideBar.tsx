import { useNavigate, Link } from "react-router-dom";

export type CompanyView = "overview" | "staff" | "products";


interface Parameters {
    activeView: CompanyView;
    onNavigate: (view: CompanyView) => void;
    onBack: ()=> void;
    onLogout: (entityType: string) => void;
    companyId: string;
}


function CompanySidebar({activeView, onBack, onNavigate, onLogout, companyId}: Parameters){
    const navigate = useNavigate();

  const navClass = (view: CompanyView) =>
    `nav-item-company${activeView === view ? " active" : ""}`;
  return (
    <aside className="sidebar" >
      <div className="sidebar-brand">
        <a className="brand-logo" href="/">Shop<span>Lane</span></a>
        <div className="brand-sub">Company Dashboard</div>
      </div>

      <nav className="sidebar-nav" style={{marginLeft:20, marginRight:5}}>
        <div className="sidebar-section-label" style={{fontWeight:"bold"}}>Navigation</div>
        <Link className={navClass("overview")} to={`/company-dashboard/${companyId}`}>
          <i className="bi bi-grid-1x2"></i> Overview
        </Link>

        <div className="sidebar-section-label" style={{fontWeight:"bold"}}>Management</div>
        <a className={navClass("staff")} onClick={() => onNavigate("staff")} style={{marginBottom:"4px"}}>
          <i className="bi bi-people"></i> Staff
        </a><br/>
        <Link className={navClass("products")} to={`/company-dashboard/${companyId}/products`} style={{marginBottom:"4px"}}>
          <i className="bi bi-box-seam"></i> Products
        </Link>
        {/* <a className={navClass("services")} onClick={() => onNavigate("services")} style={{marginBottom:"4px"}}>
          <i className="bi bi-stars"></i> Services
        </a>
        <a className={navClass("reviews")} onClick={() => onNavigate("reviews")} style={{marginBottom:"4px"}}>
          <i className="bi bi-star-half"></i> Reviews
        </a> */}
      </nav>

      <div className="sidebar-footer">
        <div className="owner-info">
          <div className="owner-avatar"><i className="bi bi-person"></i></div>
          <div>
            <div className="owner-name">Executive</div>
            <div className="owner-role">Administrator</div>
          </div>
          <button className="btn-signout" onClick={() => onLogout(localStorage.getItem("active_role") ?? "") } title="Logout">
            <i className="bi bi-box-arrow-right"></i>
          </button>
          
        </div>
      </div>
    </aside>
  );
}

export default CompanySidebar;