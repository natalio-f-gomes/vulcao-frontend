import { useNavigate } from "react-router-dom";
import { CompanyModel, UserProfileModel } from "../../api/interfaces";
import { PublicView } from "./BusinessPublicOverView";


const sidebarStyles: Record<string, React.CSSProperties> = {
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
  brand: { padding: "0 1.25rem 1rem", borderBottom: "1px solid #1e1e1e" },
  brandLogo: {
    color: "#f7f4ef",
    textDecoration: "none",
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.4rem",
    fontWeight: 900,
    letterSpacing: "-0.5px",
    display: "block",
  },
  brandAccent: { color: "#c8452a" },
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
  nav: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "0.5rem 0" },
  sectionLabel: {
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#888",
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
  badge: {
    marginLeft: "auto",
    background: "#c8452a",
    color: "#fff",
    fontSize: "0.62rem",
    fontWeight: 700,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px",
  },
  footer: { marginTop: "auto", padding: "0.85rem 1rem 0", borderTop: "1px solid #1e1e1e" },
  userInfo: { display: "flex", alignItems: "center", gap: "10px" },
  userName: { fontSize: "0.85rem", fontWeight: 600, color: "#f7f4ef" },
  userRole: { fontSize: "0.66rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" },
};

interface PublicSidebarProps {
  company: CompanyModel;
  activeView: PublicView;
  onNavigate: (view: PublicView) => void;
  currentUser: UserProfileModel | null;
  cartCount: number;
}

export default function PublicCompanySidebar({
  company,
  activeView,
  onNavigate,
  currentUser,
  cartCount
}: PublicSidebarProps) {
  const navigate = useNavigate();

  const itemStyle = (view: PublicView): React.CSSProperties =>
    activeView === view ? { ...sidebarStyles.navItem, ...sidebarStyles.navItemActive } : sidebarStyles.navItem;

  return (

<aside style={sidebarStyles.sidebar}>
  <div style={sidebarStyles.brand}>
    <a style={sidebarStyles.brandLogo} href="/">
      <span style={sidebarStyles.brandAccent}>{company.name?.charAt(0).toUpperCase()}</span>
      {company.name?.slice(1)}
    </a>
  </div>
  <span style={sidebarStyles.brandSub}>{company.category?.replaceAll("_", " ") || "Loja"}</span>

  <nav style={sidebarStyles.nav}>
    <div style={sidebarStyles.sectionLabel}>Navegar</div>
    <a style={itemStyle("overview")} onClick={() => onNavigate("overview")}>
      <i className="bi bi-shop" /> Visão Geral
    </a>
    <a style={itemStyle("products")} onClick={() => onNavigate("products")}>
      <i className="bi bi-box-seam" /> Produtos
    </a>
     <a style={itemStyle("wearables")} onClick={() => onNavigate("wearables")}>
      <i className="bi bi-box-seam" /> Vestíveis
    </a>

    <div style={sidebarStyles.sectionLabel}>A Sua Conta</div>
    <a style={itemStyle("cart")} onClick={() => onNavigate("cart")}>
      <i className="bi bi-bag" /> O Meu Carrinho
      {cartCount > 0 && <span style={sidebarStyles.badge}>{cartCount}</span>}
    </a>
    <a style={itemStyle("orders")} onClick={() => onNavigate("orders")}>
      <i className="bi bi-receipt" /> As Minhas Encomendas
    </a>
  </nav>

  <div style={sidebarStyles.footer}>
    <div style={sidebarStyles.userInfo}>
      <div className="owner-avatar"><i className="bi bi-person" /></div>
      {currentUser ? (
        <div>
          <div style={sidebarStyles.userName}>{`@${currentUser.username}`}</div>
          <div style={sidebarStyles.userRole}>Cliente</div>
        </div>
      ) : (
        <button
          style={{
            ...sidebarStyles.userName,
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/user-login")}
        >
          Iniciar Sessão
        </button>
      )}
    </div>
  </div>
</aside>
  );
}
