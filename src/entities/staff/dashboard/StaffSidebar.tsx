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
  
  <span style={styles.brandSub}>{company?.name ?? ""} - Painel de Controlo</span>
   
  <nav style={styles.nav}>
    {/* 
    <div style={styles.sectionLabel}>Visão Geral</div>
    <a style={itemStyle("overview")} onClick={() => onNavigate("overview")}>
      <i className="bi bi-grid-1x2" /> Painel de Controlo
    </a>
    */}

    <a style={itemStyle("staffview")} onClick={() => onNavigate("staffview")}>
      <i className="bi bi-people" /> Funcionários
    </a>

    <div style={styles.sectionLabel}>Ofertas</div>

    <a style={itemStyle("productView")} onClick={() => onNavigate("productView")}>
      <i className="bi bi-box-seam" /> Produtos
    </a>
     <a style={itemStyle("orderView")} onClick={() => onNavigate("wearableView")}>
      <i className="bi bi-bag-check" /> Vestíveis
    </a>

    {/* 
    <a style={itemStyle("electronicView")} onClick={() => onNavigate("electronicView")}>
      <i className="bi bi-box-seam" /> Eletrónicos
    </a>
    <a style={itemStyle("tvShowView")} onClick={() => onNavigate("tvShowView")}>
      <i className="bi bi-box-seam" /> Programas TV
    </a>
    <a style={itemStyle("filmView")} onClick={() => onNavigate("filmView")}>
      <i className="bi bi-box-seam" /> Filmes
    </a>
    <a style={itemStyle("bookView")} onClick={() => onNavigate("bookView")}>
      <i className="bi bi-box-seam" /> Livros
    </a>
    */}

    <div style={styles.sectionLabel}>Loja</div>
    <a style={itemStyle("orderView")} onClick={() => onNavigate("orderView")}>
      <i className="bi bi-bag-check" /> Encomendas
    </a>
    
    {/* 
    <a style={itemStyle("customerView")}>
      <i className="bi bi-people" /> Clientes
    </a>
    <a style={itemStyle("reviewsView")}>
      <i className="bi bi-people" /> Avaliações
    </a>

    <div style={styles.sectionLabel}>Sistema</div>
    <a style={itemStyle("productView")}>
      <i className="bi bi-gear" /> Definições
    </a>
    */}
    <div style={styles.sectionLabel}>Conta</div>
    <a style={itemStyle("profileView")} onClick={() => onNavigate("profileView")}>
      <i className="bi bi-person" /> Perfil
    </a>
  </nav>

  <div style={styles.footer}>
    <div style={styles.ownerInfo}>
      <div className="owner-avatar"><i className="bi bi-person" /></div>
      <div>
        <div style={styles.ownerName}>{`@${staff?.username ?? ""} `}</div>
        <div style={styles.ownerRole}>Funcionário</div>
      </div>
      <button style={styles.signoutBtn} onClick={handleLogout} title="Terminar Sessão">
        <i className="bi bi-box-arrow-right" />
      </button>
    </div>
  </div>
</aside>
  );
}

export default StaffSidebar;
