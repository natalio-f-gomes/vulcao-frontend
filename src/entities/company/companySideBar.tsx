import { useNavigate, Link } from "react-router-dom";
import { CompanyModel } from "../../api/interfaces";
import { useUserAuthManager } from "../../api/authentication-handler";
import { companyName } from "../../api/global";

export type CompanyView = "overview" | "staffview" | "productView" | "electronicView" | "tvShowView" | 
                          "filmView" | "bookView" | "reviewsView" | "customerView" | "orderView" ;


interface Parameters {
    activeView: CompanyView;
    onNavigate: (view: CompanyView) => void;
    onBack: ()=> void;
    onLogout: (entityType: string) => void;
    company: CompanyModel
}

export const styles: Record<string, React.CSSProperties> = {
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
    color: "white",
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


function CompanySidebar({activeView, onBack, onNavigate, onLogout, company}: Parameters){
    const navigate = useNavigate();
    const { isEntityLoggedIn, logoutHandler } = useUserAuthManager();
    
      async function handleLogout() {
        await logoutHandler();
        navigate("/");
      }

  
  const itemStyle = (view: CompanyView): React.CSSProperties =>
    activeView === view ? { ...styles.navItem, ...styles.navItemActive } : styles.navItem;
  
  return (
<aside style={styles.sidebar}>
  <div style={styles.brand}>
    <a style={styles.brandLogo} href="/">
      <span style={styles.brandAccent}>{companyName}</span>
    </a>
  </div>
  <span style={styles.brandSub}>{company.name} - Painel de Controlo</span>

  <nav style={styles.nav}>
    <div style={styles.sectionLabel}>Visão Geral</div>
    <a style={itemStyle("overview")} onClick={() => onNavigate("overview")}>
      <i className="bi bi-grid-1x2" /> Painel de Controlo
    </a>

    <a style={itemStyle("staffview")} onClick={() => onNavigate("staffview")}>
      <i className="bi bi-people" /> Gestão de Funcionários
    </a>

    <div style={styles.sectionLabel}>Ofertas</div>

    <a style={itemStyle("productView")} onClick={() => onNavigate("productView")}>
      <i className="bi bi-box-seam" /> Produtos
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
    */}
    {/*
    <a style={itemStyle("reviewsView")}>
      <i className="bi bi-people" /> Avaliações
    </a>
    */}

    {/* <div style={styles.sectionLabel}>Sistema</div>
    <a style={itemStyle("productView")}>
      <i className="bi bi-gear" /> Definições
    </a> */}
  </nav>

  <div style={styles.footer}>
    <div style={styles.ownerInfo}>
      <div className="owner-avatar"><i className="bi bi-person" /></div>
      <div>
        <div style={styles.ownerName}>{`@${company?.creatorUsername} `}</div>
        <div style={styles.ownerRole}>Empresário</div>
      </div>
      <button style={styles.signoutBtn} onClick={handleLogout} title="Terminar Sessão">
        <i className="bi bi-box-arrow-right" />
      </button>
    </div>
  </div>
</aside>
  );
}

export default CompanySidebar;